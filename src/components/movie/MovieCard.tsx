import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Calendar, Clock, Film } from 'lucide-react';
import { Movie } from '../../types/movie';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import tmdbApi from '../../services/tmdbApi';
import { useFavorites, FavoriteItem } from '../../contexts/FavoritesContext';

interface MovieCardProps {
  movie: Movie & { media_type?: string; name?: string; first_air_date?: string };
  size?: 'small' | 'medium' | 'large';
  showRating?: boolean;
  showGenres?: boolean;
  className?: string;
  linkTo?: string;
}

export const MovieCard = ({
  movie,
  size = 'medium',
  showRating = true,
  showGenres = false,
  className = '',
  linkTo
}: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const sizeClasses = {
    small: 'w-40 h-[280px]',
    medium: 'w-48 h-[340px]',
    large: 'w-56 h-[400px]'
  };

  // Detect if this is a TV show or movie
  const isTV = movie.media_type === 'tv' || !!(movie as any).name || !!(movie as any).first_air_date;
  const displayTitle = isTV ? (movie as any).name || movie.title : movie.title;
  const displayDate = isTV ? (movie as any).first_air_date || movie.release_date : movie.release_date;

  // Handle poster URL with better fallback
  const hasPoster = movie.poster_path && movie.poster_path.trim() !== '';
  const posterUrl = hasPoster ? tmdbApi.getImageURL(movie.poster_path, 'w500') : null;
  const releaseYear = displayDate ? new Date(displayDate).getFullYear() : 'TBA';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  // Generate the correct route based on content type
  const detailRoute = linkTo || (isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`);

  // Check if this item is favorited
  const itemIsFavorited = isFavorite(movie.id, isTV ? 'tv' : 'movie');

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const favoriteItem: FavoriteItem = {
      id: movie.id,
      title: displayTitle,
      name: isTV ? (movie as any).name : undefined,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: isTV ? undefined : movie.release_date,
      first_air_date: isTV ? (movie as any).first_air_date : undefined,
      vote_average: movie.vote_average,
      overview: movie.overview,
      media_type: isTV ? 'tv' : 'movie',
      genre_ids: movie.genre_ids,
      genres: movie.genres
    };

    if (itemIsFavorited) {
      removeFromFavorites(movie.id, isTV ? 'tv' : 'movie');
    } else {
      addToFavorites(favoriteItem);
    }
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <Card
        className="group relative overflow-hidden bg-card cinema-shadow cinema-transition hover:scale-105 hover:cinema-shadow h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={detailRoute} className="block h-full flex flex-col">
          {/* Poster Image */}
          <div className="relative flex-1 overflow-hidden" style={{ aspectRatio: '2/3' }}>
            {posterUrl && !imageError ? (
              <img
                src={posterUrl}
                alt={displayTitle}
                className={`w-full h-full object-cover cinema-transition group-hover:scale-110 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-center p-4">
                <Film className="w-12 h-12 text-muted-foreground mb-2" />
                <span className="text-muted-foreground text-sm font-medium">{displayTitle}</span>
                <span className="text-muted-foreground text-xs mt-1">No Image Available</span>
              </div>
            )}

            {/* Loading skeleton */}
            {posterUrl && !imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}

            {/* Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`} />

            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`absolute top-2 right-2 p-2 transition-all duration-300 ${
                isHovered || itemIsFavorited ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
              }`}
              onClick={handleFavoriteToggle}
            >
              <Heart
                className={`w-4 h-4 ${
                  itemIsFavorited ? 'fill-red-500 text-red-500' : 'text-white hover:text-red-500'
                }`}
              />
            </Button>

            {/* Rating Badge */}
            {showRating && movie.vote_average > 0 && (
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                <Star className="w-3 h-3 text-primary fill-current" />
                <span className="text-white text-xs font-medium">{rating}</span>
              </div>
            )}

            {/* Hover Details */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 text-white transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {movie.overview && (
                <p className="text-sm line-clamp-3 mb-2">
                  {movie.overview}
                </p>
              )}
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{releaseYear}</span>
                </div>
                {movie.runtime && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{movie.runtime}m</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Movie Info */}
          <div className="p-4 flex-shrink-0">
            <div className="h-12 mb-2 flex items-start">
              <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-tight group-hover:text-primary cinema-transition">
                {displayTitle}
              </h3>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{releaseYear}</span>
              {showRating && movie.vote_average > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-primary fill-current" />
                  <span>{rating}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {showGenres && movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {movie.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre.id}
                    className="inline-block bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
                {movie.genres.length > 2 && (
                  <span className="inline-block bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                    +{movie.genres.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      </Card>
    </div>
  );
};