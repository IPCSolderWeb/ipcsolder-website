import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { page = 1, limit = 50, status = 'all' } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('newsletter_subscribers')
      .select('id, email, name, company, language, is_active, confirmed_at, created_at, unsubscribed_at, catalog_downloaded_at, download_source')
      .order('created_at', { ascending: false });

    // Filtrar por estado
    if (status === 'active') {
      query = query.eq('is_active', true).not('confirmed_at', 'is', null);
    } else if (status === 'pending') {
      query = query.or('is_active.eq.false,confirmed_at.is.null');
    } else if (status === 'unsubscribed') {
      query = query.not('unsubscribed_at', 'is', null);
    }

    // Aplicar paginación
    query = query.range(offset, offset + limit - 1);

    const { data: subscribers, error: subscribersError } = await query;

    if (subscribersError) {
      throw subscribersError;
    }

    // Obtener el total de registros para la paginación
    let countQuery = supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true });

    if (status === 'active') {
      countQuery = countQuery.eq('is_active', true).not('confirmed_at', 'is', null);
    } else if (status === 'pending') {
      countQuery = countQuery.or('is_active.eq.false,confirmed_at.is.null');
    } else if (status === 'unsubscribed') {
      countQuery = countQuery.not('unsubscribed_at', 'is', null);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      throw countError;
    }

    // Formatear los datos para el frontend
    const formattedSubscribers = subscribers.map(sub => ({
      id: sub.id,
      email: sub.email,
      name: sub.name,
      company: sub.company,
      language: sub.language,
      status: sub.unsubscribed_at 
        ? 'unsubscribed' 
        : (sub.is_active && sub.confirmed_at) 
          ? 'active' 
          : 'pending',
      subscribedAt: sub.created_at,
      confirmedAt: sub.confirmed_at,
      unsubscribedAt: sub.unsubscribed_at,
      catalogDownloadedAt: sub.catalog_downloaded_at,
      downloadSource: sub.download_source,
      hasCatalog: sub.catalog_downloaded_at !== null,
      interest: sub.catalog_downloaded_at && sub.is_active && sub.confirmed_at 
        ? 'both' 
        : sub.catalog_downloaded_at 
          ? 'catalog' 
          : 'newsletter'
    }));

    res.status(200).json({
      subscribers: formattedSubscribers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    res.status(500).json({ 
      error: 'Error fetching subscribers',
      details: error.message 
    });
  }
}