import { describe, expect, it } from 'vitest';
import {
  buildQuery,
  buildTrailerSearchUrl,
  buildWatchUrl,
} from '@/lib/providers/deep-links';
import { PROVIDER_IDS } from '@/lib/providers/catalog';
import type { ProviderId } from '@/types/provider';

const EXPECTED_PATTERNS: Record<ProviderId, RegExp> = {
  netflix: /^https:\/\/www\.netflix\.com\/search\?q=/,
  'prime-video': /^https:\/\/www\.amazon\.com\/s\?k=.*&i=instant-video$/,
  'disney-plus': /^https:\/\/www\.disneyplus\.com\/search\?q=/,
  max: /^https:\/\/play\.max\.com\/search\?q=/,
  hulu: /^https:\/\/www\.hulu\.com\/search\?q=/,
  'apple-tv-plus': /^https:\/\/tv\.apple\.com\/search\?term=/,
  'paramount-plus': /^https:\/\/www\.paramountplus\.com\/search\//,
  peacock: /^https:\/\/www\.peacocktv\.com\/search\?q=/,
  youtube: /^https:\/\/www\.youtube\.com\/results\?search_query=.*\+trailer$/,
};

describe('buildQuery', () => {
  it('encodes title and year', () => {
    expect(buildQuery('Dune', '2021')).toBe('Dune%202021');
  });

  it('omits the year when it is null or empty', () => {
    expect(buildQuery('Dune', null)).toBe('Dune');
    expect(buildQuery('Dune', '')).toBe('Dune');
  });

  it('trims surrounding whitespace', () => {
    expect(buildQuery('  Dune  ', 2021)).toBe('Dune%202021');
  });

  it('escapes characters that would break a URL', () => {
    expect(buildQuery('Fast & Furious', 2001)).toBe('Fast%20%26%20Furious%202001');
  });
});

describe('buildWatchUrl', () => {
  it.each(PROVIDER_IDS)(
    'produces a well-formed, expected URL for %s',
    (providerId) => {
      const url = buildWatchUrl(providerId, 'Dune', 2021);
      expect(() => new URL(url)).not.toThrow();
      expect(url).toMatch(EXPECTED_PATTERNS[providerId]);
      expect(url).toContain('Dune%202021');
    },
  );

  it('prefers a TMDB-supplied link when one exists', () => {
    const url = buildWatchUrl('netflix', 'Dune', 2021, 'https://www.netflix.com/title/123');
    expect(url).toBe('https://www.netflix.com/title/123');
  });

  it('ignores a malformed TMDB link and falls back to the table', () => {
    const url = buildWatchUrl('netflix', 'Dune', 2021, 'javascript:alert(1)');
    expect(url).toMatch(EXPECTED_PATTERNS.netflix);
  });

  it('ignores a non-http TMDB link', () => {
    const url = buildWatchUrl('hulu', 'Dune', 2021, '/relative/path');
    expect(url).toMatch(EXPECTED_PATTERNS.hulu);
  });

  it('works without a year', () => {
    const url = buildWatchUrl('peacock', 'Dune');
    expect(url).toBe('https://www.peacocktv.com/search?q=Dune');
  });
});

describe('buildTrailerSearchUrl', () => {
  it('always targets a YouTube search with the trailer suffix', () => {
    const url = buildTrailerSearchUrl('Dune', 2021);
    expect(url).toBe(
      'https://www.youtube.com/results?search_query=Dune%202021+trailer',
    );
    expect(() => new URL(url)).not.toThrow();
  });
});
