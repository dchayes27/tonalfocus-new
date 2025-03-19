import Hero from '@/components/Hero';
import Gallery from '@/components/Gallery';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function Home() {
  // Gallery images
  const galleryImages = [
    {
      src: '/images/gallery1.jpg',
      alt: 'City buildings with blue sky'
    },
    {
      src: '/images/gallery2.jpg',
      alt: 'Stone arch pathway'
    },
    {
      src: '/images/gallery3.jpg',
      alt: 'Mountain landscape'
    },
    {
      src: '/images/gallery4.jpg',
      alt: 'Urban street scene'
    }
  ];

  return (
    <>
      {/* Hero Section with optimized image */}
      <Hero
        imageSrc="/images/hero.jpg"
        imageAlt="Featured photography"
        heading="FRAME THE MOMENT"
        height="large"
      >
        <Button href="/portfolio" variant="primary">
          Explore Gallery
        </Button>
      </Hero>
      
      {/* Gallery Section - simple grid of optimized images */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl mb-8 text-center text-primary-charcoal">
          FEATURED WORK
        </h2>
        
        <Gallery 
          images={galleryImages} 
          columns={4}
          aspectRatio="square"
          withHoverEffect={true}
          className="mb-8"
        />
        
        <div className="mt-8 text-center">
          <Button href="/portfolio" variant="secondary">
            View Full Portfolio
          </Button>
        </div>
      </section>
      
      {/* About and Contact with 90s box styling */}
      <section className="py-16 bg-primary-beige">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* About section */}
            <Card variant="white" withGrain={true} title="ABOUT ME">
              <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
                <div className="w-32 h-32 overflow-hidden relative flex-shrink-0">
                  <Image
                    src="/images/profile.jpg"
                    alt="Photographer portrait"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <p className="leading-relaxed text-primary-charcoal">
                  I'm a photographer with a passion for capturing moments that blend 
                  nostalgic aesthetics with modern techniques. My work is inspired by 
                  the warm, distinctive character of early 90s imagery while maintaining 
                  contemporary clarity and precision.
                </p>
              </div>
              <div className="text-center">
                <Button href="/about" variant="primary">
                  More About Me
                </Button>
              </div>
            </Card>
            
            {/* Contact section */}
            <Card variant="teal" withGrain={true} title="GET IN TOUCH">
              <p className="mb-6 leading-relaxed">
                Interested in working together? Have questions about my process or 
                availability for a session? I'd love to hear from you.
              </p>
              
              <div className="mb-6">
                <p className="mb-2"><strong>Email:</strong> info@tonalfocus.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
              
              <div className="text-center">
                <Button href="/contact" variant="tertiary">
                  Contact Me
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}