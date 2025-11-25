import { MetadataRoute } from 'next';
import { getAllArticles } from '@/data/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const baseUrl = 'https://your-domain.com';

  const articleUrls = articles.map((article) => ({
    url: `${baseUrl}/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...articleUrls,
  ];
}
