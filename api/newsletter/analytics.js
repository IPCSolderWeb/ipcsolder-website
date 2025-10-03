import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Obtener todos los suscriptores confirmados (is_active = true y confirmed_at no es null)
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('is_active', true)
      .not('confirmed_at', 'is', null);

    if (subscribersError) {
      throw subscribersError;
    }

    // Calcular métricas
    const totalSubscribers = subscribers.length;
    
    // Suscriptores por idioma
    const languageStats = subscribers.reduce((acc, sub) => {
      acc[sub.language] = (acc[sub.language] || 0) + 1;
      return acc;
    }, {});

    // Suscriptores de los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSubscribers = subscribers.filter(sub => 
      new Date(sub.created_at) >= thirtyDaysAgo
    ).length;

    // Suscriptores por mes (últimos 6 meses)
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthSubscribers = subscribers.filter(sub => {
        const subDate = new Date(sub.created_at);
        return subDate >= monthStart && subDate <= monthEnd;
      }).length;

      monthlyStats.push({
        month: date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
        subscribers: monthSubscribers
      });
    }

    // Obtener suscriptores no confirmados para calcular tasa de confirmación
    const { data: unconfirmedSubscribers, error: unconfirmedError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .or('is_active.eq.false,confirmed_at.is.null');

    if (unconfirmedError) {
      throw unconfirmedError;
    }

    const totalSignups = subscribers.length + unconfirmedSubscribers.length;
    const confirmationRate = totalSignups > 0 ? (subscribers.length / totalSignups * 100).toFixed(1) : 0;

    // Obtener los últimos 5 suscriptores confirmados
    const recentSubscribersList = subscribers
      .sort((a, b) => new Date(b.confirmed_at) - new Date(a.confirmed_at))
      .slice(0, 5)
      .map(sub => ({
        email: sub.email,
        language: sub.language,
        confirmedAt: sub.confirmed_at
      }));

    const analytics = {
      totalSubscribers,
      recentSubscribers,
      confirmationRate: parseFloat(confirmationRate),
      languageBreakdown: languageStats,
      recentSubscribersList,
      lastUpdated: new Date().toISOString()
    };

    res.status(200).json(analytics);

  } catch (error) {
    console.error('Error fetching newsletter analytics:', error);
    res.status(500).json({ 
      error: 'Error fetching analytics',
      details: error.message 
    });
  }
}