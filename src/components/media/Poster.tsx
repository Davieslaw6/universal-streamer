import { initials, imageUrl, placeholderHue } from '@/lib/format';

/**
 * Poster with a reserved 2:3 aspect ratio and a styled gradient placeholder.
 * `null` poster paths never produce a broken image.
 */
export function Poster({
  posterPath,
  title,
  className = '',
  size = 'w342',
}: {
  posterPath: string | null;
  title: string;
  className?: string;
  size?: 'w200' | 'w342' | 'w500';
}) {
  const src = imageUrl(posterPath, size);

  return (
    <div
      className={`relative aspect-[2/3] w-full overflow-hidden rounded bg-bg-hover ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={`${title} poster`}
          width={342}
          height={513}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center"
          style={{
            backgroundImage: `linear-gradient(140deg, hsl(${placeholderHue(
              title.length * 37,
            )} 45% 22%), hsl(${placeholderHue(title.length * 37)} 40% 12%))`,
          }}
        >
          <span className="text-2xl font-bold tracking-wide text-text-primary">
            {initials(title)}
          </span>
        </div>
      )}
    </div>
  );
}
