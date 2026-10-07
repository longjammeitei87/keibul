import type { MetadataRoute } from 'next';

const lastModified = new Date('2026-10-07');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.keibul.com/', lastModified },
    { url: 'https://www.keibul.com/services', lastModified },
    { url: 'https://www.keibul.com/solutions', lastModified },
    { url: 'https://www.keibul.com/process', lastModified },
    { url: 'https://www.keibul.com/work', lastModified },
    { url: 'https://www.keibul.com/about', lastModified },
    { url: 'https://www.keibul.com/faq', lastModified },
    { url: 'https://www.keibul.com/contact', lastModified },
  ];
}
