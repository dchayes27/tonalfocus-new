/**
 * src/app/contact/page.tsx
 * ------------------------
 * This file defines the Contact page for TonalFocus Photography.
 * It includes a contact form, contact information, and a list of frequently asked questions (FAQs).
 * This component is marked as a Client Component ('use client') because it uses React's useState hook
 * for managing form input state.
 *
 * Metadata for this page (title, description) is typically handled in a separate metadata.ts file
 * or a parent layout/page that is a Server Component.
 */
'use client'; // Directive to mark this as a Client Component.

import { useState, ChangeEvent, FormEvent } from 'react'; // React hooks for state and event handling.
import Card from '@/components/ui/Card'; // Reusable UI component for content cards.
import Button from '@/components/ui/Button'; // Reusable UI button component.

// Interface for the structure of form data.
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Interface for the structure of FAQ items.
interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Contact Page Component.
 * Renders the content for the "/contact" route, including a contact form and FAQs.
 * @returns {JSX.Element} The JSX for the Contact page.
 */
export default function Contact() {
  // State for managing the contact form data.
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  /**
   * Handles changes to form input fields.
   * Updates the corresponding field in the formData state.
   * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The input change event.
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  /**
   * Handles the submission of the contact form.
   * Currently, it prevents default submission, logs data to console, shows an alert,
   * and resets the form.
   * In a real application, this function would send the data to a backend API endpoint.
   * @param {FormEvent} e - The form submission event.
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior.
    console.log('Form submitted:', formData); // Log form data (for debugging).

    // TODO: Replace alert with actual API call to submit form data.
    // Example: fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });
    alert('Thank you for your message! I\'ll be in touch soon.');

    // Reset form fields after submission.
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  
  // Array of frequently asked questions and their answers.
  const faqs: FAQItem[] = [
    {
      question: 'How far in advance should I book a session?',
      answer: 'For portrait sessions, 2-3 weeks in advance is recommended. For events and weddings, 2-6 months is ideal to ensure availability, especially during peak seasons.'
    },
    {
      question: 'What should I wear to a portrait session?',
      answer: 'I recommend wearing clothes that make you feel comfortable and confident. Solid colors tend to photograph better than busy patterns. We\'ll discuss specific recommendations during your consultation based on the location and style of your session.'
    },
    {
      question: 'How long until I receive my photos?',
      answer: 'Typically, you\'ll receive your edited gallery within 2 weeks for portrait sessions and 3-4 weeks for events. Rush delivery is available for an additional fee if you need your images sooner.'
    }
  ];
  
  return (
    <>
      {/* Page Header Section */}
      {/* Displays the main title of the Contact page. */}
      <div className="bg-primary-beige py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-charcoal text-center">
            GET IN TOUCH
          </h1>
        </div>
      </div>
      
      {/* Main Contact Section */}
      {/* Contains contact information and the contact form, laid out in a grid. */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Contact Information Card */}
            <Card variant="white" withGrain={true} title="CONTACT INFORMATION">
              <div className="space-y-4 mb-8">
                {/* Email Address */}
                <div>
                  <h3 className="font-medium text-primary-charcoal">Email</h3>
                  <p className="text-primary-charcoal">info@tonalfocus.com</p>
                </div>
                {/* Phone Number */}
                <div>
                  <h3 className="font-medium text-primary-charcoal">Phone</h3>
                  <p className="text-primary-charcoal">+1 (555) 123-4567</p>
                </div>
                {/* Studio Location / Address */}
                <div>
                  <h3 className="font-medium text-primary-charcoal">Studio Location</h3>
                  <p className="text-primary-charcoal">
                    123 Photography Lane<br />
                    San Francisco, CA 94110
                  </p>
                </div>
              </div>
              {/* Office Hours */}
              <h3 className="font-medium text-primary-charcoal mb-2">Office Hours</h3>
              <p className="text-primary-charcoal mb-1">Monday - Friday: 9am - 6pm</p>
              <p className="text-primary-charcoal">Saturday: 10am - 4pm (by appointment)</p>
            </Card>
            
            {/* Contact Form Card */}
            <Card variant="teal" withGrain={true} title="SEND A MESSAGE">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input Field */}
                <div>
                  <label htmlFor="name" className="block text-white mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name" // Must match key in FormData state.
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white text-primary-charcoal"
                    placeholder="Your name"
                    required
                  />
                </div>
                {/* Email Input Field */}
                <div>
                  <label htmlFor="email" className="block text-white mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email" // Must match key in FormData state.
                    value={formData.email} // Corrected from formData.name
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white text-primary-charcoal"
                    placeholder="Your email"
                    required
                  />
                </div>
                {/* Subject Input Field */}
                <div>
                  <label htmlFor="subject" className="block text-white mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject" // Must match key in FormData state.
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white text-primary-charcoal"
                    placeholder="Subject"
                    required
                  />
                </div>
                {/* Message Textarea Field */}
                <div>
                  <label htmlFor="message" className="block text-white mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message" // Must match key in FormData state.
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white text-primary-charcoal"
                    placeholder="Your message"
                    required
                  ></textarea>
                </div>
                {/* Submit Button */}
                <div className="text-center pt-2">
                  <Button variant="tertiary" type="submit">
                    SEND MESSAGE
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      {/* Displays a list of frequently asked questions and their answers. */}
      <section className="bg-primary-beige py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-medium mb-10 text-center text-primary-charcoal">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          {/* Container for FAQ items. */}
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              // Each FAQ item.
              <div key={index} className="p-6 bg-white shadow-md rounded-md">
                <h3 className="text-lg font-medium mb-2 text-primary-teal">{faq.question}</h3>
                <p className="text-primary-charcoal leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}