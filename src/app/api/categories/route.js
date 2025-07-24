import { sanityClient } from '@/sanity/lib';

export async function GET() {
  try {
    const categories = await sanityClient.fetch(`
      *[_type == "category"] {
        _id,
        title,
        slug,
        description,
        "postCount": count(*[_type == "post" && references(^._id)])
      } | order(title asc)
    `);

    return Response.json({ categories });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
} 