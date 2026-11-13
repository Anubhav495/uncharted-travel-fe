# Individual-provider retries and result caching

## Behavior

Each failed provider has its own Retry button. Retrying requests only that provider
and retains successful packages, open itinerary controls and other failures. A
successful retry removes its failure; a failed retry updates its reason and allows
another attempt. Uncertain routes still require explicit confirmation. Results
keep catalog order, even if retries finish in a different order.

Duplicate clicks are blocked while that retry is pending. Changing the trek,
changing providers, starting another comparison or leaving the page aborts pending
requests and prevents late results from entering the new comparison. The existing
overall comparison loading state remains; no per-provider progress display was added.

Provider columns show the original extraction time as “Last checked” in IST. Cache
hits preserve that timestamp; they never appear newly checked.

## Cache policy

`src/lib/competitors/cache.ts` is used only by the extraction API. Request/catalog
validation happens before cache access. Keys include the cache schema version,
provider ID, selected trek and curated URL. No browser, page HTML or personal data
is retained. No new dependencies, environment variables or migrations are needed.

Only validated, matched packages with an extracted price are retained. Failed
requests, malformed results, manual prices, uncertain identities, unavailable or
ambiguous fields and partial sections are not cached. Genuine “not found on source”
fields remain eligible. Uncached partial results are still returned normally.

The cache stores UTF-8 JSON Buffers rather than parsed object graphs:

| Limit | Value |
| --- | --- |
| Lifetime from insertion | 1 hour; hits do not extend it |
| Retained payloads per Node process | 2 MiB maximum |
| Entries per process | 32 maximum |
| Single entry | 256 KiB maximum; larger results are returned without caching |
| Eviction | Expired entries first, then least recently used |

Concurrent requests for the same key share one extraction in that process. Its
in-flight entry is removed on success or failure, so failures can be retried.
Responses use `Cache-Control: no-store` to avoid an additional uncontrolled HTTP
cache. `X-Package-Cache` exposes `hit`, `miss` or `coalesced` for diagnostics.

## Memory estimate and Vercel constraints

Measured on 2026-11-09 using saved, live-extracted TTH results including evidence:

| Result | Serialized payload |
| --- | --- |
| Hampta Pass | 52,476 bytes (51.2 KiB) |
| Kedarkantha | 50,312 bytes (49.1 KiB); its uncertain route makes it ineligible |
| Ten packages at Hampta's size | 524,760 bytes (0.50 MiB) |

The current catalog has ten provider/trek combinations. The ten-package figure is
an estimate using one representative eligible result, not ten verified extractions.
A local cache test with ten such entries measured exactly 524,760 additional bytes
of live ArrayBuffer backing storage after garbage collection. Heap deltas were
noisy and are not a production sizing guarantee.

The 2 MiB cap bounds retained serialized payloads, not total process RSS. Map keys,
Buffer objects and up to 32 entry records add overhead; JSON encoding/decoding,
request objects, garbage awaiting collection and active extractions add transient
memory. Chromium and the Next.js runtime are separate from this cache budget.

[Vercel's function memory documentation](https://vercel.com/docs/functions/configuring-functions/memory)
lists 2 GB as the standard current memory setting, with a 4 GB performance option
on Pro/Enterprise. A full 2 MiB payload cache is about 0.1% of 2 GiB. This supports
the cache's small incremental footprint; it does not establish the whole extraction
service's capacity under concurrent browser launches.

The repository has no `vercel.json` memory override or linked `.vercel` project
configuration. The deployed project's plan, Fluid Compute setting, allocated
memory and peak usage were not available locally. Verify the deployed function in
Vercel's deployment Resources/Observability before claiming measured headroom.

This is best-effort, process-local caching. [Fluid Compute](https://vercel.com/docs/fluid-compute)
can reuse one instance across concurrent invocations, but instances have separate
memory and new/recycled instances start without these cached results. The effective
lifetime can therefore be shorter than 1 hour. Ten active processes can each
retain up to 2 MiB; they do not share a single global cache. A durable shared store
would be a separate improvement if cache hit rates or traffic justify it.

## Verification

Unit/API/UI coverage includes expiry, eviction by bytes and entry count, oversized
entries, independent returned objects, request validation before hits, timestamp
preservation, same-key request coalescing, failures remaining retryable, partial
result exclusion, simultaneous retries, stale-response protection and retained
itinerary expansion state.

All 308 tests pass; lint and production build/type checks pass with the three
existing unrelated warnings. A local production API check against live TTH Hampta
Pass returned a 52,476-byte result in 1,889 ms, then a cache hit in 5 ms with the
same extraction timestamp. These are single local observations, not Vercel latency
guarantees. Desktop and 390px browser checks verified isolated retry calls,
preserved successful results and no page overflow or runtime errors; provider
responses in that UI check were mocked, including the recovered Indiahikes result.
