import { Link } from 'react-router-dom';
import { ArticleCarousel } from '../components/ArticleCarousel';
import Seo from '../components/Seo';
import futureSelfImage from '../assets/solar_letters.webp';

const BlogExplorePage = () => {
  const prominentArticle = {
    title: 'How to Write a Letter to Your Future Self',
    imageSrc: futureSelfImage,
    link: '/articles/letter-to-future-self',
    alt: 'Conceptual image about sending messages to the future',
    description: 'A thoughtful guide on crafting a meaningful message to your future self, capturing your current hopes, dreams, and life lessons. Explore why this practice is more than just nostalgia.'
  };

  return (
    <>
      <Seo
        title="FutureReminder Blog"
        description="Explore articles, insights, and guides on long-term planning, personal growth, and making sure you never forget the important stuff."
        canonicalPath="/articles"
        ogType="website"
      />
      <div className="bg-primary text-primary-foreground">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">FutureReminder Blog</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Insights, guides, and inspiration for long-term planning. We explore ideas to help you connect with your future self and remember what matters most.
          </p>
        </div>

        {/* Prominent Article Section */}
        <div className="container mx-auto px-4 pb-16">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Featured Article</h2>
          <div className="max-w-4xl mx-auto bg-card p-6 rounded-2xl shadow-lg">
            <Link to={prominentArticle.link} className="group">
              <div className="md:flex md:space-x-6">
                <div className="md:w-1/2">
                  <img src={prominentArticle.imageSrc} alt={prominentArticle.alt} className="w-full h-auto rounded-xl shadow-md transform transition-transform group-hover:scale-105" />
                </div>
                <div className="md:w-1/2 mt-4 md:mt-0 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold group-hover:text-secondary transition-colors">{prominentArticle.title}</h3>
                  <p className="text-base text-card-foreground mt-2">{prominentArticle.description}</p>
                  <span className="text-white font-semibold mt-4 self-start group-hover:underline">
                    Read More &rarr;
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Article Carousel Section */}
        <ArticleCarousel showAll={true} />
      </div>
    </>
  );
};

export default BlogExplorePage;
