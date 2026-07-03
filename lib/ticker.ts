import type { UserRecord } from './simulation';
import { PERSONAS } from './personas';
import type { SectionType } from './variants';

const SECTION_LABEL: Record<SectionType, string> = {
  hero: 'headline',
  socialProof: 'testimonials',
  features: 'features',
  demo: 'demo',
  pricing: 'pricing',
  faq: 'FAQ',
  cta: 'CTA',
  urgencyBar: "countdown",
};

const personaName = (id: string) => PERSONAS.find((p) => p.id === id)?.name ?? id;

export function describeUser(record: UserRecord, variantId: string): string {
  const name = personaName(record.personaId).replace('The ', '');
  const idx = (record.userIndex + 1).toLocaleString();
  const last = record.sectionDwells[record.sectionDwells.length - 1];
  const label = last ? SECTION_LABEL[last.sectionType] : 'page';

  if (record.heroGateFailed) {
    return `${name} #${idx} bounced off ${variantId}'s ${label} in ${record.totalTimeSeconds.toFixed(1)}s`;
  }
  if (record.converted) {
    return `${name} #${idx} converted on ${variantId} after ${label}`;
  }
  if (record.bounced) {
    return `${name} #${idx} bounced on ${variantId}'s ${label}`;
  }
  return `${name} #${idx} spent ${record.totalTimeSeconds.toFixed(0)}s on ${variantId}, then drifted away`;
}
