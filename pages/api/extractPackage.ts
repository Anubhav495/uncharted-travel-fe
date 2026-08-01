import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer, { Browser, Page } from 'puppeteer';
import { getAdapterForUrl, hostnameMatchesDomain } from '@/lib/competitors';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const parsedUrl = parseHttpsUrl(req.body?.url);
    if (!parsedUrl) {
        return res.status(400).json({ error: 'A valid HTTPS URL is required' });
    }

    const adapter = getAdapterForUrl(parsedUrl.toString());
    if (!adapter) {
        return res.status(400).json({ 
            error: 'Unsupported provider', 
            details: 'This competitor is not currently supported for automated extraction.' 
        });
    }

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
            return res.status(502).json({ error: 'Provider page could not be loaded' });
        }

        if (!finalParsedUrl || !hostnameMatchesDomain(finalParsedUrl.hostname.toLowerCase(), adapter.domain)) {
            return res.status(400).json({ error: 'Provider redirected to an unsupported domain' });
        }

        const data = await adapter.extract(page, finalUrl);

        return res.status(200).json(data);
    } catch (error) {
        console.error(`Error extracting from ${parsedUrl.toString()}:`, error);
        return res.status(500).json({ error: 'Failed to extract data from the provided URL' });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
