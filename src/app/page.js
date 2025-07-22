import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { sanityClient, urlFor } from "../sanity/lib";

export default async function Home() {
  const posts = await sanityClient.fetch(`*[_type == "post"]|order(publishedAt desc)[0...10]{
    _id,
    title,
    slug,
    body,
    publishedAt,
    author->{name},
    mainImage,
  }`);

  function getExcerpt(body) {
    if (!body || !Array.isArray(body)) return "";
    const firstBlock = body.find(block => block._type === "block" && Array.isArray(block.children));
    if (firstBlock && firstBlock.children.length > 0) {
      return firstBlock.children[0].text;
    }
    return "";
  }

  return (
    <div className="min-h-screen bg-ray-bg dark:bg-ray-bg text-ray-text flex flex-col bg-ray-dark">
      <header className="w-full py-8 bg-ray-surface dark:bg-ray-surface shadow-ray">
        <div className="max-w-2xl mx-auto px-4 flex flex-col items-center">
          <h1 className="text-5xl font-extrabold mb-2 tracking-tight text-ray-text">My Blog</h1>
          <p className="text-ray-text-muted text-lg">A modern blog built with Next.js & Tailwind CSS</p>
        </div>
      </header>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
        <ul className="space-y-12">
          {posts.map((post, idx) => (
            <li key={post._id} className="bg-ray-card dark:bg-ray-card rounded-2xl shadow-ray p-8 transition hover:shadow-2xl border border-ray-muted/40">
              <Link href={`/posts/${post.slug?.current || post._id}`} className="block group">
                {post.mainImage && (
                  <div className="mb-6 w-full flex justify-center">
                    <Image
                      src={urlFor(post.mainImage).width(600).height(300).url()}
                      alt={post.title}
                      width={600}
                      height={300}
                      className="rounded-lg object-cover h-56 w-full group-hover:opacity-90 transition"
                      priority={idx === 0}
                    />
                  </div>
                )}
                <h2 className="text-3xl font-bold mb-3 group-hover:underline text-ray-text">{post.title}</h2>
              </Link>
              <p className="text-ray-text-muted text-lg mb-6">{getExcerpt(post.body)}</p>
              <div className="flex items-center text-sm text-ray-text-muted">
                <span>{post.publishedAt?.slice(0, 10)}</span>
                <span className="mx-2">•</span>
                <span>By {post.author?.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
