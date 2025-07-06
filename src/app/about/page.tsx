/**
 * src/app/about/page.tsx
 * ----------------------
 * This file defines the "About Me" page for TonalFocus Photography.
 * It includes information about the photographer, services offered, and the photography process.
 * It also exports metadata for SEO purposes.
 */
import Image from 'next/image'; // Next.js component for optimized image rendering.
import Card from '@/components/ui/Card'; // Reusable UI component for content cards.

// Metadata for the About page, used for SEO and browser tab information.
export const metadata = {
  title: 'About | TonalFocus Photography',
  description: 'Learn more about the photographer behind TonalFocus and their creative approach to capturing nostalgic and modern aesthetics.',
};

/**
 * About Page Component.
 * Renders the content for the "/about" route.
 * @returns {JSX.Element} The JSX for the About page.
 */
export default function About() {
  // Array of objects defining the services offered.
  // Each object contains a title and a description for the service.
  const services = [
    {
      title: 'Portrait Sessions',
      description: 'Individual and group portraits with a focus on natural lighting and authentic expressions. Each session is tailored to capture your unique personality and style.'
    },
    {
      title: 'Event Photography',
      description: 'Comprehensive coverage of special events from intimate gatherings to larger celebrations. I focus on capturing genuine moments and the unique atmosphere of your event.'
    },
    {
      title: 'Commercial Work',
      description: 'Product photography, brand imagery, and corporate portraits with a distinctive aesthetic that helps your business stand out while maintaining a cohesive visual identity.'
    }
  ];

  // Array of objects defining the steps in the photography process.
  // Each object includes the step number, title, and a description of the step.
  const processSteps = [
    {
      step: 1,
      title: 'Consultation',
      description: 'We\'ll start with a detailed discussion about your vision, preferences, and what you want to achieve with the photography. This helps me tailor my approach specifically to your needs.'
    },
    {
      step: 2,
      title: 'Photography Session',
      description: 'During the shoot, I focus on creating a comfortable environment that allows for natural, authentic moments. I use a mix of directed poses and candid captures to ensure a diverse final collection.'
    },
    {
      step: 3,
      title: 'Editing & Refinement',
      description: 'After the session, I carefully select and edit the best images using my signature style that blends nostalgic tones with modern clarity. Each image receives individual attention to bring out its best qualities.'
    },
    {
      step: 4,
      title: 'Delivery',
      description: 'You\'ll receive your final images in a private online gallery where you can view, download, and share them. For print orders, I work with professional labs to ensure exceptional quality that does justice to your images.'
    }
  ];

  return (
    <>
      {/* Page Header Section */}
      {/* Displays the main title of the About page. */}
      <div className="bg-primary-beige py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-charcoal text-center">
            ABOUT ME
          </h1>
        </div>
      </div>
      
      {/* Bio Section */}
      {/* Contains the photographer's profile image and biographical text. */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-10 max-w-4xl mx-auto items-center md:items-start">
          {/* Profile Image Container */}
          <div className="md:w-1/3 aspect-square relative overflow-hidden w-full max-w-xs md:max-w-none">
            <Image
              src="/images/profile.jpg" // Path to the profile image.
              alt="Photographer portrait" // Alt text for accessibility.
              fill // Makes the image fill its container.
              sizes="(max-width: 768px) 100vw, 33vw" // Responsive image sizing.
              className="object-cover" // Ensures the image covers the area without distortion.
            />
            
            {/* Film Grain Overlay Effect */}
            {/* Adds a subtle visual texture to the profile image. */}
            <div 
              className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }}
            />
          </div>
          
          {/* Bio Content Text */}
          <div className="md:w-2/3">
            <h2 className="text-2xl font-medium mb-4 text-primary-teal">My Story</h2>
            <p className="mb-4 leading-relaxed text-primary-charcoal">
              I'm a photographer with a passion for capturing moments that blend 
              nostalgic aesthetics with modern techniques. My work is inspired by 
              the warm, distinctive character of early 90s imagery while maintaining 
              contemporary clarity and precision.
            </p>
            <p className="mb-4 leading-relaxed text-primary-charcoal">
              Photography has been my medium of choice for over 15 years, having started 
              with film photography before transitioning to digital. This foundation in 
              traditional photography influences my approach to composition, color grading, 
              and the overall mood of my work.
            </p>
            <p className="leading-relaxed text-primary-charcoal">
              When I'm not behind the camera, I enjoy hiking, exploring new cities, 
              and studying the history of photography and visual arts. These experiences 
              continually inform and refresh my creative perspective.
            </p>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      {/* Displays the list of photography services offered using Card components. */}
      <section className="bg-primary-beige py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-medium mb-10 text-center text-primary-charcoal">SERVICES</h2>
          
          {/* Grid layout for service cards. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              // Each service is rendered in a Card component.
              <Card key={index} variant="white" withGrain={true}>
                <h3 className="text-xl font-medium mb-3 text-primary-teal">{service.title}</h3>
                <p className="text-primary-charcoal leading-relaxed">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      {/* Outlines the typical steps involved in a photography project. */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-medium mb-10 text-center text-primary-charcoal">MY PROCESS</h2>
        
        {/* List of process steps. */}
        <div className="max-w-3xl mx-auto space-y-8">
          {processSteps.map((step, index) => (
            // Each step is displayed with a number, title, and description.
            <div key={index} className="flex items-start gap-4">
              {/* Step Number Indicator */}
              <div className="w-12 h-12 bg-primary-teal text-white flex items-center justify-center font-bold text-xl flex-shrink-0 rounded">
                {step.step}
              </div>
              {/* Step Title and Description */}
              <div>
                <h3 className="text-xl font-medium mb-2 text-primary-teal">{step.title}</h3>
                <p className="text-primary-charcoal leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}