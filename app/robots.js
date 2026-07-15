export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: 'https://kanhaiya.dev/sitemap.xml',
    host: 'https://kanhaiya.dev',
  };
}
