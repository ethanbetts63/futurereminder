import React from 'react';

interface HeroProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  imageSrc: string;
  srcSet?: string;
  imageAlt: string;
  ctaElement?: React.ReactNode;
}

export const Hero: React.FC<HeroProps> = ({ title, subtitle, imageSrc, srcSet, imageAlt, ctaElement }) => {
  return (
    <section className="container mx-auto px-4 pt-8 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <img 
            src={imageSrc} 
            srcSet={srcSet}
            sizes="(min-width: 1024px) 50vw, 100vw"
            alt={imageAlt} 
            className="rounded-lg object-cover w-full h-full shadow-2xl"
          />
        </div>
        <div className="text-left">
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-primary-foreground">
            {subtitle}
          </p>
          {ctaElement && (
            <div className="mt-2 flex justify-center">
              {ctaElement}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
