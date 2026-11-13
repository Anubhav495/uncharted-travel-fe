# Reliability plan for the remaining comparison fields

Status: core extraction, API and UI changes implemented on 2026-11-09. Applies to
Indiahikes, Trek The Himalayas (TTH), and local Uncharted data. Live Indiahikes DOM
validation remains blocked by provider verification. The sections below retain
the original requirements and acceptance cases for future provider regressions.

## Implemented changes

- `dom.ts` reads labelled overview cards, bounded DOM sections, paragraphs, lists,
  complete day sections and TTH's separately mounted cost tabs. It preserves
  qualifiers, negation, source sections and the provider-selected route.
- `fields.ts` resolves duplicate/conflicting values, per-field status, partial
  lists/itineraries, safety assertions and operational details. `normalize.ts`
  validates duration, group size and explicit measurement units without turning
  placeholders or unrelated numbers into package facts.
- Both adapters use `extract.ts`, with a shared 10-second extraction budget after
  navigation and bounded readiness/tab/price waits. The existing 20-second
  navigation timeout remains separate. Price regressions and the Indiahikes
  breakdown are preserved; different charge scopes retain both source statements.
- `localPackage.ts` maps actual local lists, itineraries, altitude, distance,
  base camp, season and arrival instructions. Guide biographies and highlights
  are not inclusion or safety promises.
- The API now requires `{ providerId, trekSlug }`, resolves a curated URL, validates results, rejects
  recognizable invalid/challenge pages and clear trek mismatches, and returns
  uncertain matches for review. Field failure events omit query strings and raw
  source content. Cleanup or logging errors do not discard valid results.
- The UI invalidates old comparisons and ignores stale responses, identifies failed
  URLs, holds uncertain names/routes for review, exposes source details, uses
  distinct unavailable/missing/conflicting/partial messages, and renders every
  extracted itinerary day, including Day 0. Itineraries now have a second disclosure
  level per day and per-package Expand all / Collapse all controls. Inclusions,
  exclusions and safety use grouped source headings, distinct icons and explicit
  condition/confirmation notes, with evidence below the content.
- Provider selection replaces editable package links. New-provider requests use a
  separate authenticated form and a pending Supabase review record. See
  [provider-selection.md](./provider-selection.md) for the catalog and required migration.
- The production API was checked against live TTH Hampta Pass and Kedarkantha
  pages. Both returned full overview/list/itinerary data; Kedarkantha's
  Juda-Ka-Talab route requires confirmation. Desktop and 390px mobile checks had
  no browser runtime errors or page-wide horizontal overflow.

Remaining validation: obtain successful Indiahikes DOM captures and live smoke
checks. Synthetic Indiahikes tests are not proof of live selector compatibility.
Cancellation sections and policy links provide source context; the app does not
calculate refunds or infer a policy schedule. Alert delivery and other production
operations remain separate roadmap work. No new environment variables or database
migrations are required.

Verification: 286 tests across 28 suites pass. `npm run lint` passes with three
pre-existing warnings; the production build and its type checks pass. Captured
TTH fixtures exercise the actual serialized DOM functions; separate live checks
exercise the production API, and browser previews cover desktop and mobile.

## Outcome

Each displayed fact should belong to the selected package, come from an identifiable
source section, preserve the provider's meaning, and have an honest fallback when
it cannot be resolved. Partial results should remain useful without appearing complete.
Keep the current absence of price rankings and provider scores.

## Original findings addressed by this change

- Indiahikes takes the first duration, altitude and difficulty match from the whole
  page; location and batch size are always missing.
- Indiahikes section matching can treat "not included" as "included". Nearby-list
  traversal can select the wrong sibling or lose nested headings and paragraphs.
- TTH flattens the document before reading overview labels and lists. Its list
  parser expects literal bullet characters, which normal HTML lists need not contain.
- TTH treats mentions of oxygen, medical support and trek leaders as safety details,
  without resolving whether those services are provided, conditional or unavailable.
- Both adapters cap itineraries at 12 entries; the UI displays only five. Indiahikes
  may collect overlapping day containers and headings; neither adapter records
  whether the itinerary is complete or combines alternate routes.
- The local comparison substitutes trek highlights for inclusions and generic advice
  for exclusions. `Trek` already has optional `inclusions` and `exclusions`, and
  Hampta Pass supplies both.
- Changing the selected Uncharted trek leaves previous competitor results visible.
  The API receives only a URL, so it cannot check the requested trek identity.
- Current source badges describe where a value came from, but do not describe why
  a value is missing or whether a list was only partially extracted.

Relevant files: `pages/compare.tsx`, `pages/api/extractPackage.ts`,
`src/lib/competitors/types.ts`, both provider adapters, `src/types/trek.ts`, and
`src/data/treks/`.

## Shared rules

1. Identify a valid package page and the current package container before extracting
   fields. Navigation, related packages, reviews, marketing snippets, browser
   challenges and generic landing pages cannot supply comparison facts.
