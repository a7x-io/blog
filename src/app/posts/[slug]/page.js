import Image from "next/image";
import { sanityClient, urlFor } from "@/sanity/lib";
import { PortableText } from "@portabletext/react";
import Link from "next/link";

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

export default async function PostPage({ params }) {
  const { slug } = params;
  const post = await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      body,
      intro,
      youtubeUrl,
      publishedAt,
      author->{name},
      mainImage,
    }`,
    { slug }
  );

  if (!post) {
    return <div className="max-w-2xl mx-auto py-16 text-center text-ray-text">Post not found.</div>;
  }

  const ytId = getYouTubeId(post.youtubeUrl);

  return (
    <div className="min-h-screen bg-ray-bg dark:bg-ray-bg text-ray-text flex flex-col bg-ray-dark">
      <header className="w-full py-8 bg-ray-surface dark:bg-ray-surface shadow-ray">
        <div className="max-w-2xl mx-auto px-4">
          <Link href="/" className="text-ray-accent hover:underline">← Back to Home</Link>
        </div>
      </header>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
        <div className="bg-ray-card dark:bg-ray-card rounded-2xl shadow-ray p-8 border border-ray-muted/40">
          {post.mainImage && (
            <div className="mb-8 w-full flex justify-center">
              <Image
                src={urlFor(post.mainImage).width(800).height(400).url()}
                alt={post.title}
                width={800}
                height={400}
                className="rounded-lg object-cover h-64 w-full"
                priority
              />
            </div>
          )}
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-ray-text">{post.title}</h1>
          <div className="flex items-center text-sm text-ray-text-muted mb-8">
            <span>{post.publishedAt?.slice(0, 10)}</span>
            <span className="mx-2">•</span>
            <span>By {post.author?.name}</span>
          </div>
          {post.intro && (
            <p className="text-lg mb-8 text-ray-text-muted font-medium">{post.intro}</p>
          )}
          {ytId && (
            <div className="mb-10 aspect-video w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-ray">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          )}
          <article className="prose dark:prose-invert max-w-none prose-headings:text-ray-text prose-p:text-ray-text-muted prose-a:text-ray-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-ray">
            <PortableText value={post.body} />
          </article>
        </div>
      </main>
    </div>
  );
} 