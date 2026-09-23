import { Lock } from 'lucide-react';

/**
 * Permanent, plain-English explainer. This panel must never be removed: the
 * "no third-party credentials" guarantee is a hard product constraint.
 */
export function PasswordExplainer() {
  return (
    <section
      aria-labelledby="password-explainer-heading"
      className="flex flex-col gap-3 rounded border border-border bg-bg-elevated p-4"
    >
      <div className="flex items-center gap-2">
        <Lock aria-hidden="true" className="h-4 w-4 text-accent" />
        <h2
          id="password-explainer-heading"
          className="text-base font-semibold text-text-primary"
        >
          Why we don&apos;t store your passwords
        </h2>
      </div>

      <p className="text-sm leading-relaxed text-text-secondary">
        Universal Streamer never asks for your Netflix, Prime Video, Disney+, or
        any other streaming password. There is no password field anywhere in
        this app, not even an optional one — because a password you never hand
        over is a password that can never leak.
      </p>

      <p className="text-sm leading-relaxed text-text-secondary">
        We&apos;re a discovery and launcher tool, not a player and not a vault.
        When you tap &ldquo;Watch on Netflix&rdquo;, we open Netflix&apos;s own
        app or website in a new tab and you sign in there, exactly as you
        normally would. Your credentials stay with the service that issued them.
      </p>

      <p className="text-sm leading-relaxed text-text-secondary">
        All we save locally on your device is your theme choice, the services
        you&apos;ve enabled, your watchlist, and your region. Clearing your
        browser data removes every trace of it.
      </p>
    </section>
  );
}
