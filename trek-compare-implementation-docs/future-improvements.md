# Trek comparison: future improvements

## Current behavior

The comparison shows one Uncharted trek alongside selected supported providers.
Users choose providers instead of entering URLs; a curated catalog resolves package
links for the selected trek. An authenticated form lets users request another
provider. See [provider-selection.md](./provider-selection.md) for availability,
API changes and the database migration required for request storage.
The lowest-price, itinerary-visibility, and booking-advice summary cards have been
removed, together with their supporting calculations. Prices and itineraries remain
in the table, and the existing note below the table remains visible.

Both the Indiahikes and Trek The Himalayas (TTH) adapters use one shared price
fallback and validation utility (`src/lib/competitors/price.ts`). The fallback reads:

> Unable to fetch the price, please confirm manually

It triggers whenever pricing is missing, ambiguous, malformed, zero or negative.
The result is marked `manual` and includes a common extraction warning. Positive
prices preserve their display text, including decimals and GST notes. A shared
DOM extractor (`src/lib/competitors/packagePrice.ts`) reads labelled price blocks,
excludes separately labelled charges and old/related prices, and requires current
batch and desktop/mobile values to agree. Pricing gets a bounded 6-second wait,
including time for zero placeholders to hydrate. There is no page-wide money fallback.

Both adapters and local Uncharted comparison data share numeric normalization.
`priceDetails` contains raw text, a nullable base amount/currency, a separate GST
percentage and the `listed_per_person_base` basis. Taxes and optional charges are
never added to this base amount. Unknown values never become zero. Ranking remains
absent from the UI. Core field reliability in section 3 is now implemented;
remaining observability and production operations are described in sections 2 and 4.

Indiahikes pricing also preserves a scoped card's route, GST rate, insurance and
transport lines in `priceDetails`. The comparison displays those as separate lines
below the base fee, without calculating a payable total or inferring optional vs
mandatory transport. Missing amounts remain unavailable; conflicting breakdowns
show a confirmation note. The Har Ki Dun example has synthetic DOM regression
coverage based on supplied and publicly visible text; live HTML access is still blocked.

## 1. Reliable package prices

Status: extraction and normalization implemented; live Indiahikes validation remains
pending. Two rendered TTH price fixtures and an Indiahikes browser-challenge fixture
were captured on 2026-11-09. TTH Kedarkantha's price blocks agree; Hampta's zero
placeholder and conflicting mobile amount correctly require manual confirmation.
The actual DOM functions pass both Jest fixture tests and local Chromium checks,
including delayed replacement of a zero price. A later live smoke check under the
API's request policy successfully resolved both TTH pages after hydration;
Hampta's earlier zero/conflicting snapshot remains a fallback regression fixture.
Indiahikes labelled-price cases
remain synthetic because public pages blocked Chromium during capture. See
`src/lib/competitors/providers/__fixtures__/README.md` for source URLs and verified
expectations. Obtain successful Indiahikes DOM captures before claiming this point
fully validated against both live providers.

- Identify the current package's labelled pricing section in each provider adapter.
  Exclude deposits, instalments, equipment charges, related treks, and crossed-out
  prices. Wait for pricing content within a bounded timeout.
- When multiple batch prices cannot be resolved confidently, return an unavailable
  amount rather than guessing, using the existing shared manual-confirmation fallback.
- Share numeric normalization between provider adapters and local Uncharted data.
  Preserve decimals and separate tax percentages, transport, and optional add-ons
  from the listed per-person base price. Keep raw display text and structured
  amount/currency information; never turn unknown text or placeholders into zero.
- Keep ranking out of the current UI. Any future price summary must distinguish
  listed base prices from final payable totals and exclude unavailable amounts.

### How to establish parsing correctness

- Inspect 2–3 representative public trek pages per provider and save HTML fixtures
  with source URL, capture date, and manually verified expected package prices.
