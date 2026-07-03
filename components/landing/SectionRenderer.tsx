import type { Section, VariantTheme } from '@/lib/variants';
import { Hero } from './sections/Hero';
import { SocialProof } from './sections/SocialProof';
import { Features } from './sections/Features';
import { Demo } from './sections/Demo';
import { Pricing } from './sections/Pricing';
import { Faq } from './sections/Faq';
import { Cta } from './sections/Cta';
import { UrgencyBar } from './sections/UrgencyBar';
import { DemoB } from './sections/variants/DemoB';
import { DemoD } from './sections/variants/DemoD';
import { HeroA } from './sections/variants/HeroA';
import { HeroB } from './sections/variants/HeroB';
import { HeroC } from './sections/variants/HeroC';
import { HeroD } from './sections/variants/HeroD';
import { HeroE } from './sections/variants/HeroE';
import { SocialProofA } from './sections/variants/SocialProofA';
import { SocialProofC } from './sections/variants/SocialProofC';

export function SectionRenderer({
  section,
  theme,
  variantId,
  showProvenance = false,
}: {
  section: Section;
  theme: VariantTheme;
  variantId?: string;
  showProvenance?: boolean;
}) {
  const body = (() => {
    if (variantId === 'A') {
      if (section.type === 'hero') return <HeroA section={section} theme={theme} />;
      if (section.type === 'socialProof') return <SocialProofA section={section} theme={theme} />;
    }

    if (variantId === 'B') {
      if (section.type === 'hero') return <HeroB section={section} theme={theme} />;
      if (section.type === 'demo') return <DemoB section={section} theme={theme} />;
    }

    if (variantId === 'C') {
      if (section.type === 'hero') return <HeroC section={section} theme={theme} />;
      if (section.type === 'socialProof') return <SocialProofC section={section} theme={theme} />;
    }

    if (variantId === 'D') {
      if (section.type === 'hero') return <HeroD section={section} theme={theme} />;
      if (section.type === 'demo') return <DemoD section={section} theme={theme} />;
    }

    if (variantId === 'E' && section.type === 'hero') {
      return <HeroE section={section} theme={theme} />;
    }

    switch (section.type) {
      case 'hero':
        return <Hero section={section} theme={theme} />;
      case 'socialProof':
        return <SocialProof section={section} theme={theme} />;
      case 'features':
        return <Features section={section} theme={theme} />;
      case 'demo':
        return <Demo section={section} theme={theme} />;
      case 'pricing':
        return <Pricing section={section} theme={theme} />;
      case 'faq':
        return <Faq section={section} />;
      case 'cta':
        return <Cta section={section} theme={theme} />;
      case 'urgencyBar':
        return <UrgencyBar section={section} theme={theme} />;
      default:
        return null;
    }
  })();

  if (!showProvenance || !section.provenance) return body;

  return (
    <div className="relative">
      <div className="absolute right-4 top-2 z-10 rounded-full border border-hairline bg-surface/90 backdrop-blur px-3 py-1 text-[11px] font-mono text-graphite-soft">
        from {section.provenance.parent} — {section.provenance.reason}
      </div>
      {body}
    </div>
  );
}
