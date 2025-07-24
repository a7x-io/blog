import { sanityClient } from '@/sanity/lib';

export async function GET(request, { params }) {
  const { slug } = params;

  try {
    const category = await sanityClient.fetch(`
      *[_type == "category" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        description
      }
    `, { slug });

    if (!category) {
      return Response.json({ error: 'Category not found' }, { status: 404 });
    }

    return Response.json({ category });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
} 