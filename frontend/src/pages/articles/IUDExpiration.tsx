import { ArticleLayout } from '../../components/layouts/ArticleLayout';
import articleImage from '../../assets/iud_expiry.webp';
import { ArticleCarousel } from '../../components/ArticleCarousel';
import Seo from '../../components/Seo';

const IUDExpiration = () => {
  return (
    <>
      <Seo
        title="When do IUDs expire — and what happens after the label date?"
        description="Contraceptive implants are effective for 3-12 years depending on type. After expiration, effectiveness wanes gradually, and forgetting removal is common. Learn when to replace and how to remember."
        canonicalPath="/articles/iud-expiration"
        ogType="article"
        ogImage="/og-images/og-iud-expiration.webp"
      />
      <ArticleLayout
        title="IUD & Implant Expiry: When, What and How to Remember"
        subtitle={<><span className="font-bold italic underline">Article Summary:</span> Contraceptive implants have a recommended lifespan (Mirena up to 8 years, Kyleena ~5 years, Skyla ~3 years, Paragard ~10–12 years, Nexplanon/Implanon ~3 years). Thereafter, effectiveness reduces gradually, other desired health effects may wane and removal may be harder, but the device can still function for years. Forgetting a contraceptive implant is common due to the long time horizon and poor reminder strategies. </>}
        imageSrc={articleImage}
        imageAlt="Conceptual image about IUDs and contraceptive implants"
        faqPage="iud-expiration"
      >
        <div className="text-lg text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-4">When do IUDs expire — and what happens after the label date?</h2>
          <p className="mb-6">IUDs come with clear expiration windows (Mirena up to 8 years, Kyleena ~5 years, Skyla ~3 years) tied to their design and hormone dose. Inside the uterus they gradually release levonorgestrel (hormonal IUDs) or copper (nonhormonal IUDs). That release tapers over time — <span className="font-bold italic underline">it's not a cliff, it's a slow slope</span> — so most people won’t notice a sudden change. In practical terms: during the first one to two years after the approved lifespan most hormonal IUDs still prevent pregnancy at high rates but the rate does begin to decline and become more unpredictable.</p>
          <p className="mb-6">Paragard (~10–12 years) and other copper IUDs can also remain protective for some years past their label. Additionally hormone-related benefits (lighter periods, less bleeding) can fade as levels fall, and bleeding or cramping may return. The main risk of keeping an IUD past its date is an unexpected pregnancy as effectiveness wanes — plus occasional technical issues like string retraction or device shift that can make removal a bit more complicated.</p>
          
          <p className="mb-6"><span className="font-bold italic underline">Bottom line:</span> If your IUD has expired and you don't know what to do, you likely don’t need to panic, but you should book a doctor's appointment as soon as possible and in the meantime use alternative contraceptives and take a pregnancy test.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">When does Nexplanon / Implanon stop working — what to expect after year 3?</h2>
          <p className="mb-6">Arm implants are simple: a single rod under the skin releases etonogestrel to stop ovulation. The manufacturer label says “remove at 3 years,” but <span className="font-bold italic underline">hormone levels decline slowly</span> and real-world data show many people may remain protected into years 4 and even 5. </p>
          <p>Still, unlike IUDs that sit in the uterus, the implant can become a little harder to remove the longer it’s there because tissue may surround it, and the small possibility of migration (very rare) can complicate removal. Functionally, the protection drops gradually — you won’t flip from fully protected to unprotected overnight — but the <span className="font-bold italic underline">risk of pregnancy rises</span> with time past the labeled lifespan. If you’re approaching year 3, plan to see your provider; if you’ve just realized it’s already expired, try to relax, but arrange removal or replacement soon and consider temporary backup contraception until it’s done.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">What’s the best app for IUD or Nexplanon removal reminders?</h2>
          <p className="mb-6">Very commonly, <span className="font-bold italic underline">many people show up years past expiration</span>, usually because life got busy, they lost the card or they forgot which year it was placed. Plain calendar alerts and “email yourself in 5 years” tools feel convenient, but they’re fragile: phone numbers change, emails get abandoned, apps are deleted, and a single message can be missed or filtered to junk. For high-consequence events spaced years apart you want a reminder system built to persist.</p> 
          <p> is the only app designed for exactly that: instead of one alert it uses an escalation hierarchy that starts with emails and push notifications, then moves to SMS, calls, and — if all else fails — outreach to emergency contacts. If you need a dependable, long-term safety net for device expiries, use a system that won’t stop trying until you acknowledge the reminder.</p>
        </div>
      </ArticleLayout>
      <section className="mt-16">
        <ArticleCarousel exclude="/articles/iud-expiration" />
      </section>
    </>
  );
};

export default IUDExpiration;
