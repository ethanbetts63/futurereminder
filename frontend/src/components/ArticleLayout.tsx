import React from 'react';
import { Hero } from './Hero';
import { Faq } from './Faq';
import { CtaCard } from './CtaCard';
import faqImage from '../assets/faq_image.webp';
import faqImageLandscape from '../assets/faq_image_landscape.webp';
import faqImage320 from '../assets/faq_image-320w.webp';
import faqImage640 from '../assets/faq_image-640w.webp';
import faqImage768 from '../assets/faq_image-768w.webp';
import faqImage1024 from '../assets/faq_image-1024w.webp';
import faqImage1280 from '../assets/faq_image-1280w.webp';
import faqImageLandscape320 from '../assets/faq_image_landscape-320w.webp';
import faqImageLandscape640 from '../assets/faq_image_landscape-640w.webp';
import faqImageLandscape768 from '../assets/faq_image_landscape-768w.webp';
import faqImageLandscape1024 from '../assets/faq_image_landscape-1024w.webp';
import faqImageLandscape1280 from '../assets/faq_image_landscape-1280w.webp';

interface ArticleLayoutProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  faqPage?: string;
  ctaElement?: React.ReactNode;
  children: React.ReactNode;
}

export const ArticleLayout: React.FC<ArticleLayoutProps> = ({ title, subtitle, imageSrc, imageAlt, ctaElement, children, faqPage }) => {
  return (
    <main>
      <Hero
        title={title}
        subtitle={subtitle}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        ctaElement={ctaElement}
      />
      
      <div className="container mx-auto px-4 lg:grid lg:grid-cols-3 lg:gap-8 mt-12">
        
        {/* Main Content Column (2/3 width) */}
        <div className="lg:col-span-2 bg-primary text-primary-foreground rounded-lg p-8 flex flex-col gap-8">
          <div>
            {children}
          </div>
          {faqPage && (
            <section className="bg-white text-gray-900 rounded-lg">
              <div className="container mx-auto px-4">
          <Faq 
            title="Have Questions?"
            page="home"
            imageSrc={faqImage}
            imageSrcLandscape={faqImageLandscape}
            srcSet={`${faqImage320} 320w, ${faqImage640} 640w, ${faqImage768} 768w, ${faqImage1024} 1024w, ${faqImage1280} 1280w`}
            srcSetLandscape={`${faqImageLandscape320} 320w, ${faqImageLandscape640} 640w, ${faqImageLandscape768} 768w, ${faqImageLandscape1024} 1024w, ${faqImageLandscape1280} 1280w`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            imageAlt="Abstract representation of questions"
          />
              </div>
            </section>
          )}
        </div>

        {/* Sticky Sidebar Column (1/3 width) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <CtaCard />
          </div>
        </aside>

      </div>
    </main>
  );
};
