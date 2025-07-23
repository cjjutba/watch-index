import { Link } from 'react-router-dom';
import { ChevronRight, Loader2, Tags } from 'lucide-react';
import { GenreCard } from './GenreCard';
import { MovieCard } from '../movie/MovieCard';
import { Button } from '../ui/button';
import { useGenres } from '../../hooks/useAdvancedSearch';
import { usePopularGenreContent } from '../../hooks/useGenres';

interface GenreSectionProps {
  featuredGenres?: number[];
  maxGenres?: number;
  showContent?: boolean;
  className?: string;
}

// Popular genre IDs for featured display
const DEFAULT_FEATURED_GENRES = [
  28, // Action
  35, // Comedy
  18, // Drama
  27, // Horror
  878, // Science Fiction
  10749, // Romance
  16, // Animation
  53 // Thriller
];

export const GenreSection = ({
  featuredGenres = DEFAULT_FEATURED_GENRES,
  maxGenres = 8,
  showContent = false,
  className = ''
}: GenreSectionProps) => {
  const { movieGenres, tvGenres, loading: genresLoading } = useGenres();
  const { content, loading: contentLoading } = usePopularGenreContent(
    showContent ? featuredGenres.slice(0, 4) : [],
    6
  );

  // Get featured genres from the loaded genre lists
  const getFeaturedGenres = () => {
    const allGenres = [...movieGenres, ...tvGenres];
    const genreMap = new Map(allGenres.map(g => [g.id, g]));
    
    return featuredGenres
      .map(id => genreMap.get(id))
      .filter(Boolean)
      .slice(0, maxGenres) as any[];
  };

  const displayGenres = getFeaturedGenres();

  if (genresLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground flex items-center">
            <Tags className="w-6 h-6 mr-2 text-primary" />
            Browse by Genre
          </h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading genres...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center">
          <Tags className="w-6 h-6 mr-2 text-primary" />
          Browse by Genre
        </h2>
        <Button variant="ghost" asChild>
          <Link to="/genres" className="flex items-center">
            View All Genres
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>

      {/* Featured Genres Grid */}
      {displayGenres.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {displayGenres.map((genre) => (
            <GenreCard
              key={genre.id}
              genre={genre}
              size="medium"
              showCounts={false}
            />
          ))}
        </div>
      )}

      {/* Genre Content Sections */}
      {showContent && !contentLoading && Object.keys(content).length > 0 && (
        <div className="space-y-12">
          {Object.entries(content).map(([genreId, genreData]) => {
            if (!genreData.genre || (genreData.movies.length === 0 && genreData.tvShows.length === 0)) {
              return null;
            }

            return (
              <div key={genreId} className="space-y-4">
                {/* Genre Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">
                    Popular {genreData.genre.name}
                  </h3>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/genre/${genreId}`} className="flex items-center">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {/* Movies */}
                  {genreData.movies.map((movie) => (
                    <MovieCard
                      key={`movie-${movie.id}`}
                      movie={movie}
                      size="small"
                      showRating={true}
                    />
                  ))}
                  
                  {/* TV Shows */}
                  {genreData.tvShows.map((show) => (
                    <MovieCard
                      key={`tv-${show.id}`}
                      movie={{
                        id: show.id,
                        title: show.name || show.original_name || '',
                        original_title: show.original_name || show.name || '',
                        overview: show.overview,
                        poster_path: show.poster_path,
                        backdrop_path: show.backdrop_path,
                        release_date: show.first_air_date || '',
                        vote_average: show.vote_average,
                        vote_count: show.vote_count,
                        genre_ids: show.genre_ids,
                        adult: false,
                        popularity: show.popularity,
                        original_language: show.original_language || 'en',
                        video: false
                      }}
                      size="small"
                      showRating={true}
                      linkTo={`/tv/${show.id}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Loading Content */}
      {showContent && contentLoading && (
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 bg-muted rounded w-48 animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center pt-8">
        <p className="text-muted-foreground mb-4">
          Discover thousands of movies and TV shows organized by genre
        </p>
        <Button asChild>
          <Link to="/genres">
            Explore All Genres
          </Link>
        </Button>
      </div>
    </div>
  );
};
