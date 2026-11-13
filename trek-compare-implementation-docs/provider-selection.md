# Provider selection and support requests

The comparison now accepts a selected trek and supported provider IDs. Users no
longer enter package URLs. `src/lib/competitors/catalog.ts` supplies the same
availability information to the picker and the API.

`POST /api/extractPackage` accepts exactly `{ providerId, trekSlug }`. The server
resolves the curated HTTPS package URL and retains the existing request-domain,
package-identity and field-validation checks. Requests containing a client-supplied
URL are rejected. Missing trek/provider combinations return `package_not_available`;
the UI disables them instead of guessing paths. Changing selections invalidates
old comparisons, and one provider's failure does not discard other results.

## Current catalog

- Trek The Himalayas: Sar Pass, Kareri Lake, Kedarkantha, Har Ki Dun, Rupin Pass,
  and Hampta Pass.
- Indiahikes: Kedarkantha, Har Ki Dun, Rupin Pass, and Hampta Pass.

Paths were reviewed on 2026-11-09 using public provider pages and TTH's trek
navigation. Indiahikes' [documented Himachal trek list](https://indiahikes.com/list-of-best-treks-in-himachal-pradesh)
distinguishes its DIY documentation from operated packages; those guides are not
automatically treated as package offers. Catalog presence does not guarantee that
dates are available or that automated extraction succeeds. Indiahikes browser
verification can still prevent extraction.

To add a provider, implement its adapter and add a catalog entry with manually
checked package paths. To extend an existing provider, add explicit mappings for
the new treks. Do not generate provider URLs from local slugs.

## Provider requests

The “Request provider support” disclosure sits directly below the provider choices,
above the comparison button. Its separate form follows the existing signed-in
write-API convention. It accepts a provider name and optional notes; no package
link is required. The selected trek is captured as context. Guests can sign in and
return to the request disclosure with their selected trek and provider choices
preserved. [Shareable comparison links](./shareable-comparisons.md) also restore
the selection on refresh and automatically load packages when opened.

`POST /api/requestProvider` derives the user from the authenticated session,
validates input, and stores a pending row in `public.provider_support_requests`.
Current providers are rejected with an explanation. A normalized provider key and
unique `(user_id, provider_key)` constraint prevent duplicate requests by the same
user, including concurrent submissions. Multiple users can request the same provider.
The status supports manual review in Supabase; submitting a request does not
activate an adapter or send messages/notifications.

Database errors return a failure and leave the form available to retry. The UI
confirms saving only after a successful API response or a known duplicate.

## Deployment

Provider-request storage was confirmed activated by the project owner. The table
definition is in `supabase/migrations/20261109_create_provider_support_requests.sql`
and the canonical clean-install definition is also in `supabase/schema.sql`.
New environments still need this migration before enabling request submissions.

The new table enables RLS, denies direct browser-role access, and uses the existing
server service-role client through the authenticated API. No new environment
variables are required; the existing NextAuth and Supabase configuration must work.
If the migration or credentials are missing, saving fails honestly with HTTP 503.

API and component tests cover persistence responses using mocked database writes.
Browser previews must not create synthetic support requests in the live database.

Verification: 286 tests pass, along with lint/type checks and the production build.
The production comparison API resolved TTH Hampta Pass from the provider ID and
trek alone, rejected URL overrides, and returned 404 for an unmapped pair. Desktop
and mobile browser previews confirmed the picker and a mocked request save without
runtime errors, nested forms or page overflow. Request storage activation is
owner-reported; these local checks did not insert requests into the live database.