- Test the actual adapter DOM extraction against these fixtures, not just mocked
  API responses. Scope selectors to the package being compared.
- Cover deposits before full prices, discounts and old prices, GST, decimals,
  unrelated trek cards, multiple batches, missing prices, and zero placeholders.
- Test shared normalization separately, including `₹8,000 + 5% GST` and `₹8,000.50`.
- Reject ambiguous extraction. Fixture tests protect known page structures;
  occasional live smoke checks are also needed to detect provider layout changes.
  Keep network-dependent checks separate from deterministic regression tests.

## 2. Logging and alerts for fallbacks and parsing failures

Partially implemented: the API emits structured field-status events with provider,
sanitized source URL, field, reason and timestamp. Request correlation, aggregated
rates, alert delivery and cooldowns remain future work.

- Emit structured server-side events when a fallback is triggered, a field cannot
  be parsed, an extraction is ambiguous, or a provider page cannot be loaded.
  Successful HTTP responses containing fallback data must also produce events.
- Include provider, sanitized source URL, field, parsing stage, failure reason,
  timestamp, and a request correlation ID. Strip credentials and query strings;
  do not log complete page HTML, secrets, or visitor personal information.
- Track fallback/failure rates by provider and distinguish missing source data
  from likely selector or parsing regressions.
- Add alerts for repeated failures or elevated fallback rates. Choose the alert
  destination and thresholds during implementation; deduplicate alerts and apply
  cooldowns so a failing provider does not cause a notification flood.
- Test that fallback and failure events fire, successful extraction stays quiet,
  and logging/notification failures do not prevent returning comparison results.

## 3. Correct and complete comparison data

Core implementation is complete. The implementation record and acceptance cases are in
[field-reliability-plan.md](./field-reliability-plan.md). It covers current parser
issues, shared field evidence and status rules, field-specific acceptance cases,
delivery order, and the remaining Indiahikes live-validation limitation. Provider
claims remain extracted claims, with field evidence and explicit ambiguity states.

- Map Uncharted's actual inclusions/exclusions instead of using highlights and
  generic advice. Show unavailable fields honestly.
- Fix provider list extraction, including confusing "not included" with "included"
  and assuming HTML lists contain literal bullet characters.
- Distinguish mentions of safety equipment from a claim that it is provided;
  handle negative statements such as "No oxygen support available."
- Validate that extraction found a package page, not a browser challenge or
  generic landing page. Check that competitors match the selected trek.
- Clear or explicitly invalidate old comparisons when the selected trek changes.
- Extract batch sizes and locations where present, and allow viewing complete
  itineraries beyond the current five-day display limit.

## 4. Failure recovery and production operation

Implemented within the field reliability work: failed-URL reasons, malformed-result
validation, API regression coverage, shared extraction deadlines, and invalidation
of stale comparisons. Individual-provider retry and a bounded in-memory success
cache are also implemented; see [retry-and-cache.md](./retry-and-cache.md).
Shared durable caching, rate limits and hosting work remain pending.

- Individual-provider retry preserves successful results, their expanded itinerary
  state and route-confirmation requirements. Selection changes cancel old retries.
  No per-provider progress indicators were added.
- Add API coverage for URL validation, redirects, timeouts, partial extraction,
  and malformed results, plus fixture tests for each provider adapter.
- The success cache expires after 1 hour and caps retained payloads at 2 MiB
  per process. Same-package requests share one extraction within a process.
  Add shared durable caching, rate limits, bounded cross-package extraction
  concurrency, and overall deadlines if production traffic requires them.
- Verify browser provisioning in production; evaluate a shared or remote browser
  instead of starting a separate local Chromium instance for every request.
- Align documented Node requirements with the installed Puppeteer version.
- Shareable selection links, refresh restoration and a clipboard/manual-copy
  control are implemented; see [shareable-comparisons.md](./shareable-comparisons.md).
  Add discovery links from relevant trek pages and saved comparisons if the feature
  is made broadly available.
