# Competitor Package Comparison Tool

You want to build a tool where users can paste links from competitor trekking websites, and the system automatically extracts the package details (price, batch size, inclusions) to generate a side-by-side comparison matrix.

Since we are limiting this to specific, well-known competitors for now, we will build a **targeted extraction system** using custom rules for each supported website, entirely bypassing the need for an AI/LLM API key. The implementation must first confirm that each supported site can be accessed and parsed safely, legally, and reliably.

## Open Question for You:
**Which Competitors?**
To build the scraping rules, I need to know which websites we are officially supporting. Please provide the names (e.g., Indiahikes, Trek The Himalayas, Bikat Adventures) so I can write the specific extraction logic for their domains.

## Pre-Implementation Checks

Before writing scraper code for any competitor:

- Confirm the competitor's public terms, robots policy, and acceptable-use constraints.
- Inspect 2-3 representative package pages per competitor.
- Confirm the target fields are present in server-rendered HTML or otherwise accessible without bypassing protections.
- Record sample URLs and expected extracted values for fixture tests.
- Decide whether each competitor is approved, blocked, or requires manual data entry instead of automated extraction.

## Proposed Architecture

### 1. The Frontend UI (`pages/compare.tsx`)
- **Input Section:** A clean interface allowing users to paste up to 3 URLs.
- **Domain Validation:** The input field will reject URLs that do not belong to the supported competitors.
- **Comparison Matrix:** A side-by-side table displaying the extracted data:
  - Total Price
  - Advertised Batch Size (if listed)
  - Claimed Safety Gear
  - Inclusions / Exclusions
  - Number of Days
- **Confidence Labels:** Each extracted field should show whether it is confirmed, inferred, missing, or unavailable.
- **Failure States:** If extraction fails, the UI should clearly explain which URL failed and allow the user to remove or retry it.

### 2. The Backend API (`pages/api/extractPackage.ts`)
When the frontend submits a URL, this endpoint will:
1. **Identify Provider:** Parse the URL domain to determine which competitor it belongs to.
2. **Validate URL Safety:** Enforce an HTTPS-only strict hostname allowlist.
3. **Headless Execution (Browserless):** Connect to a remote Browserless instance using `puppeteer-core` via WebSocket. This bypasses Vercel's Security Checkpoint by executing the required JavaScript natively as a real browser.
4. **Targeted Extraction:** Once the page is fully loaded, use `puppeteer` to evaluate the DOM and extract text using specific CSS selectors (e.g., `.price-amount`).
5. **Normalize:** Convert raw extracted values into a canonical schema.
6. **Return:** Send the structured JSON back to the frontend to render the matrix.

### 3. Provider Adapter Layer (`src/lib/competitors/`)

Each supported competitor should have its own adapter:

- `src/lib/competitors/types.ts`: Shared canonical schema and extraction result types.
- `src/lib/competitors/providers/indiahikes.ts`: Indiahikes-specific selectors and parsing rules.
- `src/lib/competitors/providers/trekTheHimalayas.ts`: Trek The Himalayas-specific selectors and parsing rules.
- `src/lib/competitors/providers/bikatAdventures.ts`: Bikat Adventures-specific selectors and parsing rules.
- `src/lib/competitors/index.ts`: Provider detection, allowlist, and adapter registry.

Adapters should return partial results when some fields are unavailable instead of failing the whole comparison.

### 4. Canonical Data Schema

Normalize every competitor package into a shared shape:

- `providerName`
- `sourceUrl`
- `packageName`
- `price`
- `priceCurrency`
- `priceNotes`
- `durationDays`
- `batchSize`
- `inclusions`
- `exclusions`
- `safetyGear`
- `pickupPoint`
- `difficulty`
- `extractedAt`
- `fieldConfidence`

Raw values should be preserved where useful so users can understand differences like taxes, transport, equipment rental, or optional add-ons.

### 5. Testing Strategy

- Save representative HTML fixtures for each approved competitor.
- Add unit tests for every provider adapter.
- Add API tests for unsupported domains, malformed URLs, redirects, timeouts, oversized responses, and failed extraction.
- Add UI tests for successful comparison, partial extraction, unsupported URL, and retry/remove flows.
- Add regression tests whenever a competitor page structure changes.

### 6. Dependencies Required
- `puppeteer-core`: A lightweight version of Puppeteer that connects to an external browser (like Browserless) without downloading Chromium, keeping your Next.js bundle small.
- `cheerio` (Optional): If we prefer parsing HTML over running `page.evaluate()`.

### 7. Local Development Requirements
- **Docker:** You will need Docker running locally to spin up the open-source Browserless container (`docker run -p 3000:3000 browserless/chrome`). In production, this can be hosted on a cheap VPS or the official Browserless cloud.

## Next Steps
1. Choose 1-2 competitors to support for version 1.
2. Review their public terms, robots policy, and representative package pages.
3. Approve or reject each competitor for automated extraction.
4. Define the exact comparison fields for version 1.
5. Install `cheerio` only after at least one competitor is approved.
6. Build the provider adapter, API route, fixture tests, and comparison UI.
