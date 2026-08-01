/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://unchartedtravel.in',
  generateRobotsTxt: true,
  exclude: ['/dashboard', '/register/*', '/compare', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/register/*', '/compare', '/api/*'],
      },
    ],
  },
};
