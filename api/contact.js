import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Solo permitir POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, company, position, industry, message } = req.body;

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

    // Crear el contenido del email
    const emailContent = `
      <h2>Nuevo mensaje de contacto - IPC Solder</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
      ${company ? `<p><strong>Empresa:</strong> ${company}</p>` : ''}
      ${position ? `<p><strong>Posición:</strong> ${position}</p>` : ''}
      ${industry ? `<p><strong>Industria:</strong> ${industry}</p>` : ''}
      <p><strong>Mensaje:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      
      <hr>
      <p><small>Enviado desde el formulario de contacto de ipcsolder.com</small></p>
    `;

    // Enviar email con Resend
    const data = await resend.emails.send({
      from: 'contacto@ipcsolder.com', // Debe ser tu dominio verificado
      to: ['ventas@ipcsolder.com'],
      subject: `Nuevo contacto: ${name} - ${company || 'Sin empresa'}`,
      html: emailContent,
      replyTo: email, // Para que puedan responder directamente
    });

    console.log('Email sent successfully:', data);

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      id: data.id 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}