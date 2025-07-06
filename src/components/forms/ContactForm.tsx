'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string; // Honeypot field
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '' // Honeypot field
  });

  const [status, setStatus] = useState<FormStatus>({ type: 'idle' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation errors
  const getFieldError = (field: keyof FormData): string | null => {
    if (!touched[field]) return null;

    switch (field) {
      case 'name':
        if (!formData.name.trim()) return 'Name is required';
        if (formData.name.length > 100) return 'Name is too long (max 100 characters)';
        break;
      case 'email':
        if (!formData.email.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'subject':
        if (!formData.subject.trim()) return 'Subject is required';
        if (formData.subject.length > 200) return 'Subject is too long (max 200 characters)';
        break;
      case 'message':
        if (!formData.message.trim()) return 'Message is required';
        if (formData.message.length > 5000) return 'Message is too long (max 5000 characters)';
        if (formData.message.length < 10) return 'Message is too short (min 10 characters)';
        break;
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      if (key !== 'website') acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    // Check for validation errors
    const hasErrors = ['name', 'email', 'subject', 'message'].some(field => 
      getFieldError(field as keyof FormData) !== null
    );

    if (hasErrors) {
      setStatus({ 
        type: 'error', 
        message: 'Please fix the errors in the form' 
      });
      return;
    }

    setStatus({ type: 'loading' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus({ 
        type: 'success', 
        message: data.message || 'Thank you for your message! We\'ll be in touch soon.' 
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        website: ''
      });
      setTouched({});

    } catch (error) {
      console.error('Contact form error:', error);
      setStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again.' 
      });
    }
  };

  const isFormValid = ['name', 'email', 'subject', 'message'].every(field => 
    !getFieldError(field as keyof FormData) && formData[field as keyof FormData].trim()
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Success/Error Messages */}
      {status.type !== 'idle' && status.type !== 'loading' && (
        <div className={`p-4 text-center ${
          status.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {status.message}
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-white mb-1">
          Name <span className="text-red-300">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 bg-white text-primary-charcoal ${
            getFieldError('name') ? 'border-2 border-red-500' : ''
          }`}
          placeholder="Your name"
          disabled={status.type === 'loading'}
          required
        />
        {getFieldError('name') && (
          <p className="text-red-300 text-sm mt-1">{getFieldError('name')}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-white mb-1">
          Email <span className="text-red-300">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 bg-white text-primary-charcoal ${
            getFieldError('email') ? 'border-2 border-red-500' : ''
          }`}
          placeholder="your@email.com"
          disabled={status.type === 'loading'}
          required
        />
        {getFieldError('email') && (
          <p className="text-red-300 text-sm mt-1">{getFieldError('email')}</p>
        )}
      </div>

      {/* Subject Field */}
      <div>
        <label htmlFor="subject" className="block text-white mb-1">
          Subject <span className="text-red-300">*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 bg-white text-primary-charcoal ${
            getFieldError('subject') ? 'border-2 border-red-500' : ''
          }`}
          placeholder="What's this about?"
          disabled={status.type === 'loading'}
          required
        />
        {getFieldError('subject') && (
          <p className="text-red-300 text-sm mt-1">{getFieldError('subject')}</p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-white mb-1">
          Message <span className="text-red-300">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 bg-white text-primary-charcoal ${
            getFieldError('message') ? 'border-2 border-red-500' : ''
          }`}
          placeholder="Tell me about your project..."
          disabled={status.type === 'loading'}
          required
        />
        <div className="flex justify-between mt-1">
          {getFieldError('message') && (
            <p className="text-red-300 text-sm">{getFieldError('message')}</p>
          )}
          <p className="text-white text-sm text-right">
            {formData.message.length} / 5000
          </p>
        </div>
      </div>

      {/* Honeypot Field (hidden) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Submit Button */}
      <div className="text-center pt-2">
        <Button 
          variant="tertiary" 
          type="submit"
          disabled={status.type === 'loading' || !isFormValid}
        >
          {status.type === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
        </Button>
      </div>
    </form>
  );
}
