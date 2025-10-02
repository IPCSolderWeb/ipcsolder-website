import { createClient } from '@supabase/supabase-js';

// Crear cliente de Supabase con Service Role (bypassa RLS)
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    // Permitir GET para mostrar confirmación y POST para procesar
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Método no permitido'
        });
    }

    try {
        const { token } = req.query;

        // Validar que el token existe
        if (!token) {
            return res.status(400).send(generateErrorPage(
                'Token de desuscripción requerido',
                'Unsubscribe token required'
            ));
        }

        // Buscar suscriptor con el token
        const { data: subscriber, error: findError } = await supabase
            .from('newsletter_subscribers')
            .select('id, email, is_active, confirmed_at, language, unsubscribed_at')
            .eq('unsubscribe_token', token)
            .single();

        if (findError || !subscriber) {
            console.error('❌ Newsletter Unsubscribe: Token no encontrado:', findError);
            return res.status(404).send(generateErrorPage(
                'Token de desuscripción inválido o expirado',
                'Invalid or expired unsubscribe token'
            ));
        }

        // Si es GET, mostrar página de confirmación
        if (req.method === 'GET') {
            console.log('👀 Newsletter Unsubscribe: Mostrando confirmación', {
                email: subscriber.email,
                language: subscriber.language
            });

            // Verificar si ya está desuscrito
            if (!subscriber.is_active && subscriber.unsubscribed_at) {
                return res.status(200).send(generateSuccessPage(
                    subscriber.language,
                    true // Ya desuscrito
                ));
            }

            // Mostrar página de confirmación
            return res.status(200).send(generateConfirmationPage(subscriber, token));
        }

        // Si es POST, procesar desuscripción
        if (req.method === 'POST') {
            console.log('🚫 Newsletter Unsubscribe: Procesando desuscripción', {
                email: subscriber.email,
                language: subscriber.language
            });

            // Verificar si ya está desuscrito
            if (!subscriber.is_active && subscriber.unsubscribed_at) {
                return res.status(200).send(generateSuccessPage(
                    subscriber.language,
                    true // Ya desuscrito
                ));
            }

            // Desuscribir
            const { error: updateError } = await supabase
                .from('newsletter_subscribers')
                .update({
                    is_active: false,
                    unsubscribed_at: new Date().toISOString()
                })
                .eq('id', subscriber.id);

            if (updateError) {
                console.error('❌ Newsletter Unsubscribe: Error desuscribiendo:', updateError);
                return res.status(500).send(generateErrorPage(
                    'Error interno procesando desuscripción',
                    'Internal error processing unsubscription'
                ));
            }

            console.log('✅ Newsletter Unsubscribe: Desuscripción exitosa', subscriber.email);

            // Página de éxito
            return res.status(200).send(generateSuccessPage(subscriber.language, false));
        }

    } catch (error) {
        console.error('❌ Newsletter Unsubscribe: Error general:', error);
        return res.status(500).send(generateErrorPage(
            'Error interno del servidor',
            'Internal server error'
        ));
    }
}

// Función para generar página de confirmación
function generateConfirmationPage(subscriber, token) {
  const isSpanish = subscriber.language === 'es';
  
  const title = isSpanish ? 'Confirmar Desuscripción' : 'Confirm Unsubscription';
  const heading = isSpanish ? '¿Deseas desuscribirte?' : 'Do you want to unsubscribe?';
  const message = isSpanish
    ? `Estás a punto de desuscribirte de nuestro newsletter técnico con el email: <strong>${subscriber.email}</strong>`
    : `You are about to unsubscribe from our technical newsletter with email: <strong>${subscriber.email}</strong>`;
  
  const confirmText = isSpanish
    ? 'Ya no recibirás más emails de nuestro blog técnico. Puedes volver a suscribirte en cualquier momento.'
    : 'You will no longer receive emails from our technical blog. You can resubscribe at any time.';

  const confirmButton = isSpanish ? 'Sí, Desuscribirme' : 'Yes, Unsubscribe Me';
  const cancelButton = isSpanish ? 'Cancelar' : 'Cancel';

  return `
    <!DOCTYPE html>
    <html lang="${subscriber.language}">
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
        .header p {
          margin: 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        .content h2 {
          color: #dc2626;
          margin: 0 0 20px 0;
          font-size: 28px;
        }
        .content p {
          color: #6b7280;
          margin-bottom: 20px;
          font-size: 16px;
        }
        .warning-box {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0 30px 0;
          font-size: 14px;
          color: #92400e;
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
          border: none;
          cursor: pointer;
        }
        .btn-danger {
          background: #dc2626;
          color: white;
        }
        .btn-danger:hover {
          background: #b91c1c;
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
          <div class="icon">⚠️</div>
          <h2>${heading}</h2>
          <p>${message}</p>
          
          <div class="warning-box">
            ${confirmText}
          </div>
          
          <form method="POST" style="display: inline;">
            <input type="hidden" name="token" value="${token}">
            <div class="buttons">
              <button type="submit" class="btn btn-danger">${confirmButton}</button>
              <a href="/blog" class="btn btn-secondary">${cancelButton}</a>
            </div>
          </form>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Función para generar página de éxito
function generateSuccessPage(language, alreadyUnsubscribed) {
    const isSpanish = language === 'es';

    const title = isSpanish ? 'Desuscripción Completada' : 'Unsubscription Completed';
    const heading = alreadyUnsubscribed
        ? (isSpanish ? 'Ya estabas desuscrito' : 'Already unsubscribed')
        : (isSpanish ? 'Desuscripción Completada' : 'Unsubscription Completed');

    const message = alreadyUnsubscribed
        ? (isSpanish
            ? 'Tu email ya estaba desuscrito de nuestro newsletter.'
            : 'Your email was already unsubscribed from our newsletter.')
        : (isSpanish
            ? 'Has sido desuscrito exitosamente de nuestro newsletter. Ya no recibirás más emails de nosotros. Lamentamos verte partir.'
            : 'You have been successfully unsubscribed from our newsletter. You will no longer receive emails from us. We\'re sorry to see you go.');

    const resubscribeText = isSpanish
        ? 'Si cambias de opinión, puedes suscribirte nuevamente en cualquier momento visitando nuestro blog.'
        : 'If you change your mind, you can subscribe again anytime by visiting our blog.';

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
          background: linear-gradient(135deg, #6b7280, #9ca3af);
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
        .icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        .content h2 {
          color: #374151;
          margin: 0 0 20px 0;
          font-size: 28px;
        }
        .content p {
          color: #6b7280;
          margin-bottom: 20px;
          font-size: 16px;
        }
        .resubscribe-note {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0 30px 0;
          font-size: 14px;
          color: #4b5563;
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
          <div class="icon">${alreadyUnsubscribed ? '✅' : '👋'}</div>
          <h2>${heading}</h2>
          <p>${message}</p>
          
          ${!alreadyUnsubscribed ? `<div class="resubscribe-note">${resubscribeText}</div>` : ''}
          
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