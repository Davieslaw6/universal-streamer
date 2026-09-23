import { PROVIDERS } from '@/lib/providers/catalog';
import type { ProviderId } from '@/types/provider';

export function ProviderBadges({
  providerIds,
  max = 5,
  size = 20,
  className = '',
}: {
  providerIds: ProviderId[];
  max?: number;
  size?: number;
  className?: string;
}) {
  if (providerIds.length === 0) {
    return (
      <p className={`text-[11px] text-text-secondary ${className}`}>
        Not on your services
      </p>
    );
  }

  const shown = providerIds.slice(0, max);
  const overflow = providerIds.length - shown.length;

  return (
    <ul
      className={`flex items-center gap-1 ${className}`}
      aria-label={`Available on ${providerIds
        .map((id) => PROVIDERS[id].name)
        .join(', ')}`}
    >
      {shown.map((id) => {
        const provider = PROVIDERS[id];
        return (
          <li key={id}>
            <img
              src={provider.fallbackBadge}
              alt={provider.name}
              title={provider.name}
              width={size}
              height={size}
              loading="lazy"
              decoding="async"
              className="rounded-sm"
            />
          </li>
        );
      })}
      {overflow > 0 ? (
        <li className="text-[11px] font-medium text-text-secondary">
          +{overflow}
        </li>
      ) : null}
    </ul>
  );
}
