import { Movie } from '../../types/movie';
import { MovieCard } from './MovieCard';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  error?: string | null;
  title?: string;
  showLoadMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
  cardSize?: 'small' | 'medium' | 'large';
  limit?: number;
}

export const MovieGrid = ({
  movies,
  loading = false,
  error = null,
  title,
  showLoadMore = false,
  hasMore = false,
  onLoadMore,
  className = '',
  cardSize = 'medium',
  limit
}: MovieGridProps) => {
  const displayedMovies = limit ? movies.slice(0, limit) : movies;

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive text-lg font-medium mb-2">
          Failed to load movies
        </div>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <section className={`py-8 ${className}`}>
      {title && (
        <div className="container mx-auto px-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h2>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {displayedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              size={cardSize}
              showRating={true}
              className="w-full h-full"
            />
          ))}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mt-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="w-full h-[340px] flex flex-col">
                <div className="flex-1 bg-muted animate-pulse rounded-lg mb-4" style={{ aspectRatio: '2/3' }} />
                <div className="space-y-2 flex-shrink-0 px-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && movies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">
              No movies found
            </div>
          </div>
        )}

        {/* Load More Button */}
        {showLoadMore && hasMore && !loading && (
          <div className="text-center mt-12">
            <Button
              onClick={onLoadMore}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Movies'
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};