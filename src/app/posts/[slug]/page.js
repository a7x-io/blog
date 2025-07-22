import Image from "next/image";
import { sanityClient, urlFor } from "@/sanity/lib";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
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

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      body,
      intro,
      youtubeUrl,
      publishedAt,
      author->{name, image, slug},
      mainImage,
      categories[]->{title},
    }`,
    { slug }
  );

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <p className="text-muted-foreground mb-6">The post you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/">← Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ytId = getYouTubeId(post.youtubeUrl);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            {/* Hero Image */}
            {post.mainImage && (
              <div className="relative w-full h-64 md:h-96">
                <Image
                  src={urlFor(post.mainImage).width(1200).height(600).url()}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
            )}

            <CardHeader className="pb-6">
              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {post.categories.map((category, idx) => (
                    <Badge key={idx} variant="secondary">
                      {category.title}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={post.author?.image ? urlFor(post.author.image).width(24).height(24).url() : undefined} />
                    <AvatarFallback className="text-xs">
                      {post.author?.name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <Link
                    href={`/authors/${post.author?.slug?.current || 'anonymous'}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {post.author?.name || 'Anonymous'}
                  </Link>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="prose prose-lg dark:prose-invert max-w-none">
              {/* Intro */}
              {post.intro && (
                <div className="mb-8 p-6 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <p className="text-lg font-medium text-muted-foreground m-0">
                    {post.intro}
                  </p>
                </div>
              )}

              {/* YouTube Video */}
              {ytId && (
                <div className="mb-8 aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}`}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose-headings:scroll-m-20 prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7 prose-p:text-muted-foreground prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:underline-offset-2 prose-img:rounded-lg prose-img:shadow-md">
                <PortableText 
                  value={post.body} 
                  components={{
                    types: {
                      image: ({ value }) => (
                        <div className="my-8">
                          <Image
                            src={urlFor(value).width(800).height(600).url()}
                            alt={value.alt || 'Blog post image'}
                            width={800}
                            height={600}
                            className="rounded-lg shadow-md w-full h-auto"
                          />
                          {value.alt && (
                            <p className="text-sm text-muted-foreground mt-2 text-center italic">
                              {value.alt}
                            </p>
                          )}
                        </div>
                      ),
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 