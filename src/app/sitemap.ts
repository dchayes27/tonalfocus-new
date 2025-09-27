import type { MetadataRoute } from 'next';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tonalfocus-new.vercel.app').replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = ['/', '/portfolio', '/about', '/contact'].map((path) => ({
    url: `${BASE_URL}${path === '/' ? '/' : path}`,
    lastModified: new Date(),
  }));

  return routes;
}
