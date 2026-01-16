import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Crear cliente de Supabase con Service Role (bypassa RLS)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Esquema de validación
const downloadSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  name: z.string().optional(),
  company: z.string().optional(),
  subscribeNewsletter: z.boolean().default(false),
  language: z.enum(['es', 'en']).default('es'),
  source: z.string().default('products-page')
});

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método no permitido' 
    });
  }

  try {
    console.log('📥 Catalog Download: Iniciando registro', req.body);

    // Validar datos de entrada
    const validatedData = downloadSchema.parse(req.body);
    const { email, name, company, subscribeNewsletter, language, source } = validatedData;

    console.log('✅ Catalog Download: Datos validados', { email, name, company, subscribeNewsletter });

    // Verificar si el email ya existe en newsletter_subscribers
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, is_active, confirmed_at, catalog_downloaded_at')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Catalog Download: Error verificando email:', checkError);
      throw new Error('Error verificando registro existente');
    }

    const now = new Date().toISOString();

    if (existingSubscriber) {
      console.log('🔍 Catalog Download: Email ya existe, actualizando...', existingSubscriber.id);

      // Actualizar registro existente con información adicional
      const updateData = {
        catalog_downloaded_at: now,
        download_source: source,
        language: language
      };

      // Agregar nombre y empresa si se proporcionaron
      if (name) updateData.name = name;
      if (company) updateData.company = company;

      // Si marca newsletter y no está activo, activar suscripción
      if (subscribeNewsletter && !existingSubscriber.is_active) {
        updateData.is_active = true;
        if (!existingSubscriber.confirmed_at) {
          updateData.confirmed_at = now;
        }
      }

      const { error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update(updateData)
        .eq('id', existingSubscriber.id);

      if (updateError) {
        console.error('❌ Catalog Download: Error actualizando registro:', updateError);
        throw new Error('Error actualizando registro');
      }

      console.log('✅ Catalog Download: Registro actualizado exitosamente');

    } else {
      console.log('➕ Catalog Download: Creando nuevo registro');

      // Crear nuevo registro
      const insertData = {
        email: email,
        name: name || null,
        company: company || null,
        language: language,
        catalog_downloaded_at: now,
        download_source: source,
        is_active: subscribeNewsletter,
        confirmed_at: subscribeNewsletter ? now : null
      };

      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert(insertData);

      if (insertError) {
        console.error('❌ Catalog Download: Error creando registro:', insertError);
        throw new Error('Error creando registro');
      }

      console.log('✅ Catalog Download: Registro creado exitosamente');
    }

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      message: language === 'es'
        ? '¡Gracias! Tu descarga comenzará en un momento.'
        : 'Thank you! Your download will start shortly.',
      downloadUrl: '/documents/catalogoIPCSolder.pdf'
    });

  } catch (error) {
    console.error('❌ Catalog Download: Error general:', error);

    // Error de validación
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        details: error.errors
      });
    }

    // Error general
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
}
