import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

// Crear cliente de Supabase con Service Role (bypassa RLS)
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Esquema de validación para el blog
const blogNotificationSchema = z.object({
    blogId: z.string().uuid('ID de blog inválido'),
    title_es: z.string().min(1, 'Título en español requerido'),
    title_en: z.string().min(1, 'Título en inglés requerido'),
    excerpt_es: z.string().min(1, 'Resumen en español requerido'),
    excerpt_en: z.string().min(1, 'Resumen en inglés requerido'),
    slug: z.string().min(1, 'Slug requerido'),
    featured_image_url: z.string().url().optional(),
    category_es: z.string().optional(),
    category_en: z.string().optional(),
    reading_time: z.number().optional().default(5)
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
        console.log('📧 Blog Notification: Iniciando envío de newsletter', req.body);

        // Validar datos del blog
        const blogData = blogNotificationSchema.parse(req.body);

        console.log('✅ Blog Notification: Datos del blog validados', {
            blogId: blogData.blogId,
            slug: blogData.slug
        });

        // Obtener todos los suscriptores activos
        const { data: subscribers, error: subscribersError } = await supabase
            .from('newsletter_subscribers')
            .select('id, email, language, unsubscribe_token')
            .eq('is_active', true)
            .not('confirmed_at', 'is', null);

        if (subscribersError) {
            console.error('❌ Blog Notification: Error obteniendo suscriptores:', subscribersError);
            throw new Error('Error obteniendo suscriptores');
        }

        if (!subscribers || subscribers.length === 0) {
            console.log('ℹ️ Blog Notification: No hay suscriptores activos');
            return res.status(200).json({
                success: true,
                message: 'No hay suscriptores activos para enviar',
                sent: 0
            });
        }

        console.log(`📊 Blog Notification: ${subscribers.length} suscriptores activos encontrados`);

        // Separar suscriptores por idioma
        const spanishSubscribers = subscribers.filter(sub => sub.language === 'es');
        const englishSubscribers = subscribers.filter(sub => sub.language === 'en');

        console.log(`🇪🇸 Suscriptores ES: ${spanishSubscribers.length}`);
        console.log(`🇺🇸 Suscriptores EN: ${englishSubscribers.length}`);

        let totalSent = 0;
        const errors = [];

        // Enviar emails en español
        if (spanishSubscribers.length > 0) {
            try {
                const emailsEs = spanishSubscribers.map(subscriber => ({
                    from: 'IPCSolder Blog <noreply@ipcsolder.com>',
                    to: subscriber.email,
                    subject: `🔧 Nuevo artículo: ${blogData.title_es}`,
                    html: generateEmailTemplate(blogData, 'es', subscriber.unsubscribe_token)
                }));

                const { data: resultEs, error: errorEs } = await resend.batch.send(emailsEs);

                if (errorEs) {
                    console.error('❌ Blog Notification: Error enviando emails ES:', errorEs);
                    errors.push(`Error enviando emails en español: ${errorEs.message}`);
                } else {
                    totalSent += spanishSubscribers.length;
                    console.log(`✅ Blog Notification: ${spanishSubscribers.length} emails ES enviados`);
                }
            } catch (error) {
                console.error('❌ Blog Notification: Error en batch ES:', error);
                errors.push(`Error en lote español: ${error.message}`);
            }
        }

        // Enviar emails en inglés
        if (englishSubscribers.length > 0) {
            try {
                const emailsEn = englishSubscribers.map(subscriber => ({
                    from: 'IPCSolder Blog <noreply@ipcsolder.com>',
                    to: subscriber.email,
                    subject: `🔧 New article: ${blogData.title_en}`,
                    html: generateEmailTemplate(blogData, 'en', subscriber.unsubscribe_token)
                }));

                const { data: resultEn, error: errorEn } = await resend.batch.send(emailsEn);

                if (errorEn) {
                    console.error('❌ Blog Notification: Error enviando emails EN:', errorEn);
                    errors.push(`Error enviando emails en inglés: ${errorEn.message}`);
                } else {
                    totalSent += englishSubscribers.length;
                    console.log(`✅ Blog Notification: ${englishSubscribers.length} emails EN enviados`);
                }
            } catch (error) {
                console.error('❌ Blog Notification: Error en batch EN:', error);
                errors.push(`Error en lote inglés: ${error.message}`);
            }
        }

        // Registrar el envío en logs (opcional - podemos crear tabla después)
        console.log(`🎉 Blog Notification: Newsletter enviado exitosamente`, {
            blogId: blogData.blogId,
            totalSent,
            errors: errors.length
        });

        // Respuesta
        return res.status(200).json({
            success: true,
            message: `Newsletter enviado a ${totalSent} suscriptores`,
            sent: totalSent,
            subscribers: {
                spanish: spanishSubscribers.length,
                english: englishSubscribers.length
            },
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('❌ Blog Notification: Error general:', error);

        // Error de validación
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'Datos del blog inválidos',
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

// Función para generar template de email
function generateEmailTemplate(blogData, language, unsubscribeToken) {
    const isSpanish = language === 'es';

    const title = isSpanish ? blogData.title_es : blogData.title_en;
    const excerpt = isSpanish ? blogData.excerpt_es : blogData.excerpt_en;
    const category = isSpanish ? blogData.category_es : blogData.category_en;

    const blogUrl = `https://www.ipcsolder.com/blog/${blogData.slug}?lang=${language}`;
    const unsubscribeUrl = `https://www.ipcsolder.com/api/newsletter/unsubscribe?token=${unsubscribeToken}`;

    const texts = {
        es: {
            newArticle: '¡Nuevo Artículo Técnico!',
            readFull: 'Leer Artículo Completo',
            readingTime: 'Tiempo de lectura',
            minutes: 'minutos',
            category: 'Categoría',
            unsubscribe: 'Desuscribirse',
            footerText: 'Recibiste este email porque te suscribiste a nuestro blog técnico.',
            companyTagline: 'Nosotros Somos Los Expertos'
        },
        en: {
            newArticle: 'New Technical Article!',
            readFull: 'Read Full Article',
            readingTime: 'Reading time',
            minutes: 'minutes',
            category: 'Category',
            unsubscribe: 'Unsubscribe',
            footerText: 'You received this email because you subscribed to our technical blog.',
            companyTagline: 'We Are The Experts'
        }
    };

    const t = texts[language];

    return `
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${t.newArticle} - IPCSolder</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; margin: 0; padding: 20px;">
      
      <!-- Container -->
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0 0 10px 0; font-size: 32px; font-weight: bold;">IPCSolder</h1>
          <p style="color: #bfdbfe; margin: 0; font-size: 16px;">${t.companyTagline}</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          
          <!-- New Article Badge -->
          <div style="text-align: center; margin-bottom: 30px;">
            <span style="background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
              ${t.newArticle}
            </span>
          </div>
          
          <!-- Featured Image -->
          ${blogData.featured_image_url ? `
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${blogData.featured_image_url}" alt="${title}" style="max-width: 100%; height: 200px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            </div>
          ` : ''}
          
          <!-- Article Title -->
          <h2 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 28px; font-weight: bold; line-height: 1.3;">
            ${title}
          </h2>
          
          <!-- Article Excerpt -->
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            ${excerpt}
          </p>
          
          <!-- Meta Info -->
          <div style="display: flex; gap: 20px; margin-bottom: 30px; font-size: 14px; color: #6b7280;">
            <div style="display: flex; align-items: center;">
              <span style="margin-right: 5px;">⏱️</span>
              ${t.readingTime}: ${blogData.reading_time} ${t.minutes}
            </div>
            ${category ? `
              <div style="display: flex; align-items: center;">
                <span style="margin-right: 5px;">📂</span>
                ${t.category}: ${category}
              </div>
            ` : ''}
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${blogUrl}" style="background: #3b82f6; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.2s;">
              ${t.readFull} →
            </a>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0;">
            ${t.footerText}
          </p>
          
          <div style="margin-bottom: 20px;">
            <a href="${unsubscribeUrl}" style="color: #6b7280; font-size: 12px; text-decoration: underline;">
              ${t.unsubscribe}
            </a>
          </div>
          
          <div style="color: #9ca3af; font-size: 12px;">
            <strong>IPCSolder</strong><br>
            Guadalajara, Jalisco<br>
            <a href="mailto:ventas@ipcsolder.com" style="color: #3b82f6;">ventas@ipcsolder.com</a>
          </div>
        </div>
        
      </div>
      
    </body>
    </html>
  `;
}