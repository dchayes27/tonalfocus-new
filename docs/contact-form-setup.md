# Contact Form Email Configuration

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Resend API Key (get from https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx

# Email to receive contact form submissions
CONTACT_EMAIL=your-email@example.com
```

## Setup Instructions

1. **Create a Resend Account**
   - Go to [https://resend.com](https://resend.com)
   - Sign up for a free account (10,000 emails/month)

2. **Get Your API Key**
   - Navigate to API Keys in your Resend dashboard
   - Create a new API key
   - Copy the key (starts with `re_`)

3. **Verify Your Domain** (for production)
   - Add your domain in Resend dashboard
   - Follow DNS verification steps
   - This allows sending from your domain (e.g., noreply@tonalfocus.com)

4. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Add your Resend API key
   - Set the contact email address

## Testing

1. **Local Testing**
   - The form will work with Resend's test API key
   - Emails won't actually send but will show as successful

2. **Production Testing**
   - Use a real API key
   - Verify domain for professional email addresses
   - Test form submission and check inbox

## Email Features

- ✅ HTML and plain text versions
- ✅ Auto-reply to users
- ✅ Rate limiting (5 emails/hour per IP)
- ✅ Honeypot spam protection
- ✅ Form validation
- ✅ Error handling

## Troubleshooting

- **"Email service is not configured"**: Check RESEND_API_KEY is set
- **Emails not sending**: Verify API key and domain verification
- **Rate limit errors**: Wait 1 hour or adjust limit in code
