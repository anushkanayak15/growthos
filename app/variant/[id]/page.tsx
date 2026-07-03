import { notFound } from 'next/navigation';
import { getVariant, VARIANTS } from '@/lib/variants';
import { VariantPageBody } from '@/components/landing/VariantPageBody';
import { Gen2VariantView } from '@/components/landing/Gen2VariantView';

export function generateStaticParams() {
  return [...VARIANTS.map((v) => ({ id: v.id })), { id: 'G2' }];
}

export default async function VariantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === 'G2') {
    return <Gen2VariantView />;
  }

  const variant = getVariant(id);
  if (!variant) notFound();

  return <VariantPageBody variant={variant} />;
}
