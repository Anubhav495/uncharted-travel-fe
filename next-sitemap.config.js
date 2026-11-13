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

module.exports = {
  siteUrl: process.env.SITE_URL || 'https://unchartedtravel.in',
  generateRobotsTxt: true,
  exclude: ['/login', '/dashboard', '/register/*', '/compare', '/api/*'],

  additionalPaths: async (config) => {
    const result = [];

    // Trek detail pages + gallery pages
    for (const slug of TREK_SLUGS) {
      result.push(await config.transform(config, `/destinations/${slug}`));
      result.push(await config.transform(config, `/destinations/${slug}/gallery`));
    }
    return result;
  },

  robotsTxtOptions: {
    policies: [
      // Default: allow everything, disallow private paths
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/login', '/dashboard', '/register/', '/compare', '/api/'],
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
