import { Buffer } from 'node:buffer';
import type { ExtractedPackageData } from './types';

export const PACKAGE_CACHE_LIMITS = {
    ttlMs: 60 * 60 * 1000,
    maxEntries: 32,
    maxBytes: 2 * 1024 * 1024,
    maxEntryBytes: 256 * 1024,
};

interface CacheEntry {
    payload: Buffer;
    expiresAt: number;
}

function canCache(data: ExtractedPackageData): boolean {
    const metadata = [...Object.values(data.fieldMetadata || {}), ...data.importantDetails.flatMap((detail) => detail.metadata ? [detail.metadata] : [])];
    return data.identity?.status === 'matched' && data.fieldSources.price === 'extracted'
        && !metadata.some((field) => field.status === 'unavailable' || field.status === 'ambiguous' || field.completeness === 'partial');
}

// A best-effort cache local to this Node process. Buffers bound retained payload
// bytes without retaining a second parsed object graph or any browser/page HTML.
export class PackageResultCache {
    private entries = new Map<string, CacheEntry>();
    private inFlight = new Map<string, Promise<ExtractedPackageData>>();
    private payloadBytes = 0;
    private limits: typeof PACKAGE_CACHE_LIMITS;

    constructor(limits: Partial<typeof PACKAGE_CACHE_LIMITS> = {}) {
        this.limits = { ...PACKAGE_CACHE_LIMITS, ...limits };
    }

    private remove(key: string) {
        const entry = this.entries.get(key);
        if (entry) this.payloadBytes -= entry.payload.byteLength;
        this.entries.delete(key);
    }

    private pruneExpired() {
        const now = Date.now();
        for (const [key, entry] of this.entries) if (entry.expiresAt <= now) this.remove(key);
    }

    private store(key: string, data: ExtractedPackageData) {
        if (!canCache(data)) return;
        const payload = Buffer.from(JSON.stringify(data), 'utf8');
        if (payload.byteLength > this.limits.maxEntryBytes || payload.byteLength > this.limits.maxBytes) return;
        this.pruneExpired();
        this.remove(key);
        while (this.entries.size && (this.entries.size >= this.limits.maxEntries || this.payloadBytes + payload.byteLength > this.limits.maxBytes)) {
            this.remove(this.entries.keys().next().value!);
        }
        this.entries.set(key, { payload, expiresAt: Date.now() + this.limits.ttlMs });
        this.payloadBytes += payload.byteLength;
    }

    async getOrLoad(key: string, load: () => Promise<ExtractedPackageData>): Promise<{ data: ExtractedPackageData; cacheStatus: 'hit' | 'miss' | 'coalesced' }> {
        this.pruneExpired();
        const entry = this.entries.get(key);
        if (entry) {
            this.entries.delete(key);
            this.entries.set(key, entry);
            return { data: JSON.parse(entry.payload.toString('utf8')), cacheStatus: 'hit' };
        }
        const existing = this.inFlight.get(key);
        if (existing) return { data: await existing, cacheStatus: 'coalesced' };

        const pending = load().then((data) => { this.store(key, data); return data; });
        this.inFlight.set(key, pending);
        try {
            return { data: await pending, cacheStatus: 'miss' };
        } finally {
            this.inFlight.delete(key);
        }
    }

    getStats() {
        this.pruneExpired();
        return { entries: this.entries.size, payloadBytes: this.payloadBytes, inFlight: this.inFlight.size };
    }

    clear() {
        this.entries.clear();
        this.payloadBytes = 0;
    }
}

export const packageResultCache = new PackageResultCache();
