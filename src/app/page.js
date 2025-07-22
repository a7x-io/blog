import Image from "next/image";
import Link from "next/link";
import { sanityClient, urlFor } from "../sanity/lib";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default async function Home() {
  const posts = await sanityClient.fetch(`*[_type == "post"]|order(publishedAt desc)[0...10]{
    _id,
    title,
    slug,
    body,
    publishedAt,
    author->{name, image, slug},
    mainImage,
    categories[]->{title},
  }`);

  function getExcerpt(body) {
    if (!body || !Array.isArray(body)) return "";
    const firstBlock = body.find(block => block._type === "block" && Array.isArray(block.children));
    if (firstBlock && firstBlock.children.length > 0) {
      return firstBlock.children[0].text;
    }
    return "";
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="w-full py-16 bg-gradient-to-br from-primary/5 to-secondary/5 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              My Blog
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern blog built with Next.js, Sanity CMS, and shadcn/ui
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Badge variant="secondary">Next.js</Badge>
            <Badge variant="secondary">Sanity CMS</Badge>
            <Badge variant="secondary">shadcn/ui</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Latest Posts</h2>
            <p className="text-muted-foreground">Discover insights, tutorials, and stories from the world of web development.</p>
          </div>

          {/* Featured Post Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Post (First Post) */}
            {posts.length > 0 && (
              <div className="lg:col-span-2">
                <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden h-full">
                  {/* Large Image Section */}
                  {posts[0].mainImage && (
                    <Link href={`/posts/${posts[0].slug?.current || posts[0]._id}`} className="block">
                      <div className="relative w-full h-64 lg:h-80 overflow-hidden cursor-pointer">
                        <Image
                          src={urlFor(posts[0].mainImage).width(800).height(500).url()}
                          alt={posts[0].title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        {/* Category badges overlay */}
                        {posts[0].categories && posts[0].categories.length > 0 && (
                          <div className="absolute top-4 left-4 flex gap-2">
                            {posts[0].categories.slice(0, 2).map((category, catIdx) => (
                              <Badge key={catIdx} variant="secondary" className="text-xs bg-background/90 backdrop-blur">
                                {category.title}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  )}

                  {/* Content Section */}
                  <div className="flex flex-col h-full">
                    <CardHeader className="pb-4 flex-1">
                      <Link href={`/posts/${posts[0].slug?.current || posts[0]._id}`}>
                        <CardTitle className="text-2xl lg:text-3xl font-bold group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                          {posts[0].title}
                        </CardTitle>
                      </Link>
                      <CardDescription className="text-base mt-3 line-clamp-4">
                        {getExcerpt(posts[0].body)}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {/* Author and Date */}
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={posts[0].author?.image ? urlFor(posts[0].author.image).width(40).height(40).url() : undefined} />
                          <AvatarFallback className="text-sm">
                            {posts[0].author?.name?.charAt(0) || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/authors/${posts[0].author?.slug?.current || 'anonymous'}`}
                            className="text-base font-medium truncate hover:text-primary transition-colors block"
                          >
                            {posts[0].author?.name || 'Anonymous'}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(posts[0].publishedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Read More Button */}
                      <Button variant="outline" size="default" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                        <Link href={`/posts/${posts[0].slug?.current || posts[0]._id}`}>
                          Read More
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              </div>
            )}

            {/* Secondary Posts */}
            <div className="lg:col-span-1 space-y-6">
              {posts.slice(1, 3).map((post, idx) => (
                <Card key={post._id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
                  {/* Smaller Image Section */}
                  {post.mainImage && (
                    <Link href={`/posts/${post.slug?.current || post._id}`} className="block">
                      <div className="relative w-full h-40 overflow-hidden cursor-pointer">
                        <Image
                          src={urlFor(post.mainImage).width(400).height(250).url()}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        {/* Category badges overlay */}
                        {post.categories && post.categories.length > 0 && (
                          <div className="absolute top-3 left-3 flex gap-1">
                            {post.categories.slice(0, 1).map((category, catIdx) => (
                              <Badge key={catIdx} variant="secondary" className="text-xs bg-background/90 backdrop-blur">
                                {category.title}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  )}

                  {/* Content Section */}
                  <CardHeader className="pb-3">
                    <Link href={`/posts/${post.slug?.current || post._id}`}>
                      <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </Link>
                    <CardDescription className="text-sm mt-2 line-clamp-2">
                      {getExcerpt(post.body)}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Author and Date */}
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={post.author?.image ? urlFor(post.author.image).width(24).height(24).url() : undefined} />
                        <AvatarFallback className="text-xs">
                          {post.author?.name?.charAt(0) || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/authors/${post.author?.slug?.current || 'anonymous'}`}
                          className="text-xs font-medium truncate hover:text-primary transition-colors block"
                        >
                          {post.author?.name || 'Anonymous'}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(post.publishedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                      <Link href={`/posts/${post.slug?.current || post._id}`}>
                        Read More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {posts.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Posts will appear here once you create them in your Sanity studio.
                </p>
                <Button asChild>
                  <Link href="/studio">Go to Studio</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
