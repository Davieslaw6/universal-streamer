# Universal Streamer

A universal streaming **discovery hub and launcher**. It aggregates movie and TV
metadata into one Netflix-style browsing experience, shows which services each
title is available on, and hands playback off to the official app or site via a
deep link.

**It is not a unified player and it is not a password vault.** Those are hard
product boundaries, not preferences.

## What it is / isn't

| Is | Isn't |
|---|---|
| A discovery and browse UI | A video player |
| A deep-link launcher into official apps | A proxy, scraper, or stream extractor |
| A local-only watchlist and preferences store | A credential vault |
| A TMDB consumer (documented public API only) | Anything that touches DRM |

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
