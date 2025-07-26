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
import { PostSkeleton, HeroPostSkeleton, CategorySkeleton, PostGridSkeleton } from "@/components/ui/post-skeleton";

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
  const [loading, setLoading] = useState(true); // Start with loading true
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const loaderRef = useRef();
  const [error, setError] = useState(null);
  const [lastLoadedIndex, setLastLoadedIndex] = useState(-1);
  const gridRef = useRef();
  const hasRestored = useRef(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true); // Track initial load

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
        setLoading(false); // Stop loading if we have cached posts
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
      setInitialLoad(false); // Mark initial load as complete
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page]);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to load categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch posts if we've completed the restoration process OR if we're on the first load
    if (hasRestored.current || posts.length === 0) {
      fetchPosts();
    }
  }, [page, fetchPosts, posts.length]);

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
    if (lastLoadedIndex >= 0 && posts.length > lastLoadedIndex + 1 && page > 0) {
      // Scroll to the first new post
      const grid = gridRef.current;
      if (grid) {
        const newCard = grid.children[lastLoadedIndex + 1];
        if (newCard) {
          newCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }, [posts, lastLoadedIndex, page]);

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
    <div className="min-h-screen bg-background bg-noise-subtle">
      {/* Hero Section */}
      <header className="w-full py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-b shadow-soft">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-slideIn">
            <span className="gradient-text">
              Raytoolkit!
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slideIn" style={{animationDelay: '0.1s'}}>
            A modern blog built with Next.js, Sanity CMS, and shadcn/ui
          </p>
          <div className="flex gap-4 justify-center animate-slideIn" style={{animationDelay: '0.2s'}}>
            <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105">Next.js</Badge>
            <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105">Sanity CMS</Badge>
            <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105">shadcn/ui</Badge>
            <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105">Tailwind CSS</Badge>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Categories Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Categories</h2>
              <Button variant="outline" size="sm" asChild>
                <Link href="/categories">View all categories</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.length > 0 && !categoriesLoading ? (
                categories.slice(0, 6).map((category, index) => (
                  <Button
                    key={category._id}
                    variant="outline"
                    className="group h-auto py-3 px-4 flex flex-col items-center gap-1 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-105 shadow-soft animate-scaleIn"
                    style={{animationDelay: `${index * 0.1}s`}}
                    asChild
                  >
                    <Link href={`/categories/${category.slug.current}`}>
                      <span className="font-medium text-xs">{category.title}</span>
                      <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">
                        {category.postCount} post{category.postCount !== 1 ? 's' : ''}
                      </span>
                    </Link>
                  </Button>
                ))
              ) : (
                // Skeleton loading for categories
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className={`h-auto py-3 px-4 flex flex-col items-center gap-1 border rounded-md shadow-soft skeleton-stagger-${index + 1}`}>
                    <CategorySkeleton />
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Hero Section - Latest Post */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold">Latest Post</h2>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
              New
            </Badge>
            </div>
            
            {posts.length > 0 && !initialLoad ? (
              /* Hero Card */
              <Card 
                className="group hover-lift border-0 shadow-medium overflow-hidden cursor-pointer bg-gradient-to-br from-white to-blue-50/30"
                onClick={() => window.location.href = `/posts/${posts[0].slug?.current || posts[0]._id}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Image Section */}
                  {posts[0].mainImage && (
                    <div className="relative h-64 lg:h-full overflow-hidden">
                      <Image
                        src={urlFor(posts[0].mainImage).width(800).height(600).quality(90).url()}
                        alt={posts[0].title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={true}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent lg:from-black/30" />
                      
                      {/* Category badges overlay */}
                      {posts[0].categories && posts[0].categories.length > 0 && (
                        <div className="absolute top-6 left-6 flex gap-2">
                          {posts[0].categories.slice(0, 2).map((category, catIdx) => (
                            <Badge 
                              key={catIdx} 
                              variant="secondary" 
                              className="text-sm bg-background/90 backdrop-blur hover:bg-blue-100 cursor-pointer transition-colors"
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
                  <div className="p-8 flex flex-col justify-center">
                    <CardTitle className="text-3xl lg:text-4xl font-bold group-hover:text-blue-600 transition-colors line-clamp-3 mb-4">
                      {posts[0].title}
                    </CardTitle>
                    <CardDescription className="text-lg line-clamp-4 mb-6">
                      {getExcerpt(posts[0].body)}
                    </CardDescription>
                    
                    {/* Author and Date */}
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar 
                        className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/authors/${posts[0].author?.slug?.current || 'anonymous'}`;
                        }}
                      >
                        <AvatarImage src={posts[0].author?.image ? urlFor(posts[0].author.image).width(96).height(96).quality(90).url() : undefined} />
                        <AvatarFallback className="text-sm">
                          {posts[0].author?.name?.charAt(0) || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/authors/${posts[0].author?.slug?.current || 'anonymous'}`}
                          className="text-base font-medium truncate text-foreground hover:text-blue-600 transition-colors block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {posts[0].author?.name || 'Anonymous'}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(posts[0].publishedAt)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Read More Button */}
                    <Button 
                      size="lg"
                      className="w-fit group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 hover:scale-105 shadow-soft hover:shadow-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/posts/${posts[0].slug?.current || posts[0]._id}`;
                      }}
                    >
                      Read Full Article
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <HeroPostSkeleton />
            )}
          </div>
          
          {/* Other Posts Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">More Posts</h2>
            <p className="text-muted-foreground">Discover more insights, tutorials, and stories from the world of web development.</p>
          </div>
          
          {/* Vertical Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch" ref={gridRef}>
            {posts.length > 1 && !initialLoad ? (
              posts.slice(1).map((post, idx) => (
              <Card
                key={post._id}
                className={
                  "group hover-lift border-0 shadow-soft overflow-hidden cursor-pointer bg-white" +
                  (idx > lastLoadedIndex ? " animate-fadeIn" : "")
                }
                onClick={() => window.location.href = `/posts/${post.slug?.current || post._id}`}
              >
                {/* Image Section */}
                {post.mainImage && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={post.mainImage ? urlFor(post.mainImage).width(400).height(300).quality(90).url() : ''}
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
                            className="text-xs bg-background/90 backdrop-blur hover:bg-blue-100 cursor-pointer transition-colors"
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
                                      <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-sm mt-2 line-clamp-3">
                    {getExcerpt(post.body)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Author and Date */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar 
                      className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/authors/${post.author?.slug?.current || 'anonymous'}`;
                      }}
                    >
                      <AvatarImage src={post.author?.image ? urlFor(post.author.image).width(64).height(64).quality(90).url() : undefined} />
                      <AvatarFallback className="text-xs">
                        {post.author?.name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/authors/${post.author?.slug?.current || 'anonymous'}`}
                        className="text-sm font-medium truncate text-foreground hover:text-blue-600 transition-colors block"
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
                    className="w-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 hover:scale-105 border-blue-200 hover:border-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/posts/${post.slug?.current || post._id}`;
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))
            ) : (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className={`skeleton-stagger-${(index % 6) + 1} h-full w-full`}>
                  <PostSkeleton />
                </div>
              ))
            )}
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
          {posts.length === 0 && !loading && !error && !initialLoad && (
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
