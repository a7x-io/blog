import { sanityClient } from '@/sanity/lib';

export default async function sitemap() {
  const baseUrl = 'https://www.raytoolkit.com';

  // Get all posts
  const posts = await sanityClient.fetch(`
    *[_type == "post" && publishedAt != null] {
      slug,
      publishedAt,
      _updatedAt
    }
  `);

  // Get all authors
  const authors = await sanityClient.fetch(`
    *[_type == "author"] {
      slug
    }
  `);

  // Get all categories
  const categories = await sanityClient.fetch(`
    *[_type == "category"] {
      slug
    }
  `);

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Post pages
  const postPages = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug.current}`,
    lastModified: new Date(post._updatedAt || post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Author pages
  const authorPages = authors.map((author) => ({
    url: `${baseUrl}/authors/${author.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticPages, ...postPages, ...authorPages, ...categoryPages];
} 