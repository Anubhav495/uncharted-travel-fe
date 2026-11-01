/** @type {import('next-sitemap').IConfig} */

const TREK_SLUGS = [
  'sar-pass-trek',
  'hampta-pass',
  'kedarkantha-trek',
  'har-ki-dun-trek',
  'rupin-pass-trek',
  'buni-buni-pass',
  'dev-roopa-trek',
  'kareri-lake-trek',
  'kheerganga-trek',
  'baraadsar-lake-trek',
];

const GUIDE_IDS = [
  'guide-pritam-negi',
  'guide-kapil-rawat',
  'guide-kailash-rawat',
  'guide-bhojraj',
  'guide-aatish',
];

const ARTICLE_SLUGS = [
  'sar-pass-trek-cost-itinerary',
  'hampta-pass-vs-sar-pass',
  'kedarkantha-winter-trek-guide',
  'rupin-pass-difficulty-beginners',
  'kheerganga-trek-guide',
  'kareri-lake-trek-guide',
  'har-ki-dun-trek-guide',
  'dev-roopa-trek-guide',
  'buni-buni-pass-trek-guide',
  'baraadsar-lake-trek-guide',
  'best-time-himalayan-treks',
  'himalayan-trek-local-guide-vs-company',
  'sar-pass-vs-kheerganga',
  'hampta-pass-trek-packing-list',
  'how-to-reach-sankri-from-dehradun',
  'kareri-lake-trek-in-summer',
  'baraadsar-lake-safety-difficulty',
  'kasol-to-grahan-trek',
  'altitude-sickness-himalayan-treks-ams',
  'har-ki-dun-osla-village-culture',
  'dev-roopa-vs-hampta-pass',
  'tosh-village-trekking-guide',
];

module.exports = {
  siteUrl: process.env.SITE_URL || 'https://unchartedtravel.in',
  generateRobotsTxt: true,
  exclude: ['/login', '/dashboard', '/register/*', '/api/*'],

  additionalPaths: async (config) => {
    const result = [];

    // Trek detail pages + gallery pages
    for (const slug of TREK_SLUGS) {
      result.push(await config.transform(config, `/destinations/${slug}`));
      result.push(await config.transform(config, `/destinations/${slug}/gallery`));
    }

    // Guide profile pages
    result.push(await config.transform(config, '/guides'));
    for (const id of GUIDE_IDS) {
      result.push(await config.transform(config, `/guides/${id}`));
    }

    // Article pages
    result.push(await config.transform(config, '/articles'));
    for (const slug of ARTICLE_SLUGS) {
      result.push(await config.transform(config, `/articles/${slug}`));
    }

    return result;
  },

  robotsTxtOptions: {
    policies: [
      // Default: allow everything, disallow private paths
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/login', '/dashboard', '/register/', '/api/'],
      },
      // AI / GEO crawlers — explicitly allowed
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
    ],
    additionalSitemaps: [
      'https://unchartedtravel.in/sitemap.xml',
    ],
  },
};
