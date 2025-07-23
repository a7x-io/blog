import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Code, Database, Palette, Zap, Users, BookOpen, Github } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              About This Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern, full-featured blog showcasing the power of Next.js, Sanity CMS, and shadcn/ui
            </p>
          </div>

          {/* Tech Stack */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Built With
              </CardTitle>
              <CardDescription>
                Modern technologies powering this blog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <Zap className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Next.js 15</h3>
                    <p className="text-sm text-muted-foreground">React Framework</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <Database className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Sanity CMS</h3>
                    <p className="text-sm text-muted-foreground">Content Management</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                  <Palette className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">shadcn/ui</h3>
                    <p className="text-sm text-muted-foreground">UI Components</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Blog Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                  <span className="text-sm">Rich text content with PortableText</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                  <span className="text-sm">Real-time search functionality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                  <span className="text-sm">Author profiles and pages</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                  <span className="text-sm">Category organization</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                  <span className="text-sm">Responsive design</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                  <span className="text-sm">Dark mode support</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  For Content Creators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                  <span className="text-sm">Sanity Studio for content management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                  <span className="text-sm">Rich text editor with formatting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                  <span className="text-sm">Image optimization and management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                  <span className="text-sm">Author and category management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                  <span className="text-sm">Real-time preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                  <span className="text-sm">SEO-friendly structure</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />

          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About This Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                This blog demonstrates a modern approach to content management and web development. 
                Built with Next.js 15, it leverages the latest features like the App Router, Server Components, 
                and improved performance optimizations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Sanity CMS provides a powerful headless content management system that allows for flexible 
                content modeling, real-time collaboration, and seamless integration with the frontend. 
                The combination of structured content and rich text editing makes it perfect for blogs, 
                documentation, and any content-heavy application.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The UI is built with shadcn/ui, a collection of beautifully designed, accessible, and 
                customizable components that work seamlessly with Tailwind CSS. This ensures a consistent 
                design system while maintaining the flexibility to customize every aspect of the interface.
              </p>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/">
                Explore Posts
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
} 