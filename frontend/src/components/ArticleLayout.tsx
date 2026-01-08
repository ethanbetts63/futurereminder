import React from 'react';
import { Hero } from './Hero';
import { Faq } from './Faq';
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
  children: React.ReactNode;
}

export const ArticleLayout: React.FC<ArticleLayoutProps> = ({ title, subtitle, imageSrc, imageAlt, children, faqPage }) => {
  return (
    <main>
      <Hero
        title={title}
        subtitle={subtitle}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
      />
      
      <div className="container mx-auto px-4 mt-6">
        
        {/* Main Content Column (Full width) */}
        <div className="bg-background text-primary-foreground rounded-lg px-4 md:p-0 lg:px-16 flex flex-col gap-8 max-w-4xl mx-auto">
          <div>
            {children}
          </div>
          {faqPage && (
            <section className="bg-white text-gray-900 rounded-lg">
              <div className="container mx-auto px-4">
          <Faq 
            title="Have Questions?"
            page={faqPage}
            imageSrc={faqImage}
            imageSrcLandscape={faqImageLandscape}
            srcSet={`${faqImage320} 320w, ${faqImage640} 640w, ${faqImage768} 768w, ${faqImage1024} 1024w, ${faqImage1280} 1280w`}
            srcSetLandscape={`${faqImageLandscape320} 320w, ${faqImageLandscape640} 640w, ${faqImageLandscape768} 768w, ${faqImageLandscape1024} 1024w, ${faqImageLandscape1280} 1280w`}
            imageAlt="Abstract image representing frequently asked questions"
          />
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};
