# SEO Improvement Plan

## 1. Technical SEO Audit

- Review all public routes: home, destinations, trek detail pages, gallery pages, about, and community.
- Check existing `<Head>` usage, titles, descriptions, canonical URLs, robots rules, Open Graph metadata, Twitter metadata, and favicon/social image coverage.
- Identify pages that should be indexed versus hidden, such as dashboard, auth, and private user pages.

## 2. Core Metadata Upgrade

- Add consistent SEO metadata per route.
- Use unique titles and descriptions for each trek page.
- Add canonical URLs to prevent duplicate-indexing issues.
- Add Open Graph and Twitter cards for better link previews.
- Normalize brand naming, likely using `Uncharted Travel` instead of mixed `UnchartedTravel`.

## 3. Structured Data

- Add JSON-LD schema for `Organization`.
- Add JSON-LD schema for `WebSite`.
- Add JSON-LD schema for `BreadcrumbList`.
- Add structured data for trek pages, likely `TouristTrip` or `Product` depending on how bookings are positioned.
- Include trek name, overview, image, location, provider or guide where available, and URL.

## 4. Indexing Infrastructure

- Add or improve `robots.txt`.
- Add dynamic `sitemap.xml` including:
    - `/`
    - `/about`
    - `/destinations`
    - each `/destinations/[slug]`
    - optional gallery pages if they are useful landing pages
- Exclude private or user-specific pages like `/dashboard`.

## 5. Content & Heading Improvements

- Verify each page has a single meaningful `h1`.
- Improve trek detail pages with search-friendly visible copy where needed.
- Make destination cards and internal links descriptive.
- Add breadcrumb navigation to trek pages if not already present.

## 6. Image SEO

- Review important images for descriptive `alt` text.
- Ensure major trek images are suitable for social previews.
- Check if large media files are hurting performance and convert or optimize where practical.

## 7. Performance & Crawl Quality

- Run `npm run build` and inspect warnings.
- Check common SEO-impacting issues: broken links, missing pages, client-only content that search engines may not see, excessive layout shift, and unoptimized media.
- Avoid changing unrelated design unless needed for semantic structure.

## 8. Verification

- Run `npm run lint`.
- Run `npm run build`.
- If tests exist around touched components, run `npm test` or targeted tests.
- Summarize implemented SEO changes and any remaining content or marketing recommendations that require business input.
