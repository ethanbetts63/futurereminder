import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from "./ui/card";
import { getFaqs } from '@/api';
import type { FaqItem } from '@/types';


interface FaqProps {
  title: string;
  subtitle?: string;
  page: string;
  imageSrc: string;
  imageAlt: string;
  imageSrcLandscape?: string;
  srcSet?: string;
  sizes?: string;
}

const Spinner: React.FC = () => (
  <div className="flex justify-center items-center p-8">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export const Faq: React.FC<FaqProps> = ({ title, subtitle, page, imageSrc, imageAlt, imageSrcLandscape, srcSet, sizes }) => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // We get the user to re-trigger fetch on login/logout

  useEffect(() => {
    const fetchFaqs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getFaqs(page);
        setFaqs(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch FAQs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqs();
  }, [page, user]); // Dependency array updated to use 'user'

  const generateJsonLd = () => {
    if (!faqs.length) {
      return null;
    }

    const faqItems = faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }));

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-white text-gray-900 rounded-lg overflow-hidden border-0 shadow-none">
        <CardContent className="grid p-0 lg:grid-cols-2">
          <div className="p-6 lg:p-8 order-2 lg:order-1">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
            {subtitle && <p className="text-lg text-gray-600 mt-1 mb-2 italic">{subtitle}</p>}
            <Spinner />
          </div>
           <div className="relative flex items-center justify-center h-full order-1 lg:order-2">
            <img 
              src={imageSrc} 
              alt={imageAlt} 
              className="h-full w-full object-contain" 
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    // Optionally render an error state, or just return null to hide it
    return null; 
  }

  if (!faqs.length) {
    return null;
  }

  return (
    <>
      {generateJsonLd()}
      <Card className="bg-white text-gray-900 rounded-lg overflow-hidden border-0 shadow-none">
        <CardContent className="grid p-0 lg:grid-cols-2">
          <div className="p-6 lg:p-8 order-2 lg:order-1">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
            {subtitle && <p className="text-lg text-gray-600 mt-1 mb-2 italic">{subtitle}</p>}
            <Accordion
              type="single"
              collapsible
              className="w-full"
            >
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index + 1}`} key={index} className="faq-item border-b-0">
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="relative flex items-center justify-center h-full order-1 lg:order-2">
            {imageSrcLandscape ? (
              <picture>
                <source media="(min-width: 1024px)" srcSet={imageSrc} />
                <source media="(max-width: 1023px)" srcSet={imageSrcLandscape} />
                <img 
                  src={imageSrc} 
                  alt={imageAlt} 
                  className="h-full w-full object-contain" 
                />
              </picture>
            ) : (
              <img 
                src={imageSrc} 
                srcSet={srcSet}
                sizes={sizes}
                alt={imageAlt} 
                className="h-full w-full object-contain" 
              />
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};