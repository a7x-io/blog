"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { urlFor } from "../sanity/lib";
import { Spinner } from "@/components/ui/spinner";

const PAGE_SIZE = 6;

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

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const loaderRef = useRef();
  const [error, setError] = useState(null);
  const [lastLoadedIndex, setLastLoadedIndex] = useState(-1);
  const gridRef = useRef();
  const hasRestored = useRef(false);
  const [categories, setCategories] = useState([]);

  // Restore posts and page from sessionStorage on client only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPosts = sessionStorage.getItem('posts');
      const savedPage = sessionStorage.getItem('page');
      const savedHasMore = sessionStorage.getItem('hasMore');
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
        setLastLoadedIndex(parsedPosts.length - 1);
      }
      if (savedPage) setPage(JSON.parse(savedPage));
      if (savedHasMore !== null) setHasMore(JSON.parse(savedHasMore));
      hasRestored.current = true;
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    try {
      const res = await fetch(`/api/posts?start=${start}&end=${end}`);
      if (!res.ok) throw new Error('Failed to load posts');
      const data = await res.json();
      if (data.posts.length < PAGE_SIZE) setHasMore(false);
      setPosts(prev => {
        // Deduplicate by _id
        const existingIds = new Set(prev.map(p => p._id));
        const newUniquePosts = data.posts.filter(p => !existingIds.has(p._id));
        setLastLoadedIndex(prev.length - 1);
        return [...prev, ...newUniquePosts];
      });
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to load categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, []);

  useEffect(() => {
    // Only fetch if we've completed the restoration process
    if (hasRestored.current) {
      fetchPosts();
    }
  }, [page, fetchPosts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new window.IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1 }
    );
    const currentLoaderRef = loaderRef.current;
    if (currentLoaderRef) observer.observe(currentLoaderRef);
    return () => {
      if (currentLoaderRef) observer.unobserve(currentLoaderRef);
    };
  }, [hasMore, loading]);

  useEffect(() => {
    if (lastLoadedIndex >= 0 && posts.length > lastLoadedIndex + 1) {
      // Scroll to the first new post
      const grid = gridRef.current;
      if (grid) {
        const newCard = grid.children[lastLoadedIndex + 1];
        if (newCard) {
          newCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }, [posts, lastLoadedIndex]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('posts', JSON.stringify(posts));
      sessionStorage.setItem('page', JSON.stringify(page));
      sessionStorage.setItem('hasMore', JSON.stringify(hasMore));
    }
  }, [posts, page, hasMore]);

  // Optionally, restore scroll position:
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScroll = sessionStorage.getItem('scrollY');
      if (savedScroll) {
        window.scrollTo(0, parseInt(savedScroll, 10));
        sessionStorage.removeItem('scrollY');
      }
      // Save scroll position before navigating away
      const handleBeforeUnload = () => {
        sessionStorage.setItem('scrollY', window.scrollY);
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="w-full py-16 bg-gradient-to-br from-primary/5 to-secondary/5 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Raytoolkit
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
          {/* Categories Section */}
          {categories.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Categories</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/categories">View all categories</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {categories.slice(0, 6).map((category) => (
                  <Button
                    key={category._id}
                    variant="outline"
                    className="h-auto py-2 px-3 flex flex-col items-center gap-1 hover:bg-primary/5"
                    asChild
                  >
                    <Link href={`/categories/${category.slug.current}`}>
                      <span className="font-medium text-xs">{category.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {category.postCount} post{category.postCount !== 1 ? 's' : ''}
                      </span>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Latest Posts</h2>
            <p className="text-muted-foreground">Discover insights, tutorials, and stories from the world of web development.</p>
          </div>
          {/* Vertical Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={gridRef}>
            {posts.map((post, idx) => (
              <Card
                key={post._id}
                className={
                  "group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden cursor-pointer" +
                  (idx > lastLoadedIndex ? " animate-fadeIn" : "")
                }
                onClick={() => window.location.href = `/posts/${post.slug?.current || post._id}`}
              >
                {/* Image Section */}
                {post.mainImage && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={post.mainImage ? urlFor(post.mainImage).width(400).height(300).url() : ''}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      priority={idx < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {/* Category badges overlay */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="absolute top-4 left-4 flex gap-2">
                        {post.categories.slice(0, 2).map((category, catIdx) => (
                          <Badge 
                            key={catIdx} 
                            variant="secondary" 
                            className="text-xs bg-background/90 backdrop-blur hover:bg-primary/20 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = `/categories/${category.slug.current}`;
                            }}
                          >
                            {category.title}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {/* Content Section */}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-sm mt-2 line-clamp-3">
                    {getExcerpt(post.body)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Author and Date */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={post.author?.image ? urlFor(post.author.image).width(32).height(32).url() : undefined} />
                      <AvatarFallback className="text-xs">
                        {post.author?.name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/authors/${post.author?.slug?.current || 'anonymous'}`}
                        className="text-sm font-medium truncate hover:text-primary transition-colors block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {post.author?.name || 'Anonymous'}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(post.publishedAt)}
                      </p>
                    </div>
                  </div>
                  {/* Read More Button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/posts/${post.slug?.current || post._id}`;
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {loading && (
            <div className="flex justify-center py-8">
              <Spinner size={36} className="text-primary" />
            </div>
          )}
          {error && (
            <div className="flex justify-center py-8 text-red-500 font-semibold">
              {error}
            </div>
          )}
          {!hasMore && posts.length > 0 && !loading && !error && (
            <div className="flex justify-center py-8 text-muted-foreground">
              <span>No more posts to load.</span>
            </div>
          )}
          <Button
            className="mx-auto mt-8"
            variant="outline"
            onClick={() => setPage(prev => prev + 1)}
            disabled={loading || !hasMore}
            style={{ display: !hasMore || loading ? 'none' : 'block' }}
          >
            Load More Posts
          </Button>
          <div ref={loaderRef} />
          {posts.length === 0 && !loading && (
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
