export default function sitemap() {
  const now = new Date();
  return [
    { url: 'https://kanhaiya.dev', lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: 'https://kanhaiya.dev/#work', lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://kanhaiya.dev/#about', lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: 'https://kanhaiya.dev/#skills', lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: 'https://kanhaiya.dev/#contact', lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
  ];
}
