# Future Plans

## 1. Programmatic & Long-Tail SEO Architecture
To capture high-intent niche searches, we plan to establish a scalable article framework.
- **Data Structure**: Create `src/data/articles.ts` to manage programmatic content easily without a CMS.
- **Article Listing (`/articles`)**: Build a fully responsive index page that displays all available guides, comparisons, and tips.
- **Dynamic Articles (`/articles/[slug]`)**: Build a robust rendering engine for individual articles.
  - **Static Site Generation (SSG)**: Implement `getStaticProps` and `getStaticPaths` so these pages are pre-built as ultra-fast, raw HTML files.
  - **Advanced Schema**: Automatically inject `ArticleJsonLd` and `BreadcrumbJsonLd` to ensure the content is eligible for Top Stories and rich search results.

## 2. Public Guide Profiles (Expertise & Trust)
Search engines reward content backed by verified human experts (E-E-A-T).
- **Public Profile Pages (`pages/guides/[id].tsx`)**: Create a dynamic route to render a dedicated public profile page for each guide (e.g., Pritam Negi, Bhojraj). Include their experience, languages, ratings, and a list of treks they lead.
- **JSON-LD**: Implement `ProfilePage` and `Person` JSON-LD structured data to establish them as verified entities in Google's Knowledge Graph.
- **UI Integration**: Update the `GuideCard` component to include a "View Full Profile" link, pointing to `/guides/[id]`.

## 3. User-Generated Content & Reviews (Experience)
Google heavily prioritizes first-hand experiences and authentic reviews.
- **Data**: Extend the trek data model to include sample written reviews (or fetch them dynamically).
- **UI & Schema**: Create a `<TrekReviews />` component to display top reviews directly on the public trek pages (`/destinations/[slug].tsx`), and inject `Review` JSON-LD into the existing `ProductJsonLd` so that star ratings appear natively in Google Search results.
