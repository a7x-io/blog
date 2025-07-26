import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function PostSkeleton() {
  return (
    <Card className="overflow-hidden shadow-soft bg-white h-full flex flex-col min-h-[400px] w-full">
      {/* Image skeleton */}
      <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
        <Skeleton className="w-full h-full" />
        {/* Category badge skeleton */}
        <div className="absolute top-4 left-4">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
      
      <CardHeader className="pb-4 flex-shrink-0 px-6">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-4 w-4/5" />
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col justify-end px-6">
        {/* Author and date skeleton */}
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        
        {/* Button skeleton */}
        <Skeleton className="w-full h-9 rounded-md" />
      </CardContent>
    </Card>
  )
}

export function HeroPostSkeleton() {
  return (
    <Card className="overflow-hidden shadow-medium">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Image skeleton */}
        <div className="relative h-64 lg:h-full overflow-hidden">
          <Skeleton className="w-full h-full" />
          {/* Category badges skeleton */}
          <div className="absolute top-6 left-6 flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="p-8 flex flex-col justify-center">
          {/* Title skeleton */}
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-6" />
          
          {/* Author and date skeleton */}
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          
          {/* Button skeleton */}
          <Skeleton className="w-32 h-12 rounded-md" />
        </div>
      </div>
    </Card>
  )
}

export function CategorySkeleton() {
  return (
    <div className="h-auto py-3 px-4 flex flex-col items-center gap-1">
      <Skeleton className="h-4 w-16 mb-1" />
      <Skeleton className="h-3 w-12" />
    </div>
  )
}

export function PostGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`skeleton-stagger-${(index % 6) + 1} h-full w-full`}>
          <PostSkeleton />
        </div>
      ))}
    </div>
  )
} 