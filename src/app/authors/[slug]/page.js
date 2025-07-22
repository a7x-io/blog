import Image from "next/image";
import Link from "next/link";
import { sanityClient, urlFor } from "@/sanity/lib";
import { PortableText } from "@portabletext/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, FileText } from "lucide-react";

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  
  // Fetch author details
  const author = await sanityClient.fetch(
    `*[_type == "author" && slug.current == $slug][0]{
      _id,
      name,
      slug,
      image,
      bio,
      email,
      website,
    }`,
    { slug }
  );

  if (!author) {
    return (
      <div className="min-h-screen bg-background">
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
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold mb-4">Author not found</h1>
              <p className="text-muted-foreground mb-6">The author you're looking for doesn't exist.</p>
              <Button asChild>
                <Link href="/">← Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Fetch all posts by this author
  const posts = await sanityClient.fetch(
    `*[_type == "post" && author->slug.current == $slug] | order(publishedAt desc) {
      _id,
      title,
      slug,
      body,
      intro,
      publishedAt,
      mainImage,
      categories[]->{title},
    }`,
    { slug }
  );

  function getExcerpt(body) {
    // If body is a string, return it directly
    if (typeof body === 'string') return body;
    
    // If body is not an array or is empty, return empty string
    if (!body || !Array.isArray(body)) return "";
    
    try {
      // Handle Portable Text blocks
      const text = body
        .map(block => {
          if (block._type === 'block' && block.children && Array.isArray(block.children)) {
            return block.children
              .map(child => {
                if (child && typeof child.text === 'string') {
                  return child.text;
                }
                return '';
              })
              .join('');
          }
          return '';
        })
        .join(' ')
        .slice(0, 150);
      
      return text.length > 150 ? text + '...' : text;
    } catch (error) {
      console.error('Error in getExcerpt:', error);
      return '';
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "";
    }
  }

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

      {/* Author Profile */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Author Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Avatar className="w-24 h-24 md:w-32 md:h-32">
                <AvatarImage 
                  src={author.image ? urlFor(author.image).width(128).height(128).url() : undefined} 
                />
                <AvatarFallback className="text-2xl md:text-3xl">
                  {author.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{author.name}</h1>
            {author.bio && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
                {typeof author.bio === 'string' ? author.bio : getExcerpt(author.bio)}
              </p>
            )}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{posts.length} post{posts.length !== 1 ? 's' : ''}</span>
              </div>
              {author.email && (
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <a 
                    href={`mailto:${author.email}`} 
                    className="hover:text-primary transition-colors"
                  >
                    {author.email}
                  </a>
                </div>
              )}
              {author.website && (
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <a 
                    href={author.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-primary transition-colors"
                  >
                    Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Posts by Author */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Posts by {author.name}</h2>
            <p className="text-muted-foreground">
              Discover all articles written by this author.
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid gap-8">
            {posts.map((post, idx) => (
              <Card key={post._id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  {post.mainImage && (
                    <div className="relative h-48 md:h-full">
                      <Link href={`/posts/${post.slug?.current || post._id}`}>
                        <Image
                          src={urlFor(post.mainImage).width(600).height(400).url()}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col justify-center">
                    {/* Categories */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex gap-2 mb-3">
                        {post.categories.map((category, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {category.title}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <Link href={`/posts/${post.slug?.current || post._id}`}>
                      <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {(() => {
                        try {
                          // Only use intro if it's a string
                          if (typeof post.intro === 'string' && post.intro.trim()) {
                            return post.intro.length > 150 ? post.intro.slice(0, 150) + '...' : post.intro;
                          }
                          
                          // Otherwise try to get excerpt from body
                          const bodyExcerpt = getExcerpt(post.body);
                          if (bodyExcerpt) {
                            return bodyExcerpt;
                          }
                          
                          return 'No excerpt available';
                        } catch (error) {
                          console.error('Error in excerpt rendering:', error);
                          return 'No excerpt available';
                        }
                      })()}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {post.publishedAt ? formatDate(post.publishedAt) : 'No date set'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {posts.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground">
                  {author.name} hasn't published any posts yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
} 