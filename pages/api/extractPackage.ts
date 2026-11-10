import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer, { Browser, Page } from 'puppeteer';
import { getAdapterForUrl, hostnameMatchesDomain } from '@/lib/competitors';
import { checkPackageIdentity, isSupportedTrekSlug, PackageExtractionError } from '@/lib/competitors/identity';
import { parsePackageResult } from '@/lib/competitors/validation';
import { reportFieldFailures } from '@/lib/competitors/extract';
import { getProviderPackageUrl, getSupportedProvider } from '@/lib/competitors/catalog';
import { packageResultCache } from '@/lib/competitors/cache';
import type { ProviderAdapter } from '@/lib/competitors/types';

function parseHttpsUrl(value: unknown): URL | null {
    if (typeof value !== 'string') return null;

    try {
        const parsedUrl = new URL(value);
        return parsedUrl.protocol === 'https:' ? parsedUrl : null;
    } catch {
        return null;
    }
}

async function restrictPageRequests(page: Page, allowedDomain: string) {
    await page.setRequestInterception(true);

    page.on('request', (request) => {
        const resourceType = request.resourceType();

        if (['image', 'media', 'font', 'stylesheet'].includes(resourceType)) {
            request.abort();
            return;
        }

        try {
            const requestUrl = new URL(request.url());
            if (
                requestUrl.protocol !== 'https:' ||
                !hostnameMatchesDomain(requestUrl.hostname.toLowerCase(), allowedDomain)
            ) {
                request.abort();
                return;
            }
        } catch {
            request.abort();
            return;
        }

        request.continue();
    });
}

async function loadProviderPackage(adapter: ProviderAdapter, parsedUrl: URL, expectedTrekSlug: string) {
    let browser: Browser | null = null;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await restrictPageRequests(page, adapter.domain);
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

        const response = await page.goto(parsedUrl.toString(), { waitUntil: 'domcontentloaded', timeout: 20000 });
        const finalUrl = page.url();
        const finalParsedUrl = parseHttpsUrl(finalUrl);

        if (!response || !response.ok()) {
            throw new PackageExtractionError('provider_load_failed', 'Provider page could not be loaded', 502);
        }

        if (!finalParsedUrl || !hostnameMatchesDomain(finalParsedUrl.hostname.toLowerCase(), adapter.domain)) {
            throw new PackageExtractionError('unsupported_redirect', 'Provider redirected to an unsupported domain', 400);
        }

        const data = parsePackageResult(await adapter.extract(page, finalUrl));
        data.identity = checkPackageIdentity(data, expectedTrekSlug);
        reportFieldFailures(data);

        return data;
    } finally {
        if (browser) {
            await browser.close().catch(() => {});
        }
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)
        || Object.keys(req.body).some((key) => key !== 'providerId' && key !== 'trekSlug')) {
        return res.status(400).json({ error: 'Choose a supported provider and trek.' });
    }
    const provider = getSupportedProvider(req.body.providerId);
    if (!provider) {
        return res.status(400).json({ error: 'Choose a supported provider.' });
    }
    const expectedTrekSlug = req.body.trekSlug;
    if (typeof expectedTrekSlug !== 'string' || !isSupportedTrekSlug(expectedTrekSlug)) {
        return res.status(400).json({ error: 'Select an Uncharted trek before comparing packages.' });
    }
    const packageUrl = getProviderPackageUrl(provider.id, expectedTrekSlug);
    if (!packageUrl) return res.status(404).json({ error: 'Comparison is not available for this provider and trek yet.', code: 'package_not_available' });
    const parsedUrl = parseHttpsUrl(packageUrl)!;
    const adapter = getAdapterForUrl(packageUrl);
    if (!adapter) return res.status(400).json({ error: 'This provider is not available for comparison.' });

    try {
        // Include the curated URL and schema version so catalog/parser changes
        // cannot reuse a result for a different package in the same process.
        const key = JSON.stringify(['v1', provider.id, expectedTrekSlug, packageUrl]);
        const { data, cacheStatus } = await packageResultCache.getOrLoad(key, () => loadProviderPackage(adapter, parsedUrl, expectedTrekSlug));
        res.setHeader('X-Package-Cache', cacheStatus);
        return res.status(200).json(data);
    } catch (error) {
        if (error instanceof PackageExtractionError) return res.status(error.status).json({ error: error.message, code: error.code });
        if (error instanceof Error && error.name === 'TimeoutError') return res.status(504).json({ error: 'The provider page timed out. Please retry.', code: 'provider_timeout' });
        console.error('Package extraction failed', { provider: adapter.name, sourceUrl: `${parsedUrl.origin}${parsedUrl.pathname}` });
        return res.status(500).json({ error: 'Failed to extract data from the provided URL' });
    }
}
