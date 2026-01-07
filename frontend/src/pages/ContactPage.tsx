import React from 'react';
import { Hero } from '../components/Hero';
import ContactDetails from '../components/ContactDetails';
import OtherSites from '../components/OtherSites';
import Seo from '@/components/Seo';

// TODO: Replace with actual logo paths
import allbikesLogo from '@/assets/allbikes_logo.png'; 
import splitcartLogo from '@/assets/splitcart_logo.png';

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
];

const ContactPage: React.FC = () => {
    const description = "Have questions, suggestions, or feedback? Get in touch with us. We'd love to hear from you.";
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
                description={description}
            />
            
            <ContactDetails />

            <OtherSites sites={otherSitesData} />
        </div>
    );
};

export default ContactPage;
