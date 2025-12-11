import heroImage from '../assets/hero.webp';
import faqImage from '../assets/faq_image.webp';
import faqImageLandscape from '../assets/faq_image_landscape.webp';
import Seo from '../components/Seo';
import { ProductCarousel } from '../components/ProductCarousel';
import Pricing from '../components/Pricing';
import { Faq } from '../components/Faq';
import { Letter } from '../components/Letter';
import { CtaCard } from '../components/CtaCard';
import { CreateEventLink } from '../components/CreateEventLink';
import { Hero } from '../components/Hero';
import { ArticleCarousel } from '../components/ArticleCarousel';

const HomePage = () => {
  return (
    <main>
      <Seo
        title="FutureReminder | Long-Term Reminders for Critical Events"
        description="Standard calendars fail for distant or important events. FutureReminder uses an escalating hierarchy of notifications to ensure you never miss a critical deadline or event again."
        canonicalPath="/"
        ogImage="/og-images/og-homepage.webp"
      />
      <Hero
        title={<>Reminders that don't take <span className='italic'>silence</span> for an answer.</>}
        subtitle={<>Calanders don't handle critical events in the distant future. We do. When a critical deadline hits, we don't just ping you—we trigger an <span className= "italic font-bold underline">escalating hierarchy of notifications</span> — from emails and texts to emergency contacts.</>}
        imageSrc={heroImage}
        imageAlt="A man sinking into a wormhole, sorrounded by examples of missed deadlines, to symbolize forgetting important events"
        ctaElement={<CreateEventLink size="lg" className="text-lg" />}
      />
      
      {/* --- Hierarchy Section --- */}
      <section className="bg-primary mb-16">
        <ProductCarousel />
      </section>

      {/* --- Main Content & Sticky Sidebar --- */}
      <div className="container mx-auto px-4 lg:grid lg:grid-cols-3 lg:gap-8">
        
        {/* Main Content Column (2/3 width) */}
        <div className="lg:col-span-2 bg-primary text-primary-foreground rounded-lg p-8 flex flex-col gap-8">
          <Letter />
          <section>
            <Pricing />
          </section>
          <section className="bg-white text-gray-900 rounded-lg">
            <div className="container mx-auto px-4">
              <Faq 
                title="The Fine Print"
                subtitle="(Plain English)"
                page="home"
                imageSrc={faqImage}
                imageSrcLandscape={faqImageLandscape}
                imageAlt="Abstract representation of questions"
              />
            </div>
          </section>
        </div>

        {/* Sticky Sidebar Column (1/3 width) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <CtaCard />
          </div>
        </aside>

      </div>
      <section className="mt-16">
        <ArticleCarousel />
      </section>
    </main>
  );
};

export default HomePage;