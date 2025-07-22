import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { SearchComponent } from "@/components/search";
import { ResponsiveNav } from "@/components/responsive-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "My Blog - Next.js & Sanity CMS",
  description: "A modern blog built with Next.js, Sanity CMS, and shadcn/ui",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Responsive Navigation */}
        <ResponsiveNav />

        {/* Main Content */}
        {children}

        {/* Footer */}
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  © 2024 My Blog. Built with{" "}
                  <Link href="https://nextjs.org" className="font-medium underline underline-offset-4 hover:text-primary">
                    Next.js
                  </Link>
                  ,{" "}
                  <Link href="https://sanity.io" className="font-medium underline underline-offset-4 hover:text-primary">
                    Sanity CMS
                  </Link>
                  , and{" "}
                  <Link href="https://ui.shadcn.com" className="font-medium underline underline-offset-4 hover:text-primary">
                    shadcn/ui
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
