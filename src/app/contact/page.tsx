'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Contact() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission - you would normally connect this to a backend API
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // In a real application, you would send this data to a server
    alert('Thank you for your message! I\'ll be in touch soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  
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
                  <p className="text-primary-charcoal">info@tonalfocus.com</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-primary-charcoal">Phone</h3>
                  <p className="text-primary-charcoal">+1 (555) 123-4567</p>
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
              <p className="text-primary-charcoal">Saturday: 10am - 4pm (by appointment)</p>
            </Card>
            
            {/* Contact form */}
            <Card variant="teal" withGrain={true} title="SEND A MESSAGE">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-white mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white text-primary-charcoal"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-white mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white text-primary-charcoal"
                    placeholder="Your email"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-white mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white text-primary-charcoal"
                    placeholder="Subject"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-white mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white text-primary-charcoal"
                    placeholder="Your message"
                    required
                  ></textarea>
                </div>
                
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
    </>
  );
}