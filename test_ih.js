const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    
    console.log("Navigating to Indiahikes...");
    await page.goto('https://indiahikes.com/hampta-pass', { waitUntil: 'networkidle2', timeout: 60000 });
    
    console.log("Extracting data...");
    const data = await page.evaluate(() => {
        return {
            title: document.querySelector('h1')?.innerText,
            allText: document.body.innerText.substring(0, 5000), // grab first 5000 chars to see what's there
            htmlSnippets: {
                // Let's try to find sections containing 'inclusion' or 'exclusion'
                sections: Array.from(document.querySelectorAll('section, div')).filter(el => {
                    const t = el.textContent?.toLowerCase() || '';
                    return t.includes('inclusion') || t.includes('exclusion') || t.includes('what is included');
                }).map(el => el.innerText).slice(0, 3)
            }
        };
    });
    
    fs.writeFileSync('ih_dump.json', JSON.stringify(data, null, 2));
    console.log("Done! Wrote to ih_dump.json");
    await browser.close();
})();
