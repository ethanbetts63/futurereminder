import React from 'react';
import { Hero } from '../Hero';
import { Faq } from '../Faq';
import { CtaCard } from '../CtaCard';
import faqImage from '../../assets/faq_image.webp';
import faqImageLandscape from '../../assets/faq_image_landscape.webp';

interface ArticleLayoutProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  faqPage: string;
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
          <section className="bg-white text-gray-900 rounded-lg">
            <div className="container mx-auto px-4">
              <Faq 
                title="The Fine Print"
                subtitle="(Plain English)"
                page={faqPage}
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
    </main>
  );
};
