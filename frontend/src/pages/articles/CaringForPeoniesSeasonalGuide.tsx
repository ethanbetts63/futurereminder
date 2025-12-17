import { ArticleLayout } from '../../components/ArticleLayout';
import articleImage from '../../assets/peonies.webp';
import { ArticleCarousel } from '../../components/ArticleCarousel';
import Seo from '../../components/Seo';

const CaringForPeoniesSeasonalGuide = () => {
  return (
    <>
      <Seo
        title="When & How to Care for Peonies (Seasonal Guide)"
        description="Peony care is mostly about patience and seasonal cleanup. Understanding when to cut back foliage and divide roots protects next year's flowers."
        canonicalPath="/articles/caring-for-peonies-seasonal-guide"
        ogType="article"
        ogImage="/og-images/og-caring-for-peonies.webp" // <-- TODO: Add this OG image
      />
      <ArticleLayout
        title="When & How to Care for Peonies (A Seasonal Guide)"
        subtitle={<>Peony care is mostly about patience and seasonal cleanup rather than pruning. Peonies rarely need shaping, but dead foliage, improper cutting timing, and poor support can stress plants and reduce blooms. <strong>Understanding when to cut back foliage and divide roots protects next year's flowers.</strong></>}
        imageSrc={articleImage}
        imageAlt="A large pink peony flower in full bloom"
      >
        <div className="text-lg text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-2">When should you prune peonies?</h2>
          <p className="mb-6">Peonies are not pruned for shape. Instead, cut back the stems once the foliage naturally dies back in autumn. For herbaceous and intersectional (Itoh) peonies, cut stems to ground level after frost kills the foliage. Tree peonies should only be lightly pruned in late winter/early spring to remove winter damage.</p>
          
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">When should you trim peonies?</h2>
          <p className="mb-6">After blooming in late spring to early summer, trim spent flowers to prevent seed development and encourage the plant to focus energy into roots and next year’s buds. Avoid cutting foliage early; leaves are essential for energy storage through summer.</p>
          
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">When should you fertilize peonies?</h2>
          <p className="mb-6">Peonies benefit from fertilizing in early spring when new shoots emerge. Use a low‑nitrogen, balanced fertilizer or compost. Avoid fertilizing after early summer — late feeding encourages tender growth that weakens plants and bud formation.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune peonies in spring?</h2>
          <p className="mb-6">Spring pruning is limited. For herbaceous and Itoh peonies, only remove winter‑damaged tips if present. Tree peonies can be lightly pruned in early spring to remove dead wood before growth begins.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune peonies in summer?</h2>
          <p className="mb-6">Do not cut back foliage in summer. Peony leaves must remain intact to photosynthesize and strengthen roots for next year's blooms. The only safe summer trimming is deadheading spent flowers.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune peonies in autumn (fall)?</h2>
          <p className="mb-6">Yes — autumn is the primary cutback season. Once frost kills the foliage, cut stems to the soil surface (for herbaceous/Itoh types). Removing dead foliage prevents overwintering disease such as botrytis.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune peonies in winter?</h2>
          <p className="mb-6">If autumn cleanup wasn’t completed, you can cut back remaining dead stems during winter dormancy on mild days. Avoid disturbing frozen ground.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Caring for peonies? The most common mistake</h2>
          <p className="mb-6">One of the most common mistakes with peony care is timing — people plan to prune, feed or protect their peonies, then life gets in the way and the window closes. You probably saw this coming. FutureReminder exists to solve that problem: our free tier is perfect for these sorts of gardening reminder needs. Why not just use your calender app? You definitely could. But a single notification is easy to miss. And what if you change phones? Our free tier is perfect for this. We use a notification hierarchy. We’ll start with emails, then we’ll send you texts. And we’ll keep trying to reach out until you acknowledge us. So that’s the pitch, nothing too complicated. We’d love for you to give it a try. And so would your peonies’s. If you're interested checkout our homepage <a href="/" className="font-bold text-white italic hover:underline">here</a>.</p>
        </div>
      </ArticleLayout>
      <section className="mt-16">
        <ArticleCarousel exclude="/articles/caring-for-peonies-seasonal-guide" />
      </section>
    </>
  );
};

export default CaringForPeoniesSeasonalGuide;
