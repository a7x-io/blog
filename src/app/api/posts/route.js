import { sanityClient } from '@/sanity/lib';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const start = parseInt(searchParams.get('start') || '0', 10);
  const end = parseInt(searchParams.get('end') || '6', 10);
  const category = searchParams.get('category');

  try {
    let query = `*[_type == "post"`;
    
    // Add category filter if provided
    if (category) {
      query += ` && "${category}" in categories[]->slug.current`;
    }
    
    query += `]|order(publishedAt desc)[${start}...${end}] {
      _id,
      title,
      slug,
      body,
      publishedAt,
      author->{name, image, slug},
      mainImage,
      categories[]->{title, slug},
      intro
    }`;

    const posts = await sanityClient.fetch(query);
    return Response.json({ posts });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ posts: [], error: 'Failed to fetch posts' }, { status: 500 });
  }
} 