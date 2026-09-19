import { getAllPosts, getSections } from '@/lib/posts';

const BASE_URL = 'https://salvarez-portfolio.vercel.app';

export default function sitemap() {
  const posts = getAllPosts();
  const sections = getSections();

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: posts[0] ? new Date(posts[0].date) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...sections.map((section) => ({
      url: `${BASE_URL}/blog/section/${section.slug}`,
      lastModified: new Date(section.posts[0].date),
      changeFrequency: 'weekly',
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly',
      priority: 0.7,
    })),
  ];
}
