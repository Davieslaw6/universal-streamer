import type { Metadata } from 'next';
import { DangerZone } from '@/components/settings/DangerZone';
import { PasswordExplainer } from '@/components/settings/PasswordExplainer';
import { RegionSelect } from '@/components/settings/RegionSelect';
import { ServiceToggles } from '@/components/settings/ServiceToggles';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <div className="flex max-w-4xl flex-col gap-8">
      <h1 className="text-2xl font-bold text-text-primary">Settings</h1>

      <section aria-labelledby="theme-heading" className="flex flex-col gap-3">
        <h2 id="theme-heading" className="text-base font-semibold text-text-primary">
          Appearance
        </h2>
        <p className="text-sm text-text-secondary">
          System follows your operating system&apos;s light/dark preference and
          updates live when it changes.
        </p>
        <ThemeToggle variant="full" />
      </section>

      <RegionSelect />
      <ServiceToggles />
      <PasswordExplainer />
      <DangerZone />
    </div>
  );
}
