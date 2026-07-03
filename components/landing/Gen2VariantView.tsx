'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import type { Variant } from '@/lib/variants';
import { VariantPageBody } from './VariantPageBody';
import { GEN2_STORAGE_KEY } from '@/lib/gen2Storage';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot() {
  return localStorage.getItem(GEN2_STORAGE_KEY);
}

function getServerSnapshot() {
  return null;
}

export function Gen2VariantView() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const gen2: Variant | null = raw ? safeParse(raw) : null;

  if (gen2 === null) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="font-display text-lg font-medium mb-2">Gen 2 hasn&apos;t been evolved yet</p>
          <p className="text-sm text-graphite-soft mb-4">
            Run the growth experiment and evolve a Gen 2 page in the lab first — it&apos;s generated fresh from that run&apos;s evidence.
          </p>
          <Link href="/lab" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            ← back to lab
          </Link>
        </div>
      </div>
    );
  }

  return <VariantPageBody variant={gen2} />;
}

function safeParse(raw: string): Variant | null {
  try {
    return JSON.parse(raw) as Variant;
  } catch {
    return null;
  }
}
