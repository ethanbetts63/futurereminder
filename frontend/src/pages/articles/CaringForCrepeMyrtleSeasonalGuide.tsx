import { ArticleLayout } from '../../components/ArticleLayout';
import articleImage from '../../assets/postnotes.webp'; // Using generic image as requested
import { ArticleCarousel } from '../../components/ArticleCarousel';
import Seo from '../../components/Seo';

const CaringForCrepeMyrtleSeasonalGuide = () => {
  return (
    <>
      <Seo
        title="When & How to Care for Crepe Myrtle (Seasonal Guide)"
        description="Crepe myrtle care is simple once timing is understood. These shrubs and trees bloom on new growth, so pruning at the right moment encourages abundant flowers and strong structure."
        canonicalPath="/articles/caring-for-crepe-myrtle-seasonal-guide"
        ogType="article"
        ogImage="/og-images/og-caring-for-crepe-myrtle.webp" // <-- TODO: Add this OG image
      />
      <ArticleLayout
        title="When & How to Care for Crepe Myrtle (A Seasonal Guide)"
        subtitle={<>Crepe myrtle care is simple once timing is understood. These shrubs and trees bloom on new growth, so pruning at the right moment encourages abundant flowers and strong structure. Over-pruning — especially “topping” — <strong>weakens the plant, reduces bloom quality, and leads to unattractive knobby growth.</strong></>}
        imageSrc={articleImage}
        imageAlt="A crepe myrtle tree in full bloom with vibrant flowers"
      >
        <div className="text-lg text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-2">When should you prune crepe myrtle?</h2>
          <p className="mb-6">Crepe myrtles bloom on new wood, so prune in late winter to very early spring before new growth begins. Pruning earlier risks cold damage to exposed cuts, and pruning later can delay flowering. Remove crossing branches, suckers at the base, and keep the natural branching form — avoid topping or severe heading cuts.</p>
          
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">When should you trim crepe myrtle?</h2>
          <p className="mb-6">Trimming should focus on removing spent flowers and light shaping during the growing season. Deadheading can encourage a second flush of blooms in some climates. Avoid mid- to late-summer heavy trims, as these can stress the plant and produce weak late growth.</p>
          
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">When should you fertilize crepe myrtle?</h2>
          <p className="mb-6">Apply a balanced, slow‑release fertilizer in early spring just before new growth starts. Avoid excessive nitrogen, which encourages leafy growth at the expense of flowers. In rich soils, fertilizer may not be necessary at all. Maintaining good soil structure and consistent moisture during establishment matters more than frequent feeding.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune crepe myrtle in spring?</h2>
          <p className="mb-6">Yes — early spring is the ideal window, just before new buds break. Remove suckers at the base, thin out crowded branches to maintain good structure, and shape lightly while preserving the natural canopy. Avoid major cuts once leaves emerge, or flowering may be delayed.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune crepe myrtle in summer?</h2>
          <p className="mb-6">Pruning in summer should be limited to deadheading faded blooms and removing damaged or rubbing branches. Mid‑ to late‑summer heavy pruning encourages tender regrowth that may not harden before autumn, reducing blooms and increasing pest susceptibility.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune crepe myrtle in autumn (fall)?</h2>
          <p className="mb-6">Avoid pruning in autumn. Cuts stimulate late regrowth that may suffer frost damage. Also, pruning too close to winter makes the plant more vulnerable to cold stress. Leave structural pruning for winter/early spring instead.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune crepe myrtle in winter?</h2>
          <p className="mb-6">Yes — late winter is the safest time for structural pruning. Remove crossing limbs, root suckers, and any inward‑growing shoots to maintain airflow and shape. Winter is also a good time to correct past improper topping — selectively thin rather than cut everything to the same height.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Caring for crepe myrtle? The most common mistake</h2>
          <p className="mb-6">The biggest mistake is topping crepe myrtles (“crape murder”). Cutting large limbs back to stubs causes weak regrowth, unattractive knobby joints, and fewer flowers. Instead, prune selectively, following the natural branching structure. Over‑fertilizing, over‑watering, or pruning too late are also common reasons crepe myrtles fail to bloom.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Reminder-friendly quick tasks</h2>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li><strong>Late winter / early spring:</strong> Perform structural pruning before new growth.</li>
            <li><strong>Early spring:</strong> Apply light slow‑release fertilizer if needed.</li>
            <li><strong>Summer:</strong> Deadhead to encourage additional flowering; remove suckers.</li>
            <li><strong>Throughout growing season:</strong> Monitor shape and airflow; avoid topping.</li>
            <li><strong>Autumn / winter:</strong> Avoid heavy pruning until late winter returns.</li>
          </ul>
          <p>Track pruning timing carefully — selective cuts in late winter reward you with stronger structure and a longer, more vibrant summer bloom.</p>

        </div>
      </ArticleLayout>
      <section className="mt-16">
        <ArticleCarousel exclude="/articles/caring-for-crepe-myrtle-seasonal-guide" />
      </section>
    </>
  );
};

export default CaringForCrepeMyrtleSeasonalGuide;