2. Give each provider explicit section selectors and heading aliases. Shared code
   handles DOM traversal, validation, units and result metadata. Match specific
   negative headings before positive headings; preserve DOM section boundaries.
3. Read only the relevant labelled section. Do not recover missing fields with a
   page-wide first-number or keyword search. Wait for relevant sections within a
   shared extraction deadline; do not add a full timeout for every field.
4. Preserve raw wording alongside normalized values. Agreement between duplicate
   desktop/mobile sections is acceptable; conflicting values or route variants
   require an ambiguity result. Deduplicate only equivalent statements.
5. Missing numbers remain null, missing lists are not claims that nothing is
   included, and negative statements remain explicit negative statements.
6. Extracted provider claims are not independently verified facts. Do not introduce
   a "Verified" badge or a numeric confidence score.

## Field result model

Extend `ExtractedPackageData` with additive field metadata so existing values,
`fieldSources`, and `priceDetails` remain usable during migration. Derive display
values and metadata from the same validated result, rather than maintaining two
independent interpretations.

| Dimension | Proposed values or content |
| --- | --- |
| Origin | Existing `extracted`, `local`, `manual`, `not_found` source contract |
| Extraction status | `found`, `not_found`, `ambiguous`, `unavailable` |
| Completeness | `complete`, `partial`, `unknown`, where applicable |
| Evidence | Source URL, existing section anchor when present, section label, bounded raw excerpt, capture time |
| Reason | Stable reason such as `section_missing`, `conflicting_values`, `timeout`, `parse_failed`, `variant_unresolved` |

For lists, preserve evidence and qualifiers per item as well as section-level
completeness. Inclusion and safety assertions need a separate meaning such as
`included`, `excluded`, `conditional`, `mentioned`, or `unknown`; these are not
extraction errors. For example, "oxygen is not available" is a successfully
extracted negative claim.

UI wording:

- Readable page, field absent: "Not stated on source."
- Section could not be loaded or parsed: "Unable to fetch; confirm with provider."
- Conflicting values: "Details vary; confirm the applicable package or batch."
- Some entries captured: show those entries with "Partial details" and a source link.
- Explicit "none" or "not provided": preserve that statement; do not present it as missing.

## Work by field

| Field | Extraction and display rules | Required regression examples |
| --- | --- | --- |
| Package name and trek identity | Read the package heading and canonical identity. Pass the selected local trek identifier to the API and resolve provider names through explicit aliases. Keep route/season variants distinct. Reject a clear mismatch; mark an uncertain match for confirmation and keep it out of an automatically matched comparison. | Related trek heading first; generic home page; challenge page with HTTP 200; valid alias; wrong trek; winter vs summer route variant. |
| Inclusions | Read the inclusions section's lists, subheadings and paragraphs. Preserve meal coverage, sharing arrangements, permits, guide services and conditional equipment wording. A highlight alone does not establish an inclusion. | "Not included" before "included"; nested lists; paragraphs without bullets; transit meals excluded; "microspikes if required"; truncated section. |
| Exclusions and add-ons | Extract separately from inclusions. Preserve optional/mandatory wording and any stated amount/unit. Distinguish an excluded service from an available paid add-on. Reuse existing price details for insurance and transport amounts instead of parsing a competing amount. | One-way vs round-trip transport; offloading per day vs per trek; insurance requirement without a stated amount; the same item included and excluded under different conditions. |
| Safety gear and support | Require an explicit package-related claim. Preserve negation and conditions. Separate equipment, staff support and participant obligations. Show provider wording and evidence for significant claims. | "No oxygen support available"; "carry your own first aid"; "oxygen provided"; generic safety article; equipment provided only when conditions require it. |
| Duration | Read the overview duration and preserve days/nights. Store total package days separately from trekking and travel days when explicitly labelled. Do not infer days from nights, convert an itinerary count into a stated duration, or silently reconcile disagreement. | 6 days / 5 nights; 4 trekking days plus 2 travel days; a cancellation window mentioning 15 days; itinerary count disagrees with overview. |
| Location and base camp | Keep region/state, base camp, package start/end, and pickup/drop locations distinct. Populate only the concept actually labelled. | Kotgaon-to-Kotgaon package with Dehradun pickup; airport mentioned in travel advice; related trek in another state; absent base camp. |
| Difficulty | Preserve the provider's complete grade. Any normalized category must use an explicit mapping and retain the original; do not silently equate grades across providers. | "Easy to Moderate"; "Moderate to Difficult"; a testimonial saying "easy"; unsupported grade; conflicting route grades. |
| Batch size | Require an explicit group/batch minimum, maximum, range or fixed capacity, preserving what that number means. Do not use remaining seats, departure counts or staff numbers. | "Maximum 24 trekkers"; "8–15 participants"; "3 seats left"; "2 guides"; private group and fixed-departure sizes differ. |
| Itinerary | Extract each day once from the selected itinerary section, retaining ordered day labels and supplied descriptions, meals, distances and elevations. Keep alternate routes separate. Record gaps, duplicates and incomplete loading; do not invent missing day numbers. Allow every captured day to be viewed. | Duplicate responsive markup; 7-day and 14-day trips; missing Day 3; Day 0; two route variants; trek and drive distances in the same day; collapsed content that never loads. |
| Altitude and distance | Preserve raw text, units and qualifiers. Distinguish maximum altitude, camp altitude, elevation gain and daily altitude. Distinguish total trek distance, daily trek distance and drive distance. Normalize only explicit compatible units. | Feet vs metres; a range; decimal kilometres; Day 2 altitude before the maximum; 195 km drive vs 22 km trek; one-way vs total distance. |
| Other important details | Treat meals/stay, season/months, pickup/drop times, buffer days, rentals and policy links as individually sourced fields. Preserve time qualifiers and dates. A cancellation link is a link, not an extracted refund schedule; preserve policy conditions and effective dates when actually available. | Generic buffer-day advice vs requirement; optional pickup; conditional lodging; missing time zone; policy link only; conflicting policy versions; transport note disagrees with price card. |
| Local Uncharted data | Map actual inclusions/exclusions, itinerary and labelled `maxAltitude`, `basecamp`, `trekDistance` and `bestTimeToVisit` fields. Missing local facts stay unavailable. Do not derive safety promises from guide biographies or fill fields with generic booking advice. | Hampta Pass's explicit lists; a trek without lists; missing operational terms; guide description mentioning safety; departure-specific information unavailable locally. |

