# Shareable comparison links

The comparison URL stores the selected trek and supported provider IDs, for example:

`/compare?trek=hampta-pass&providers=trek-the-himalayas%2Cindiahikes`

Opening a link or refreshing restores the selection and automatically requests the
packages through the existing API and one-hour success cache. Provider failures
retain their individual retry controls. Original “Last checked” timestamps remain
visible, and uncertain routes still require the recipient's confirmation.

Picker changes update the address bar through Next.js shallow replacement, keeping
scroll position and avoiding a history entry for each checkbox. These local changes
wait for Compare packages before loading. Same-page link navigation and browser
history navigation restore and load the URL's selection; previous requests are
aborted and their late responses ignored. Trek-only links restore the trek without
starting extraction.

The Copy comparison link button sits beside the comparison heading. It copies an
absolute link using the current site origin and confirms only successful clipboard
writes. If the clipboard API is unavailable or rejects access, a read-only input
offers the full link for manual copying. Sharing is disabled until a provider is
selected. Feedback from an earlier selection is hidden when selections change.

`comparisonLink.ts` validates trek slugs against local trek data, removes unknown
and unavailable providers, deduplicates IDs and emits catalog order. Missing or
invalid treks restore the default trek with no providers; IDs are never applied to
an unintended fallback trek. Unrelated query parameters and hashes are excluded
from copied links. Saved package facts, prices and route-confirmation decisions
are not encoded in the URL.

Provider-request sign-in links preserve both the trek and provider choices and
return to the request disclosure. No new API, storage, dependencies, environment
variables or database migrations are required.

## Local development

Links use the current site's origin. A `localhost:3000` link requires the local
server on that computer; public sharing requires the deployed site's domain.
Development output uses `.next-dev`, while production builds/serving use `.next`,
so running a production build cannot overwrite the active development bundles.
Restart an older dev server after this configuration change.

The 2026-11-10 local HTTP 500 regression was resolved by separating those output
folders and restarting the long-running dev server. All 330 tests pass, including
the build-directory isolation regression; lint and production build/type checks
also pass. With that dev server still running after the production build, the
reported Sar Pass/TTH URL returned HTTP 200, restored both selections and rendered
a real, matched Sar Pass extraction (API HTTP 200) without browser runtime errors.

Verification covers shared-link restoration, refresh, URL synchronization without
automatic picker requests, invalid/unavailable providers, route confirmation,
router readiness, stale requests on navigation, clipboard success/fallbacks and
preserving selections through sign-in. All 329 tests pass; lint and the production
build/type checks pass with three existing unrelated warnings. A production browser
preview verified copying, automatic recipient loading, refresh, same-page and back
navigation, manual-copy fallback and filtering unsupported providers. The 390px
layout has no page overflow, and there were no browser runtime errors. Provider
responses in these browser checks were mocked; no live Indiahikes validation or
provider-request database writes were performed.
