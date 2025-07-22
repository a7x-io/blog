import { sanityClient } from '@/sanity/lib';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim() === '') {
    return Response.json({ posts: [] });
  }

  try {
    const posts = await sanityClient.fetch(`
      *[_type == "post" && (
        title match "*${query}*" ||
        intro match "*${query}*" ||
        body[].children[].text match "*${query}*"
      )] | order(publishedAt desc)[0...20] {
        _id,
        title,
        slug,
        intro,
        body,
        publishedAt,
        author->{name, image},
        mainImage,
        categories[]->{title},
      }
    `);

    return Response.json({ posts });
  } catch (error) {
    console.error('Search error:', error);
    return Response.json({ posts: [], error: 'Search failed' }, { status: 500 });
  }
} 