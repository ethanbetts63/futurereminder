import { ArticleLayout } from '../../components/ArticleLayout';
import articleImage from '../../assets/postnotes.webp'; // Using generic image as requested
import { ArticleCarousel } from '../../components/ArticleCarousel';
import Seo from '../../components/Seo';

const CaringForAzaleasSeasonalGuide = () => {
  return (
    <>
      <Seo
        title="When & How to Care for Azaleas (Seasonal Guide)"
        description="Azalea care depends heavily on bloom timing and root health. Pruning at the wrong time quickly removes next year’s display, so timing is critical."
        canonicalPath="/articles/caring-for-azaleas-seasonal-guide"
        ogType="article"
        ogImage="/og-images/og-caring-for-azaleas.webp" // <-- TODO: Add this OG image
      />
      <ArticleLayout
        title="When & How to Care for Azaleas (A Seasonal Guide)"
        subtitle={<>Azalea care depends heavily on bloom timing and root health. These shallow‑rooted shrubs form flower buds soon after blooming, so <strong>pruning at the wrong time quickly removes next year’s display.</strong> Protecting roots from heat, drought, and over‑fertilizing is more important than shaping.</>}
        imageSrc={articleImage}
        imageAlt="A flowering azalea bush with bright pink blooms"
      >
        <div className="text-lg text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-2">When should you prune azaleas?</h2>
          <p className="mb-6">Prune azaleas right after they finish flowering in late spring or early summer. They set next year’s buds soon after blooming, so delaying pruning risks removing those buds. Keep cuts light – azaleas respond poorly to heavy pruning and may become leggy if cut back too far.</p>
          
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">When should you trim azaleas?</h2>
          <p className="mb-6">Trimming should be mainly cosmetic. Remove spent blooms and lightly shape the shrub soon after flowering. Avoid cutting into old, bare wood, which rarely resprouts. Light thinning improves airflow and reduces risk of lace bug damage and fungal disease.</p>
          
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">When should you fertilize azaleas?</h2>
          <p className="mb-6">Fertilize sparingly in early spring when active growth begins. Use an acidic fertilizer designed for azaleas or rhododendrons. Avoid feeding after midsummer, as late fertilizing encourages tender growth vulnerable to winter damage. In nutrient‑rich soils, fertilizing may not be necessary at all.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune azaleas in spring?</h2>
          <p className="mb-6">Spring pruning is safe only immediately after flowering. Early spring pruning risks cutting off forming buds; late spring starts the countdown to next year’s bud set, so timing must be precise. If pruning must happen, finish within 2–3 weeks of bloom fade.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune azaleas in summer?</h2>
          <p className="mb-6">Avoid pruning in mid to late summer. Buds for next spring are being formed, and removing stems now reduces bloom count dramatically. If necessary, only remove dead or diseased wood.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune azaleas in autumn (fall)?</h2>
          <p className="mb-6">Autumn pruning removes developing buds for next spring and stresses the plant before winter. Leave pruning until the next flowering cycle, unless removing clearly dead stems.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune azaleas in winter?</h2>
          <p className="mb-6">Winter pruning is discouraged for shaping — buds are dormant but already present. Removing stems now means fewer blooms next season. If needed, winter pruning should be strictly limited to removing dead wood.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Caring for azaleas? The most common mistake</h2>
          <p className="mb-6">The most frequent mistake is pruning too late, which removes the buds that form right after flowering. Other common issues include planting too deep, heavy fertilizing, and allowing soil to dry out. Protect shallow roots with mulch, avoid summer pruning, and feed lightly.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Reminder-friendly quick tasks</h2>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li><strong>Right after flowering (late spring / early summer):</strong> Light prune and shape; remove spent blooms.</li>
            <li><strong>Early spring:</strong> Apply azalea‑safe fertilizer if needed.</li>
            <li><strong>Winter / summer / fall:</strong> Avoid pruning except to remove dead or diseased wood.</li>
            <li><strong>Throughout the year:</strong> Maintain mulch layer; monitor soil moisture for shallow roots.</li>
          </ul>
          <p>With careful timing, pruning right after bloom ensures a fuller flower display next spring.</p>

        </div>
      </ArticleLayout>
      <section className="mt-16">
        <ArticleCarousel exclude="/articles/caring-for-azaleas-seasonal-guide" />
      </section>
    </>
  );
};

export default CaringForAzaleasSeasonalGuide;
