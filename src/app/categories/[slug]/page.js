"use client";

import { useState, useEffect, useCallback, useRef, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';

const PAGE_SIZE = 6;

export default function CategoryPage({ params }) {
  const { slug } = use(params);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState(null);
  const [lastLoadedIndex, setLastLoadedIndex] = useState(-1);
  
  const loaderRef = useRef(null);
  const gridRef = useRef(null);

  const fetchPosts = useCallback(async (pageNum) => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const start = pageNum * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      
      const response = await fetch(`/api/posts?start=${start}&end=${end}&category=${slug}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (pageNum === 0) {
        // First page - replace posts
        setPosts(data.posts);
        setLastLoadedIndex(data.posts.length - 1);
      } else {
        // Subsequent pages - append posts with deduplication
        setPosts(prev => {
          const existingIds = new Set(prev.map(p => p._id));
          const newUniquePosts = data.posts.filter(p => !existingIds.has(p._id));
          setLastLoadedIndex(prev.length - 1);
          return [...prev, ...newUniquePosts];
        });
      }
      
      setHasMore(data.posts.length === PAGE_SIZE);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const fetchCategory = useCallback(async () => {
    if (!slug) return;
    
    try {
      const response = await fetch(`/api/categories/${slug}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setCategory(data.category);
    } catch (err) {
      setError(err.message);
    }
  }, [slug]);

  // Fetch category info on mount
  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  // Fetch posts when page changes
  useEffect(() => {
    fetchPosts(page);
  }, [fetchPosts, page]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, loading]);

  // Smooth scroll to first new post
  useEffect(() => {
    if (lastLoadedIndex >= 0 && gridRef.current) {
      const posts = gridRef.current.children;
      if (posts[lastLoadedIndex]) {
        posts[lastLoadedIndex].scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [lastLoadedIndex]);

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button asChild>
            <Link href="/">Go back to homepage</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (!category && !loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Category not found</h1>
          <Button asChild>
            <Link href="/">Go back to homepage</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {category && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.title}</h1>
          {category.description && (
            <p className="text-gray-600 mb-4">{category.description}</p>
          )}
          <Button variant="outline" asChild className="mb-6">
            <Link href="/">← Back to all posts</Link>
          </Button>
        </div>
      )}

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <Card 
            key={post._id} 
            className={`group transition-all duration-300 hover:shadow-lg cursor-pointer ${
              index > lastLoadedIndex ? 'animate-fadeIn' : ''
            }`}
            onClick={() => window.location.href = `/posts/${post.slug?.current || post._id}`}
          >
            <CardHeader>
              {post.mainImage && (
                <div className="aspect-video overflow-hidden rounded-lg mb-4">
                  <Image
                    src={urlFor(post.mainImage).width(400).height(225).url()}
                    alt={post.mainImage.alt || post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </CardTitle>
              <CardDescription>
                {post.author && (
                  <Link 
                    href={`/authors/${post.author.slug.current}`} 
                    className="text-foreground hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    By {post.author.name}
                  </Link>
                )}
                {post.publishedAt && (
                  <span className="block text-sm text-gray-500 mt-1">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {post.intro && (
                <p className="text-gray-600 line-clamp-3 mb-4">{post.intro}</p>
              )}
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((cat, catIndex) => (
                    <Badge 
                      key={`${cat.title}-${catIndex}`} 
                      variant="secondary"
                      className="hover:bg-primary/20 cursor-pointer transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = `/categories/${cat.slug.current}`;
                      }}
                    >
                      {cat.title}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Spinner size={32} />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No more posts in this category.</p>
        </div>
      )}

      {!hasMore && !loading && posts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No posts found in this category.</p>
        </div>
      )}

      {/* Load more button as fallback */}
      {hasMore && !loading && (
        <div className="flex justify-center py-8">
          <Button onClick={() => setPage(prev => prev + 1)}>
            Load more posts
          </Button>
        </div>
      )}

      {/* Invisible loader for intersection observer */}
      <div ref={loaderRef} className="h-4" />
    </main>
  );
} 