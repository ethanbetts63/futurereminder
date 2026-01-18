import React from 'react';
import heroImage from '../assets/hero.webp';
import { Hero } from '../components/Hero';
import ContactDetails from '../components/ContactDetails';
import OtherSites from '../components/OtherSites';
import Seo from '@/components/Seo';
import allbikesLogo from '@/assets/allbikes_logo.png'; 
import splitcartLogo from '@/assets/splitcart_logo.png';
import foreverFlowerLogo from '@/assets/foreverflower_logo.png';

const otherSitesData = [
    {
        name: "Allbikes",
        logoSrc: allbikesLogo, 
        description: "Your one-stop shop for motorcycle and scooter servicing and parts.",
        url: "https://www.allbikes.com.au", 
    },
    {
        name: "Splitcart",
        logoSrc: splitcartLogo, 
        description: "Compare grocery prices across major Australian supermarkets.",
        url: "https://www.splitcart.com.au", 
    },
    {
        name: "Forever Flower",
        logoSrc: foreverFlowerLogo, 
        description: "The only annual flower subscription app in existence. Pre arrange flowers to be sent to someone for anniversaries, birthdays, or just because on the same date every year.",
        url: "https://www.foreverflower.app", 
    },
];

const ContactPage: React.FC = () => {
    const description = "Have questions, suggestions, or feedback? Get in touch with us. I'd love to hear from you. This is a very new site and I know that there is room for improvement! ethanbetts63@gmail.com";
    const email = "ethanbetts63@gmail.com";

    const contactPageSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Us",
        "description": description,
        "url": "https://www.futurereminder.app/contact",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.futurereminder.app/contact"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "email": email,
            "contactType": "Customer Support",
            "availableLanguage": "English"
        }
    };

    return (
        <div>
            <Seo
                title="Contact Us | FutureReminder"
                description={description}
                canonicalPath="/contact"
                structuredData={contactPageSchema}
            />
            <Hero
                title="Contact Us"
                subtitle={description}
                imageSrc={heroImage}
                imageAlt="A pin up board of postnotes with various reminder icons"
            />
            
            <ContactDetails />

            <OtherSites sites={otherSitesData} />
        </div>
    );
};

export default ContactPage;
