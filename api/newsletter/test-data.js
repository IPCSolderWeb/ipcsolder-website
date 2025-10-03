import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Datos de prueba para el newsletter
    const testSubscribers = [
      {
        email: 'test1@example.com',
        language: 'es',
        is_active: true,
        confirmed_at: new Date().toISOString(),
        confirmation_token: 'test-token-1',
        unsubscribe_token: 'unsub-token-1'
      },
      {
        email: 'test2@example.com',
        language: 'en',
        is_active: true,
        confirmed_at: new Date().toISOString(),
        confirmation_token: 'test-token-2',
        unsubscribe_token: 'unsub-token-2'
      },
      {
        email: 'test3@example.com',
        language: 'es',
        is_active: false,
        confirmed_at: null,
        confirmation_token: 'test-token-3',
        unsubscribe_token: 'unsub-token-3'
      },
      {
        email: 'test4@example.com',
        language: 'en',
        is_active: true,
        confirmed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días atrás
        confirmation_token: 'test-token-4',
        unsubscribe_token: 'unsub-token-4'
      },
      {
        email: 'test5@example.com',
        language: 'es',
        is_active: true,
        confirmed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 días atrás
        confirmation_token: 'test-token-5',
        unsubscribe_token: 'unsub-token-5'
      }
    ];

    // Insertar datos de prueba
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .upsert(testSubscribers, { 
        onConflict: 'email',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      throw error;
    }

    res.status(200).json({ 
      message: 'Datos de prueba creados exitosamente',
      count: data.length,
      subscribers: data
    });

  } catch (error) {
    console.error('Error creating test data:', error);
    res.status(500).json({ 
      error: 'Error creating test data',
      details: error.message 
    });
  }
}