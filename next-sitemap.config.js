/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://blacksfit-test.vercel.app',
  generateRobotsTxt: true,
  

  exclude: [
    '/csoon/*',
    '/cartsummary/*',
    '/api/*'
  ],
  
  
  changefreq: 'weekly',
  priority: 0.7
}