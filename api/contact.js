import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Solo permitir POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, state, municipality, company, position, industry, message, language = 'es' } = req.body;

    console.log('🌐 Idioma recibido en API:', language);

    // Validación básica
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Name, email and message are required'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Template interno para ventas (en el idioma del cliente)
    const emailContent = language === 'en' ? `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New contact message - IPC Solder</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">IPC Solder</h1>
            <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 16px;">New contact message</p>
          </div>

          <!-- Language Notice -->
          <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px 20px; margin: 0;">
            <p style="color: #1e40af; margin: 0; font-weight: bold; font-size: 14px;">
              📧 Client prefers communication in: <strong>English</strong>
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 30px 20px;">
            
            <!-- Contact Info -->
            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Contact Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #475569; font-weight: bold; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #475569; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${email}</td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 8px 0; color: #475569; font-weight: bold;">Phone:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${phone}</td>
                </tr>` : ''}
                ${state ? `
                <tr>
                  <td style="padding: 8px 0; color: #475569; font-weight: bold;">State:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${state}</td>
                </tr>` : ''}
                ${municipality ? `
                <tr>
                  <td style="padding: 8px 0; color: #475569; font-weight: bold;">City:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${municipality}</td>
                </tr>` : ''}
              </table>
            </div>

            ${company || position || industry ? `
            <!-- Company Info -->
            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Company Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${company ? `
                <tr>
                  <td style="padding: 8px 0; color: #475569; font-weight: bold; width: 120px;">Company:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${company}</td>
                </tr>` : ''}
                ${position ? `
                <tr>
                  <td style="padding: 8px 0; color: #475569; font-weight: bold;">Position:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${position}</td>
                </tr>` : ''}
                ${industry ? `
                <tr>
                  <td style="padding: 8px 0; color: #475569; font-weight: bold;">Industry:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${industry}</td>
                </tr>` : ''}
              </table>
            </div>` : ''}

            <!-- Message -->
            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px;">
              <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Message</h3>
              <div style="background-color: #ffffff; border-radius: 6px; padding: 15px; color: #1e293b; line-height: 1.6;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0; font-size: 14px;">
              Sent from the contact form at <strong>ipcsolder.com</strong>
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nuevo mensaje de contacto - IPC Solder</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">IPC Solder</h1>
            <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 16px;">Nuevo mensaje de contacto</p>
          </div>

          <!-- Language Notice -->
          <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px 20px; margin: 0;">
            <p style="color: #1e40af; margin: 0; font-weight: bold; font-size: 14px;">
              📧 Cliente prefiere comunicación en: <strong>Español</strong>
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 30px 20px;">
            
            <!-- Contact Info -->
            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Información de contacto</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #475569; font-weight: bold; width: 120px;">Nombre:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #475569; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${email}</td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 8px 0; color: #475569; font-weight: bold;">Teléfono:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${phone}</td>
                </tr>` : ''}
                ${state ? `
                <tr>
                  <td style="padding: 8px 0; color: #475569; font-weight: bold;">Estado:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${state}</td>
                </tr>` : ''}
                ${municipality ? `
                <tr>
                  <td style="padding: 8px 0; color: #475569; font-weight: bold;">Ciudad:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${municipality}</td>
                </tr>` : ''}
              </table>
            </div>

            ${company || position || industry ? `
            <!-- Company Info -->
            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Información empresarial</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${company ? `
                <tr>
                  <td style="padding: 8px 0; color: #475569; font-weight: bold; width: 120px;">Empresa:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${company}</td>
                </tr>` : ''}
                ${position ? `
                <tr>
                  <td style="padding: 8px 0; color: #475569; font-weight: bold;">Posición:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${position}</td>
                </tr>` : ''}
                ${industry ? `
                <tr>
                  <td style="padding: 8px 0; color: #475569; font-weight: bold;">Industria:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${industry}</td>
                </tr>` : ''}
              </table>
            </div>` : ''}

            <!-- Message -->
            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px;">
              <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Mensaje</h3>
              <div style="background-color: #ffffff; border-radius: 6px; padding: 15px; color: #1e293b; line-height: 1.6;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0; font-size: 14px;">
              Enviado desde el formulario de contacto de <strong>ipcsolder.com</strong>
            </p>
          </div>

        </div>
      </body>
      </html>
    `;

    // Template de confirmación para el cliente
    const clientEmailContent = language === 'en' ? `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for contacting us - IPC Solder</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">IPC Solder</h1>
            <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 16px;">Thank you for contacting us</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px 20px;">
            <h2 style="color: #1e40af; margin: 0 0 20px 0; font-size: 22px;">Hello ${name},</h2>
            
            <p style="color: #1e293b; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
              Thank you for reaching out to us. We have received your message and our team will contact you soon.
            </p>
            
            <p style="color: #1e293b; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
              We appreciate your interest in IPC Solder and look forward to assisting you.
            </p>

            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; text-align: center;">
              <p style="color: #475569; margin: 0; font-size: 14px;">
                <strong>We will respond within 24-48 hours</strong>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); padding: 20px; text-align: center;">
            <a href="https://www.ipcsolder.com" style="color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">IPCSolder</a>
          </div>

        </div>
      </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gracias por contactarnos - IPC Solder</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">IPC Solder</h1>
            <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 16px;">Gracias por contactarnos</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px 20px;">
            <h2 style="color: #1e40af; margin: 0 0 20px 0; font-size: 22px;">Hola ${name},</h2>
            
            <p style="color: #1e293b; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
              Gracias por contactarnos. Hemos recibido tu mensaje y nuestro equipo se pondrá en contacto contigo pronto.
            </p>
            
            <p style="color: #1e293b; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
              Agradecemos tu interés en IPC Solder y esperamos poder ayudarte.
            </p>

            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; text-align: center;">
              <p style="color: #475569; margin: 0; font-size: 14px;">
                <strong>Responderemos en las próximas 24-48 horas</strong>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); padding: 20px; text-align: center;">
            <a href="https://www.ipcsolder.com" style="color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">IPCSolder</a>
          </div>

        </div>
      </body>
      </html>
    `;

    // 1. Enviar email interno a ventas
    const internalEmail = await resend.emails.send({
      from: 'contacto@ipcsolder.com',
      to: ['ventas@ipcsolder.com'],
      subject: language === 'en'
        ? `New contact: ${name} - ${company || 'No company'}`
        : `Nuevo contacto: ${name} - ${company || 'Sin empresa'}`,
      html: emailContent,
      replyTo: email,
    });

    // 2. Enviar email de confirmación al cliente
    const clientEmail = await resend.emails.send({
      from: 'contacto@ipcsolder.com',
      to: [email],
      subject: language === 'en' ? 'Thank you for contacting us - IPC Solder' : 'Gracias por contactarnos - IPC Solder',
      html: clientEmailContent,
    });

    console.log('Emails sent successfully:', { internal: internalEmail.id, client: clientEmail.id });

    return res.status(200).json({
      success: true,
      message: 'Emails sent successfully',
      ids: { internal: internalEmail.id, client: clientEmail.id }
    });

  } catch (error) {
    console.error('Error sending email:', error);

    return res.status(500).json({
      error: 'Failed to send email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}