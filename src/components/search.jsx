'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib';

export function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchPosts = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setIsSearching(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (response.ok) {
        setResults(data.posts || []);
      } else {
        setError('Search failed. Please try again.');
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query) {
        searchPosts(query);
      } else {
        setResults([]);
        setError(null);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setError(null);
    setShowResults(false);
  };

  const handleResultClick = () => {
    setShowResults(false);
  };

  function getExcerpt(body) {
    if (!body || !Array.isArray(body)) return "";
    const firstBlock = body.find(block => block._type === "block" && Array.isArray(block.children));
    if (firstBlock && firstBlock.children.length > 0) {
      return firstBlock.children[0].text;
    }
    return "";
  }

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="pl-10 pr-10 w-full md:w-64 lg:w-80"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        )}
        {query && !isSearching && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (query || results.length > 0 || error) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto min-w-[280px] md:min-w-[320px]">
          {isSearching ? (
            <div className="p-4 text-center text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
              Searching...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-destructive">
              {error}
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              <div className="text-xs text-muted-foreground px-3 py-2 border-b">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </div>
              {results.map((post) => (
                <Link
                  key={post._id}
                  href={`/posts/${post.slug?.current || post._id}`}
                  className="block p-3 rounded-md hover:bg-accent transition-colors"
                  onClick={handleResultClick}
                >
                  <div className="flex gap-3">
                    {post.mainImage && (
                      <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-muted">
                        <Image
                          src={urlFor(post.mainImage).width(64).height(48).url()}
                          alt={post.title}
                          width={64}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{post.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {post.intro || getExcerpt(post.body) || ''}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="w-4 h-4">
                          <AvatarImage src={post.author?.image ? urlFor(post.author.image).width(16).height(16).url() : undefined} />
                          <AvatarFallback className="text-xs">
                            {post.author?.name?.charAt(0) || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {post.author?.name || 'Anonymous'}
                        </span>
                        {post.categories && post.categories.length > 0 && (
                          <>
                            <span className="text-xs text-muted-foreground">•</span>
                            <Badge variant="outline" className="text-xs h-4 px-1">
                              {post.categories[0].title}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="p-4 text-center text-muted-foreground">
              No posts found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
} 