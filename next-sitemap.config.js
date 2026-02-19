/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.theunsentdaak.com",
  generateRobotsTxt: true,
  exclude: ["/admin", "/admin/*"],
  robotsTxtOptions: {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*"],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
    ],
  },
};
