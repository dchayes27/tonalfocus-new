import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting map (simple in-memory solution)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Honeypot field name (should be hidden with CSS)
const HONEYPOT_FIELD = 'website';

// Clean up rate limit map periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (data.resetTime < now) {
      rateLimitMap.delete(ip);
    }
  }
}, 60000); // Clean up every minute

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit (5 requests per hour per IP)
    const now = Date.now();
    const rateLimit = rateLimitMap.get(ip);
    
    if (rateLimit) {
      if (rateLimit.resetTime > now && rateLimit.count >= 5) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }
      
      if (rateLimit.resetTime < now) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + 3600000 }); // 1 hour
      } else {
        rateLimit.count++;
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + 3600000 });
    }

    // Parse request body
    const body = await request.json();
    const { name, email, subject, message, [HONEYPOT_FIELD]: honeypot } = body;

    // Check honeypot field (spam protection)
    if (honeypot) {
      // Silently reject spam
      return NextResponse.json({ success: true });
    }

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (name.length > 100 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json(
        { error: 'Field length exceeded' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'TonalFocus Contact <noreply@tonalfocus.com>',
      to: process.env.CONTACT_EMAIL || 'info@tonalfocus.com',
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #00796B; color: white; padding: 20px; text-align: center; }
              .content { background-color: #f4f4f4; padding: 20px; margin-top: 20px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #00796B; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>New Contact Form Submission</h2>
              </div>
              <div class="content">
                <div class="field">
                  <span class="label">Name:</span> ${name}
                </div>
                <div class="field">
                  <span class="label">Email:</span> ${email}
                </div>
                <div class="field">
                  <span class="label">Subject:</span> ${subject}
                </div>
                <div class="field">
                  <span class="label">Message:</span><br>
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              <div class="footer">
                <p>This email was sent from the TonalFocus contact form.</p>
                <p>Time: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This email was sent from the TonalFocus contact form.
Time: ${new Date().toLocaleString()}
      `
    });

    // Send auto-reply to the user
    await resend.emails.send({
      from: 'TonalFocus <noreply@tonalfocus.com>',
      to: email,
      subject: 'Thank you for contacting TonalFocus',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #00796B; color: white; padding: 30px; text-align: center; }
              .content { padding: 30px; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You for Reaching Out!</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>Thank you for contacting TonalFocus Photography. I've received your message and will get back to you within 24-48 hours.</p>
                <p>In the meantime, feel free to browse my portfolio at <a href="https://tonalfocus.com">tonalfocus.com</a>.</p>
                <p>Looking forward to discussing your photography needs!</p>
                <p>Best regards,<br>
                TonalFocus Photography</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} TonalFocus Photography. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Hi ${name},

Thank you for contacting TonalFocus Photography. I've received your message and will get back to you within 24-48 hours.

In the meantime, feel free to browse my portfolio at tonalfocus.com.

Looking forward to discussing your photography needs!

Best regards,
TonalFocus Photography

---
© ${new Date().getFullYear()} TonalFocus Photography. All rights reserved.
      `
    });

    return NextResponse.json({ 
      success: true,
      message: 'Thank you for your message! We\'ll be in touch soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Check if it's a Resend error
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'Email service is not configured. Please try again later.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
