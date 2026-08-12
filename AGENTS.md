# Project rules

This is a Next.js 16 App Router migration of sie-sucht-sie.de.

- Preserve the live brand and public URL canonicals.
- Keep registration/login/help/legal platform routes on the live ICONY domain.
- Location pages use `AID=location`; magazine/editorial surfaces use `AID=magazin`.
- Public imports must exclude dynamic member data, forms, and personalized content.
- Read relevant local Next.js documentation from `node_modules/next/dist/docs/` before changing framework conventions.