## Delivery order

### 1. Foundations and package validation

- Add field metadata and shared scoped DOM helpers with a single extraction deadline.
- Detect invalid/challenge pages and pass selected trek identity through the API.
- Clear/invalidate results when the selected trek or submitted URLs change. Ignore
  late responses belonging to an earlier selection; retain per-URL failure reasons.
- Establish representative full-section fixtures with manually reviewed expectations.

Done when invalid pages cannot produce apparently successful packages, identity
mismatches are visible, old comparisons cannot be attached to a new selection, and
field statuses have API/UI regression coverage. Support URLs entered for an
uncertain route variant with a clear confirmation state rather than guessing.

### 2. Inclusions, exclusions and safety

- Replace both list parsers with provider-scoped section extraction and evidence.
- Preserve conditions, negation and the distinction between included and paid.
- Use Uncharted's actual lists wherever available; remove invented inclusion claims.
- Add list completeness and per-item source context to the UI.

Done when no negative statement becomes a positive benefit, inclusions/exclusions
cannot bleed into each other, and local missing data has an honest fallback.

### 3. Overview facts and batch size

- Implement duration, region/base camp, difficulty, altitude, distance and batch
  size using labelled overview sections and shared unit validation.
- Preserve provider grades and separate package facts from travel/itinerary metrics.
- Keep variant-specific conflicts unavailable until a variant is resolved.

Done when the overview fixture matrix passes and unrelated numbers cannot populate
these fields. Provider aliases and normalized grade mappings must be explicit.

### 4. Complete itineraries

- Select one route variant and extract ordered day sections with per-day evidence.
- Remove silent 12-entry extraction and five-day viewing limits. If an operational
  size limit is necessary, expose truncation as partial, with a source link.
- Show missing day labels or unresolved variants without inventing continuity.

Done when all captured days are viewable, duplicate markup produces no duplicate
days, and incomplete itineraries are never labelled complete.

### 5. Logistics, policy details and consistency

- Add individually sourced operational details and integrate existing price extras.
- Cross-check repeated claims across price cards, overview, inclusions and exclusions.
  Surface contradictions with their conditions; do not silently choose one source.
- Add lightweight structured field-failure events using the roadmap's logging
  design. Alert delivery, caching, rate limits and browser hosting remain separate
  operational work under roadmap sections 2 and 4.

Done when displayed policy/logistics facts have source context and conflicting
financial or operational claims require confirmation.

## Validation and rollout

For each provider and field group, capture 2–3 representative package pages with
the actual relevant DOM, source URL, capture date, expected values and evidence
reviewed manually. Price-only subtrees are insufficient for the remaining fields.
Keep synthetic edge-case fixtures clearly separate from captured provider HTML.

Indiahikes browser verification currently blocks successful DOM capture. We can
develop against clearly labelled synthetic cases and any previously captured HTML,
but live compatibility stays unverified until real sections can be inspected. Do
not replace blocked extraction with hardcoded package facts or a claim of "not stated."

For each delivery slice:

1. Run actual serialized adapter DOM functions against captured and synthetic fixtures.
2. Add meaningful normalizer, API and UI tests for that slice's failure modes,
   including partial success, malformed results and late-response invalidation.
3. Preserve the existing price/breakdown regressions. Verify missing, zero, optional
   and conflicting values retain their existing semantics.
4. Run affected tests, the full Jest suite, lint, type checking and a production build.
5. Run separate live smoke checks under the API's actual resource restrictions and
   deadlines. Record blocked checks as blocked, not successful validation.

Implement and review one slice at a time. The recommended first implementation is
the foundations slice, followed immediately by inclusions/exclusions and safety.
This establishes the evidence and fallback rules needed by every later field.
