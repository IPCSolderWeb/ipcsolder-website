import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    // Permitir GET para enlaces de email
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Método no permitido'
        });
    }

    try {
        const { token } = req.query;

        console.log('🔐 Newsletter Confirm: Iniciando confirmación', { token: token?.substring(0, 8) + '...' });

        // Validar que el token existe
        if (!token) {
            return res.status(400).send(generateErrorPage('Token de confirmación requerido', 'Confirmation token required'));
        }

        // Buscar suscriptor con el token
        const { data: subscriber, error: findError } = await supabase
            .from('newsletter_subscribers')
            .select('id, email, is_active, confirmed_at, language, unsubscribed_at')
            .eq('confirmation_token', token)
            .single();

        if (findError || !subscriber) {
            console.error('❌ Newsletter Confirm: Token no encontrado:', findError);
            return res.status(404).send(generateErrorPage(
                'Token de confirmación inválido o expirado',
                'Invalid or expired confirmation token'
            ));
        }

        console.log('✅ Newsletter Confirm: Suscriptor encontrado', {
            email: subscriber.email,
            language: subscriber.language
        });

        // Verificar si ya está confirmado
        if (subscriber.is_active && subscriber.confirmed_at) {
            console.log('ℹ️ Newsletter Confirm: Ya estaba confirmado');
            return res.status(200).send(generateSuccessPage(
                subscriber.language,
                true // Ya confirmado
            ));
        }

        // Verificar si se había desuscrito (caso edge)
        if (subscriber.unsubscribed_at) {
            console.log('⚠️ Newsletter Confirm: Intentando confirmar suscripción desuscrita');
            return res.status(400).send(generateErrorPage(
                'Esta suscripción fue cancelada previamente',
                'This subscription was previously cancelled'
            ));
        }

        // Confirmar suscripción
        const { error: updateError } = await supabase
            .from('newsletter_subscribers')
            .update({
                is_active: true,
                confirmed_at: new Date().toISOString(),
                confirmation_token: null // Limpiar token usado
            })
            .eq('id', subscriber.id);

        if (updateError) {
            console.error('❌ Newsletter Confirm: Error confirmando suscripción:', updateError);
            return res.status(500).send(generateErrorPage(
                'Error interno confirmando suscripción',
                'Internal error confirming subscription'
            ));
        }

        console.log('🎉 Newsletter Confirm: Suscripción confirmada exitosamente', subscriber.email);

        // Página de éxito
        return res.status(200).send(generateSuccessPage(subscriber.language, false));

    } catch (error) {
        console.error('❌ Newsletter Confirm: Error general:', error);
        return res.status(500).send(generateErrorPage(
            'Error interno del servidor',
            'Internal server error'
        ));
    }
}

// Función para generar página de éxito
function generateSuccessPage(language, alreadyConfirmed) {
    const isSpanish = language === 'es';

    const title = isSpanish ? '¡Suscripción Confirmada!' : 'Subscription Confirmed!';
    const heading = alreadyConfirmed
        ? (isSpanish ? '¡Ya estabas suscrito!' : 'Already subscribed!')
        : (isSpanish ? '¡Suscripción Confirmada!' : 'Subscription Confirmed!');

    const message = alreadyConfirmed
        ? (isSpanish
            ? 'Tu suscripción ya estaba activa. Seguirás recibiendo nuestros artículos técnicos.'
            : 'Your subscription was already active. You will continue receiving our technical articles.')
        : (isSpanish
            ? '¡Gracias por confirmar tu suscripción! Ahora recibirás nuestros últimos artículos sobre soldadura electrónica, componentes y tecnología industrial.'
            : 'Thank you for confirming your subscription! You will now receive our latest articles about electronic soldering, components and industrial technology.');

    const blogButton = isSpanish ? 'Ver Blog' : 'View Blog';
    const homeButton = isSpanish ? 'Ir al Inicio' : 'Go Home';

    return `
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${title} - IPCSolder</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
          margin: 0;
          padding: 20px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: white;
          max-width: 500px;
          width: 100%;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          padding: 40px 30px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 32px;
          font-weight: bold;
        }
        .header p {
          margin: 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .success-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        .content h2 {
          color: #1e3a8a;
          margin: 0 0 20px 0;
          font-size: 28px;
        }
        .content p {
          color: #6b7280;
          margin-bottom: 30px;
          font-size: 16px;
        }
        .buttons {
          display: flex;
          gap: 15px;
          flex-direction: column;
        }
        .btn {
          padding: 15px 25px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.2s;
          display: inline-block;
        }
        .btn-primary {
          background: #3b82f6;
          color: white;
        }
        .btn-primary:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }
        .btn-secondary:hover {
          background: #e5e7eb;
          transform: translateY(-1px);
        }
        @media (min-width: 480px) {
          .buttons {
            flex-direction: row;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>IPCSolder</h1>
          <p>${isSpanish ? 'Nosotros Somos Los Expertos' : 'We Are The Experts'}</p>
        </div>
        
        <div class="content">
          <div class="success-icon">${alreadyConfirmed ? '✅' : '🎉'}</div>
          <h2>${heading}</h2>
          <p>${message}</p>
          
          <div class="buttons">
            <a href="/blog" class="btn btn-primary">${blogButton}</a>
            <a href="/" class="btn btn-secondary">${homeButton}</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Función para generar página de error
function generateErrorPage(messageEs, messageEn) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Error - IPCSolder</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
          margin: 0;
          padding: 20px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: white;
          max-width: 500px;
          width: 100%;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          padding: 40px 30px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 32px;
          font-weight: bold;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .error-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        .content h2 {
          color: #dc2626;
          margin: 0 0 20px 0;
          font-size: 24px;
        }
        .content p {
          color: #6b7280;
          margin-bottom: 30px;
        }
        .btn {
          background: #3b82f6;
          color: white;
          padding: 15px 25px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          transition: all 0.2s;
        }
        .btn:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>IPCSolder</h1>
        </div>
        
        <div class="content">
          <div class="error-icon">❌</div>
          <h2>Error</h2>
          <p><strong>ES:</strong> ${messageEs}</p>
          <p><strong>EN:</strong> ${messageEn}</p>
          
          <a href="/" class="btn">Volver al Inicio / Go Home</a>
        </div>
      </div>
    </body>
    </html>
  `;
}