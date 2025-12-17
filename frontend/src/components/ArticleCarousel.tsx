import { Link } from 'react-router-dom';
import futureSelfImage from '../assets/solar_letters.webp';
import vaccineImage from '../assets/vaccine_image.webp';
import iudImage from '../assets/iud_expiry.webp';
import anniversaryImage from '../assets/bday_calander.webp';
import visaImage from '../assets/visa.webp';
import subscriptionImage from '../assets/subscription.webp';
import postnotesImage from '../assets/postnotes.webp';

const articles = [
  {
    title: 'The Best Reminder Apps of 2025, Ranked',
    imageSrc: postnotesImage,
    link: '/articles/reminder-apps-ranked',
    alt: 'A corkboard covered in colorful sticky notes with reminder icons'
  },
  {
    title: 'How to Write a Letter to Your Future Self',
    imageSrc: futureSelfImage,
    link: '/articles/letter-to-future-self',
    alt: 'Conceptual image about sending messages to the future'
  },
  {
    title: 'IUD & Implant Expiration: A Guide',
    imageSrc: iudImage,
    link: '/articles/iud-expiration',
    alt: 'Conceptual image about IUDs and contraceptive implants'
  },
  {
    title: 'Vaccine Boosters: What You Need and When',
    imageSrc: vaccineImage,
    link: '/articles/vaccine-boosters',
    alt: 'Conceptual image about vaccines and reminders'
  },
  {
    title: 'Best Anniversary & Birthday Reminder App',
    imageSrc: anniversaryImage,
    link: '/articles/anniversary-reminders',
    alt: 'Conceptual image about remembering important dates'
  },
  {
    title: 'Visa Expiry Guide',
    imageSrc: visaImage,
    link: '/articles/visa-expiry',
    alt: 'Person looking at a passport with a calendar in the background'
  },
  {
    title: 'Subscription Renewal Traps',
    imageSrc: subscriptionImage,
    link: '/articles/subscription-renewal',
    alt: 'A person looking shocked at a credit card statement'
  },
  {
    title: 'Caring for Roses: A Seasonal Guide',
    imageSrc: postnotesImage,
    link: '/articles/caring-for-roses-seasonal-guide',
    alt: 'A guide to caring for roses throughout the seasons'
  },
  {
    title: 'Caring for Hydrangeas: A Seasonal Guide',
    imageSrc: postnotesImage,
    link: '/articles/caring-for-hydrangeas-seasonal-guide',
    alt: 'A guide to caring for hydrangeas throughout the seasons'
  },
  {
    title: 'Caring for Lavender: A Seasonal Guide',
    imageSrc: postnotesImage,
    link: '/articles/caring-for-lavender-seasonal-guide',
    alt: 'A guide to caring for lavender throughout the seasons'
  },
  {
    title: 'Caring for Crepe Myrtle: A Seasonal Guide',
    imageSrc: postnotesImage,
    link: '/articles/caring-for-crepe-myrtle-seasonal-guide',
    alt: 'A guide to caring for crepe myrtle throughout the seasons'
  },
  {
    title: 'Caring for Azaleas: A Seasonal Guide',
    imageSrc: postnotesImage,
    link: '/articles/caring-for-azaleas-seasonal-guide',
    alt: 'A guide to caring for azaleas throughout the seasons'
  },
  {
    title: 'Caring for Cherry Trees: A Seasonal Guide',
    imageSrc: postnotesImage,
    link: '/articles/caring-for-cherry-trees-seasonal-guide',
    alt: 'A guide to caring for cherry trees throughout the seasons'
  },
  {
    title: 'Caring for Apple Trees: A Seasonal Guide',
    imageSrc: postnotesImage,
    link: '/articles/caring-for-apple-trees-seasonal-guide',
    alt: 'A guide to caring for apple trees throughout the seasons'
  },
  {
    title: 'Caring for Peonies: A Seasonal Guide',
    imageSrc: postnotesImage,
    link: '/articles/caring-for-peonies-seasonal-guide',
    alt: 'A guide to caring for peonies throughout the seasons'
  },
  {
    title: 'Caring for Blueberry Bushes: A Seasonal Guide',
    imageSrc: postnotesImage,
    link: '/articles/caring-for-blueberry-bushes-seasonal-guide',
    alt: 'A guide to caring for blueberry bushes throughout the seasons'
  }
];

interface ArticleCarouselProps {
  exclude?: string;
}

export const ArticleCarousel: React.FC<ArticleCarouselProps> = ({ exclude }) => {
  const filteredArticles = articles.filter(article => article.link !== exclude);

  if (filteredArticles.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-12 bg-primary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-center text-primary-foreground mb-2">From the FutureReminder Blog</h2>
        <p className="text-lg text-primary-foreground text-center mb-8">
          Insights and guides for long-term planning.
        </p>
        <div className="flex overflow-x-auto space-x-6 pb-4">
          {filteredArticles.map((article) => (
            <Link to={article.link} key={article.link} className="flex-shrink-0 w-80 h-48 group">
              <div 
                className="relative w-full h-full bg-cover bg-center rounded-xl shadow-md overflow-hidden transform transition-transform hover:-translate-y-1"
                style={{ backgroundImage: `url(${article.imageSrc})` }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                <div className="relative z-10 flex items-center justify-center h-full p-6">
                  <h3 className="text-2xl font-semibold text-center text-white">{article.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
