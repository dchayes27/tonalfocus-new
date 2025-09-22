/**
 * src/app/portfolio/loading.tsx
 * -----------------------------
 * Loading skeleton for the portfolio page.
 * Shown during navigation while the page is being loaded.
 */

export default function PortfolioLoading() {
  return (
    <>
      {/* Page Header */}
      <div className="bg-primary-beige py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-charcoal text-center">
            PORTFOLIO
          </h1>
          <p className="text-center mt-4 max-w-2xl mx-auto text-primary-charcoal/80">
            Film photography exploring light, shadow, and the spaces between.
          </p>
        </div>
      </div>

      {/* Loading Skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-20">
          {/* Black & White Section Skeleton */}
          <section>
            <div className="h-8 w-48 bg-gray-200 rounded mb-8 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="aspect-[4/3] bg-gray-200 rounded animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Color Section Skeleton */}
          <section>
            <div className="h-8 w-32 bg-gray-200 rounded mb-8 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="aspect-[4/3] bg-gray-200 rounded animate-pulse"
                  style={{ animationDelay: `${(i + 6) * 100}ms` }}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
