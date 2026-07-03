import type { Section, VariantTheme } from '@/lib/variants';
import { Hero } from './sections/Hero';
import { SocialProof } from './sections/SocialProof';
import { Features } from './sections/Features';
import { Demo } from './sections/Demo';
import { Pricing } from './sections/Pricing';
import { Faq } from './sections/Faq';
import { Cta } from './sections/Cta';
import { UrgencyBar } from './sections/UrgencyBar';

export function SectionRenderer({
  section,
  theme,
  showProvenance = false,
}: {
  section: Section;
  theme: VariantTheme;
  showProvenance?: boolean;
}) {
  const body = (() => {
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
