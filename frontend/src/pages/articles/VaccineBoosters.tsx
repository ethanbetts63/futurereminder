import { ArticleLayout } from '../../components/layouts/ArticleLayout';
import articleImage from '../../assets/vaccine_image.webp';
import { ArticleCarousel } from '../../components/ArticleCarousel';
import Seo from '../../components/Seo';

const VaccineBoosters = () => {
  return (
    <>
      <Seo
        title="Vaccine Boosters: What You Need and When"
        description="This article covers effectiveness duration for common vaccines that require boosters, including Tetanus. Learn why these boosters are essential and how to remember them."
        canonicalPath="/articles/vaccine-boosters"
        ogType="article"
        ogImage="/og-images/og-vaccine-boosters.webp"
      />
      <ArticleLayout
        title="Vaccine Boosters: What You Need and When"
        subtitle={<><span className="font-bold italic underline">Article Summary:</span> For people that live or work in high risk environments there are several common vaccines that require ongoing boosters; Rabies (every ~1-3 years), Japanese Encephalitis (every ~12 months), Typhoid (every ~2 years) and (in some regions) Yellow Fever (every ~10 years). Tetanus requires a booster every 10 years regardless of lifestyle. Lapses in vaccine protection are common due to the long time horizon and poor available reminder strategies.</>}
        imageSrc={articleImage}
        imageAlt="Conceptual image about vaccines and reminders"
        faqPage="vaccine-boosters"
      >
        <div className="text-lg text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-4">How often do you need a tetanus shot?</h2>
          <p className="mb-6">Tetanus is probably the most well-known vaccine that requires ongoing boosters throughout adult life. The standard recommendation is a <span className="font-bold italic underline">tetanus booster every 10 years</span> (typically given as Td or Tdap). Tetanus is a serious bacterial infection that affects the nervous system, leading to painful muscle contractions, particularly of the jaw and neck muscles. In severe cases, it can cause difficulty breathing and be life-threatening. Maintaining up-to-date vaccination status is the most effective way to prevent tetanus.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Which common vaccines require boosters? And why?</h2>
          <p className="mb-6">Outside of tetanus, very few routine adult vaccines require long‑term boosters — which is why the ones that do are easy to overlook. Most standard vaccines such as MMR, Varicella, Hepatitis A and B, HPV, COVID‑19, Shingles, and Pneumococcal do not require regular decade‑spaced boosters once the primary series is complete.</p>
          <p className="mb-6">However, a second category of vaccines does involve long‑term maintenance for people who live, work, or repeatedly travel to high‑risk regions. These include:</p>
          <ul className="list-disc pl-8 mb-6 space-y-2">
            <li><strong>Rabies (pre‑exposure)</strong> — requires periodic titer checks and boosters for those with ongoing occupational exposure.</li>
            <li><strong>Japanese Encephalitis</strong> — booster recommended after one year if continued risk is expected.</li>
            <li><strong>Typhoid (injectable)</strong> — booster recommended every two years for ongoing exposure.</li>
            <li><strong>Yellow Fever</strong> — usually lifelong after one dose, but certain countries still require proof of a booster every 10 years.</li>
          </ul>
          <p className="mb-6">These aren’t everyday vaccines for most people — but for travelers, aid workers, veterinarians, lab workers, and people living abroad, missing a booster can have real consequences.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Which vaccine or flu-shot reminder app is best?</h2>
          <p className="mb-6">Regular calendar and reminder apps are not designed to bridge the five-, eight-, or ten-year gaps required for booster shots. Over time, phone numbers change, email accounts are abandoned, and apps are deleted. Even the single emails and notifications that make it to users are often missed or lost in junk mail. Vaccine boosters can be incredibly important and deserve to be treated as such.</p>
          <p className="mb-6"> FutureReminder is engineered specifically for these long-term, high-consequence events. Rather than relying on a single alert that can be easily missed, it utilizes a <span className="font-bold italic underline">notification escalation hierarchy</span> that persists until you acknowledge it. If your primary email or mobile number bounces, the FutureReminder system moves to backup contacts and social media handles. If all else fails, it even has the ability to utilize emergency contacts.  For critical, long-cycle health requirements—such as Tetanus boosters or occupational Rabies checks— FutureReminder acts as a vital additional layer of health security.</p>
        </div>
      </ArticleLayout>
      <section className="mt-16">
        <ArticleCarousel exclude="/articles/vaccine-boosters" />
      </section>
    </>
  );
};

export default VaccineBoosters;
