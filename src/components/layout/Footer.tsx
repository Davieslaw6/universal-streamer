import Link from 'next/link';

/**
 * TMDB attribution.
 *
 * TMDB's terms require the attribution notice:
 *   "This product uses the TMDB API but is not endorsed or certified by TMDB."
 * together with the official TMDB logo. The logo asset is NOT bundled here
 * because it must be downloaded from TMDB's own brand page rather than
 * recreated. Drop the official file at `public/tmdb-logo.svg` and swap the
 * commented <Image> back in. See README for details.
 */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-bg-elevated">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 py-8 text-sm text-text-secondary">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-text-primary">
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
          {/* Official logo asset required by TMDB's terms — see README. */}
          {/* <Image src="/tmdb-logo.svg" alt="TMDB" width={80} height={20} /> */}
          <p>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-border underline-offset-2 hover:text-text-primary"
            >
              TMDB
            </a>{' '}
            is used for metadata and availability data only.
          </p>
        </div>

        <p>
          Universal Streamer is a discovery and launcher tool. All playback
          happens on the official streaming service — we do not host, proxy,
          transcode, or play any video ourselves.
        </p>

        <p>
          We never ask for, collect, transmit, or store your streaming account
          credentials.{' '}
          <Link
            href="/settings"
            className="underline decoration-border underline-offset-2 hover:text-text-primary"
          >
            Read why
          </Link>
          .
        </p>

        <p className="text-xs text-text-secondary">
          Provider deep links are best-effort public search URLs and may change
          if a service alters its URL scheme.
        </p>
      </div>
    </footer>
  );
}
