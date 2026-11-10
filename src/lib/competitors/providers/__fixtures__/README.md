# Price extraction fixtures

The captured fixtures below were saved with local Puppeteer/Chromium on 2026-11-09. These are DOM subtrees,
not complete provider pages. Scripts, images and SVGs were removed; price markup,
labels, classes and desktop/mobile values are preserved. Tests invoke the actual
adapter DOM functions against them, with network and wait durations mocked.

| File | Source | Manually checked expectation |
| --- | --- | --- |
| `tth-kedarkantha.html` | https://trekthehimalayas.com/kedarkantha-trek | Fixed Departures ₹11,250 +5% GST/person; mobile ₹11250 +5% GST per person. Base amount 11250 INR, tax 5%. |
| `tth-hampta.html` | https://trekthehimalayas.com/hampta-pass-trek | Fixed Departures ₹0 +5% GST/person; mobile ₹12850 +5% GST. Conflicting/placeholder prices: unavailable. |
| `ih-challenge.html` | https://indiahikes.com/kedarkantha-trek | Browser verification challenge: adapter rejects with `provider_challenge`; no successful package returned. |
| `tth-kedarkantha-trek-fields.html` | https://trekthehimalayas.com/kedarkantha-trek | 6 days; Uttarakhand; Easy to Moderate; 12,500 ft maximum; 22 km trekking; 6 itinerary days; active inclusions. Juda-Ka-Talab is the provider-selected route among two variants. Inactive exclusions require loading. |
| `tth-hampta-pass-trek-fields.html` | https://trekthehimalayas.com/hampta-pass-trek | 5 days; Himachal Pradesh; Moderate; 14,100 ft maximum; 24 km trekking; 5 itinerary days; active inclusions. Inline mentions of day 4/day 5 are not additional day headings. |
| `tth-kedarkantha-trek-exclusions.html` | https://trekthehimalayas.com/kedarkantha-trek | Captured after activating the Exclusion tab. Exclusions include transport and paid add-ons; the unmounted Inclusion panel must not be fabricated. |
| `tth-hampta-pass-trek-exclusions.html` | https://trekthehimalayas.com/hampta-pass-trek | Captured after activating the Exclusion tab; used separately from the initial inclusion snapshot. |

The field fixtures contain the actual overview, itinerary and cost-section markup
captured on 2026-11-09, with nonessential media removed. Overview sections from the
earlier same-day captures supplement the compact cards, so neighbouring table
cells and duplicated responsive values are covered. The live production API smoke
check separately exercised tab switching and serialization after Next.js bundling.

`ih-har-ki-dun-synthetic.html` is **synthetic markup**, built from the user's
supplied breakdown and the public text view of https://indiahikes.com/har-ki-dun#gref:
₹13,450, Kotgaon to Kotgaon, +5% GST, +₹210 Trek Insurance, and +₹2,600 for
transport to and from basecamp. It includes an unrelated one-way transport amount
and related trek to verify that those do not leak into the price card. Chromium
still received a verification challenge for this URL. This fixture validates the
breakdown logic, not compatibility with the live page's HTML structure.

Indiahikes also blocked https://indiahikes.com/hampta-pass and
https://indiahikes.com/dayara-bugyal during inspection. The web text view of
Kedarkantha exposed a **Trek Fee** label, with transport and insurance separately
listed, but its rendered pricing HTML could not be captured. Labelled Indiahikes
price tests in `packagePrice.test.ts` are synthetic regression cases, **not** proof
of the live provider's DOM compatibility. Capture 2–3 verified successful HTML
fixtures when access is available before claiming full Indiahikes support.

After implementation, a live smoke check using the API's request interception and
user agent successfully resolved both TTH packages. Hampta's departures panel had
hydrated to ₹12,850 +5% GST, agreeing with mobile. The earlier zero-price snapshot
is intentionally retained to cover the unavailable state; it is not a claim that
the live page always remains at zero.

For a live smoke check, open the provider with Puppeteer using the same request
policy as `pages/api/extractPackage.ts`, call its adapter, and inspect `price`,
`priceDetails`, and `fieldSources.price`. Do not promote a fallback to a successful
price or update fixture expectations automatically. Network checks are separate
from deterministic Jest tests because prices, availability and markup can change.
