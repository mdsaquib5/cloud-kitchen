export default function sitemap() {
  const baseUrl = 'https://shreeshyaamfastfood.com';

  // These are the public routes you want Google to index
  const routes = [
    '',
    '/menu',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return routes;
}
