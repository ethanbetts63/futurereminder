import heroImage from '../assets/hero.webp';
import hero320 from '../assets/hero-320w.webp';
import hero640 from '../assets/hero-640w.webp';
import hero768 from '../assets/hero-768w.webp';
import hero1024 from '../assets/hero-1024w.webp';
import hero1280 from '../assets/hero-1280w.webp';

import Seo from '../components/Seo';
import { ProductCarousel } from '../components/ProductCarousel';
import { FaqV2 } from '../components/FaqV2';
import { Letter } from '../components/Letter';
import { CtaCard } from '../components/CtaCard';
import { CreateEventLink } from '../components/CreateEventLink';
import { Hero } from '../components/Hero';
import { ArticleCarousel } from '../components/ArticleCarousel';
import TrustFeature from '../components/TrustFeature';

const HomePage = () => {
  return (
    <main>
      <Seo
        title="FutureReminder | Persistent reminders for important or distant events."
        description="Standard calendars fail for distant or important events. FutureReminder uses an escalating hierarchy of notifications to ensure you never miss a critical deadline or event again."
        canonicalPath="/"
        ogImage="/og-images/og-homepage.webp"
      />
      <Hero
        title={<>Reminders that don't take <span className='italic'>silence</span> for an answer.</>}
        subtitle={<>Calendars are for time management. FutureReminder is for risk management.  When a critical deadline hits, we don't just ping you—we trigger an <span className= "italic font-bold underline">escalating hierarchy of notifications</span> — from emails to emergency contacts. </>}
        imageSrc={heroImage}
        srcSet={`${hero320} 320w, ${hero640} 640w, ${hero768} 768w, ${hero1024} 1024w, ${hero1280} 1280w`}
        imageAlt="A man sinking into a wormhole, sorrounded by examples of missed deadlines, to symbolize forgetting important events"
        ctaElement={<CreateEventLink size="lg" className="text-lg" />}
      />
      
      {/* --- Hierarchy Section --- */}
      <section className="bg-primary mb-10">
        <ProductCarousel />
      </section>

      {/* --- Main Content & Sticky Sidebar --- */}
      <div className="container mx-auto px-0 sm:px-4 lg:grid lg:grid-cols-3 lg:gap-8">
        
        {/* Main Content Column (2/3 width) */}
        <div className="lg:col-span-2 bg-background text-primary-foreground rounded-lg px-0 sm:p-8 md:p-8 lg:p-8 flex flex-col gap-0 sm:gap-8">
          <Letter />
          <section>
            <TrustFeature />
          </section>
          <section className="lg:hidden">
            <CtaCard />
          </section>
        </div>

        {/* Sticky Sidebar Column (1/3 width) */}
        <aside className="hidden lg:block">
          <div className="sticky mb-7 mt-6 top-24">
            <CtaCard />
          </div>
        </aside>

      </div>
      <section className="mb-16">
        <FaqV2
          title="Questions? We have answers."
        />
      </section>
      <div className="mt-16" id="blog">
        <ArticleCarousel />
      </div>
    </main>
  );
};

export default HomePage;