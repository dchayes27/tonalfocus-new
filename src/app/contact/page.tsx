'use client';

import Card from '@/components/ui/Card';
import ContactForm from '@/components/forms/ContactForm';

export default function Contact() {
  // Common questions
  const faqs = [
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
    },
    {
      question: 'Do you travel for sessions?',
      answer: 'Yes! I\'m available for travel within the Bay Area at no additional charge. For destinations outside the area, travel fees may apply. Contact me for a custom quote.'
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Life happens! Sessions can be rescheduled with at least 48 hours notice. Deposits are non-refundable but can be applied to a rescheduled session within 6 months.'
    }
  ];
  
  return (
    <>
      {/* Page header */}
      <div className="bg-primary-beige py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-charcoal text-center">
            GET IN TOUCH
          </h1>
          <p className="text-center text-primary-charcoal mt-4 max-w-2xl mx-auto">
            Ready to capture your moments? I'd love to hear about your project and discuss how we can work together.
          </p>
        </div>
      </div>
      
      {/* Contact section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact info */}
            <Card variant="white" withGrain={true} title="CONTACT INFORMATION">
              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="font-medium text-primary-charcoal">Email</h3>
                  <p className="text-primary-charcoal">
                    <a href="mailto:info@tonalfocus.com" className="hover:text-primary-teal transition-colors">
                      info@tonalfocus.com
                    </a>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-primary-charcoal">Phone</h3>
                  <p className="text-primary-charcoal">
                    <a href="tel:+15551234567" className="hover:text-primary-teal transition-colors">
                      +1 (555) 123-4567
                    </a>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-primary-charcoal">Studio Location</h3>
                  <p className="text-primary-charcoal">
                    123 Photography Lane<br />
                    San Francisco, CA 94110
                  </p>
                </div>
              </div>
              
              <h3 className="font-medium text-primary-charcoal mb-2">Office Hours</h3>
              <p className="text-primary-charcoal mb-1">Monday - Friday: 9am - 6pm</p>
              <p className="text-primary-charcoal mb-4">Saturday: 10am - 4pm (by appointment)</p>
              
              <h3 className="font-medium text-primary-charcoal mb-2">Response Time</h3>
              <p className="text-primary-charcoal">
                I typically respond to all inquiries within 24-48 hours. For urgent matters, 
                please call during office hours.
              </p>
            </Card>
            
            {/* Contact form */}
            <Card variant="teal" withGrain={true} title="SEND A MESSAGE">
              <ContactForm />
            </Card>
          </div>
        </div>
      </section>
      
      {/* FAQ section */}
      <section className="bg-primary-beige py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-medium mb-10 text-center text-primary-charcoal">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 bg-white">
                <h3 className="text-lg font-medium mb-2 text-primary-teal">{faq.question}</h3>
                <p className="text-primary-charcoal">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-medium mb-4 text-primary-charcoal">
            Prefer Social Media?
          </h2>
          <p className="text-primary-charcoal mb-6">
            You can also reach out to me on Instagram where I share my latest work and behind-the-scenes content.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="https://instagram.com/tonalfocus" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-teal text-white hover:bg-primary-teal/90 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
              </svg>
              FOLLOW ON INSTAGRAM
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
