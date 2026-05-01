/**
 * Simple in-memory cache with TTL (Time-To-Live).
 * Used to avoid redundant DB lookups for data that rarely changes
 * (e.g. provider/guide names).
 */

interface CacheEntry<T> {
    value: T;
    expiresAt: number;
}

class TTLCache<T> {
    private cache = new Map<string, CacheEntry<T>>();
    private defaultTTL: number;

    /**
     * @param defaultTTLMs - Default time-to-live in milliseconds (default: 5 minutes)
     */
    constructor(defaultTTLMs: number = 5 * 60 * 1000) {
        this.defaultTTL = defaultTTLMs;
    }

    get(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.value;
    }

    set(key: string, value: T, ttlMs?: number): void {
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + (ttlMs ?? this.defaultTTL),
        });
    }

    has(key: string): boolean {
        return this.get(key) !== null;
    }

    clear(): void {
        this.cache.clear();
    }

    get size(): number {
        return this.cache.size;
    }
}

/** Cache for provider (guide/company) names — 24 hour TTL */
export const providerNameCache = new TTLCache<string>(24 * 60 * 60 * 1000);

export default TTLCache;
