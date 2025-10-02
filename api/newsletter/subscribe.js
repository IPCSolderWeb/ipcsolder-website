import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { z } from 'zod';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

// Crear cliente de Supabase con Service Role (bypassa RLS)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Esquema de validación
const subscribeSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  language: z.enum(['es', 'en']).default('es')
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
    console.log('📧 Newsletter Subscribe: Iniciando suscripción', req.body);

    // Validar datos de entrada
    const { email, language } = subscribeSchema.parse(req.body);

    console.log('✅ Newsletter Subscribe: Datos validados', { email, language });

    // Verificar si el email ya existe
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, is_active, confirmed_at, unsubscribed_at')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Newsletter Subscribe: Error verificando email existente:', checkError);
      throw new Error('Error verificando suscripción existente');
    }

    // Si ya existe, manejar diferentes casos
    if (existingSubscriber) {
      console.log('🔍 Newsletter Subscribe: Email ya existe', existingSubscriber);

      // Si ya está activo y confirmado
      if (existingSubscriber.is_active && existingSubscriber.confirmed_at) {
        return res.status(200).json({
          success: true,
          message: 'Ya estás suscrito a nuestro newsletter',
          alreadySubscribed: true
        });
      }

      // Si se desuscribió anteriormente, reactivar
      if (existingSubscriber.unsubscribed_at) {
        console.log('🔄 Newsletter Subscribe: Reactivando suscripción anterior');
        
        const confirmationToken = crypto.randomBytes(32).toString('hex');
        const unsubscribeToken = crypto.randomBytes(32).toString('hex');

        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({
            is_active: false, // Inicia como false hasta confirmar
            confirmation_token: confirmationToken,
            unsubscribe_token: unsubscribeToken,
            unsubscribed_at: null,
            confirmed_at: null,
            subscribed_at: new Date().toISOString(),
            language: language
          })
          .eq('id', existingSubscriber.id);

        if (updateError) {
          console.error('❌ Newsletter Subscribe: Error reactivando suscripción:', updateError);
          throw new Error('Error reactivando suscripción');
        }

        // Enviar email de confirmación
        await sendConfirmationEmail(email, confirmationToken, language);

        return res.status(200).json({
          success: true,
          message: language === 'es' 
            ? 'Te hemos enviado un email de confirmación. Revisa tu bandeja de entrada.'
            : 'We sent you a confirmation email. Please check your inbox.'
        });
      }

      // Si existe pero no está confirmado, reenviar confirmación
      if (!existingSubscriber.confirmed_at) {
        console.log('📤 Newsletter Subscribe: Reenviando confirmación');
        
        // Generar nuevo token por seguridad
        const confirmationToken = crypto.randomBytes(32).toString('hex');
        
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({
            confirmation_token: confirmationToken,
            language: language
          })
          .eq('id', existingSubscriber.id);

        if (updateError) {
          console.error('❌ Newsletter Subscribe: Error actualizando token:', updateError);
          throw new Error('Error actualizando confirmación');
        }

        // Reenviar email de confirmación
        await sendConfirmationEmail(email, confirmationToken, language);

        return res.status(200).json({
          success: true,
          message: language === 'es'
            ? 'Te hemos reenviado el email de confirmación. Revisa tu bandeja de entrada.'
            : 'We resent the confirmation email. Please check your inbox.'
        });
      }
    }

    // Crear nueva suscripción
    console.log('➕ Newsletter Subscribe: Creando nueva suscripción');
    
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    const { data: newSubscriber, error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email,
        language: language,
        is_active: false, // Inicia como false hasta confirmar
        confirmation_token: confirmationToken,
        unsubscribe_token: unsubscribeToken
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Newsletter Subscribe: Error creando suscripción:', insertError);
      throw new Error('Error creando suscripción');
    }

    console.log('✅ Newsletter Subscribe: Suscripción creada', newSubscriber.id);

    // Enviar email de confirmación
    await sendConfirmationEmail(email, confirmationToken, language);

    // Respuesta exitosa
    return res.status(201).json({
      success: true,
      message: language === 'es'
        ? '¡Gracias por suscribirte! Te hemos enviado un email de confirmación.'
        : 'Thanks for subscribing! We sent you a confirmation email.'
    });

  } catch (error) {
    console.error('❌ Newsletter Subscribe: Error general:', error);

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

// Función para enviar email de confirmación
async function sendConfirmationEmail(email, token, language) {
  console.log('📧 Newsletter Subscribe: Enviando email de confirmación', { email, language });

  const confirmUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/newsletter/confirm?token=${token}`;
  
  const subject = language === 'es' 
    ? 'Confirma tu suscripción al blog de IPCSolder'
    : 'Confirm your subscription to IPCSolder blog';

  const htmlContent = language === 'es' ? `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirma tu suscripción</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">IPCSolder</h1>
        <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 16px;">Nosotros Somos Los Expertos</p>
      </div>
      
      <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1e3a8a; margin-top: 0;">¡Confirma tu suscripción!</h2>
        
        <p>Hola,</p>
        
        <p>Gracias por suscribirte a nuestro blog técnico de IPCSolder. Para completar tu suscripción y comenzar a recibir nuestros artículos sobre soldadura electrónica, componentes y tecnología industrial, necesitas confirmar tu email.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmUrl}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
            ✅ Confirmar Suscripción
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
          Si no te suscribiste a nuestro newsletter, puedes ignorar este email de forma segura.
        </p>
        
        <p style="color: #6b7280; font-size: 14px;">
          Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
          <a href="${confirmUrl}" style="color: #3b82f6; word-break: break-all;">${confirmUrl}</a>
        </p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            <strong>IPCSolder</strong><br>
            Guadalajara, Jalisco<br>
            <a href="mailto:ventas@ipcsolder.com" style="color: #3b82f6;">ventas@ipcsolder.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  ` : `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Confirm your subscription</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">IPCSolder</h1>
        <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 16px;">We Are The Experts</p>
      </div>
      
      <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1e3a8a; margin-top: 0;">Confirm your subscription!</h2>
        
        <p>Hello,</p>
        
        <p>Thank you for subscribing to our IPCSolder technical blog. To complete your subscription and start receiving our articles about electronic soldering, components and industrial technology, you need to confirm your email.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmUrl}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
            ✅ Confirm Subscription
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
          If you didn't subscribe to our newsletter, you can safely ignore this email.
        </p>
        
        <p style="color: #6b7280; font-size: 14px;">
          If the button doesn't work, copy and paste this link in your browser:<br>
          <a href="${confirmUrl}" style="color: #3b82f6; word-break: break-all;">${confirmUrl}</a>
        </p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            <strong>IPCSolder</strong><br>
            Guadalajara, Jalisco<br>
            <a href="mailto:ventas@ipcsolder.com" style="color: #3b82f6;">ventas@ipcsolder.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'IPCSolder Blog <noreply@ipcsolder.com>',
      to: [email],
      subject: subject,
      html: htmlContent
    });

    if (error) {
      console.error('❌ Newsletter Subscribe: Error enviando email:', error);
      throw new Error('Error enviando email de confirmación');
    }

    console.log('✅ Newsletter Subscribe: Email enviado exitosamente', data.id);
    return data;

  } catch (error) {
    console.error('❌ Newsletter Subscribe: Error en envío de email:', error);
    throw error;
  }
}