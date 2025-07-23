import { Link } from 'react-router-dom';
import { ChevronRight, Film, Tv } from 'lucide-react';
import { Genre } from '../../types/genre';
import { Badge } from '../ui/badge';

interface GenreCardProps {
  genre: Genre;
  movieCount?: number;
  tvCount?: number;
  size?: 'small' | 'medium' | 'large';
  showCounts?: boolean;
  className?: string;
}

// Genre color mapping for visual variety
const GENRE_COLORS: { [key: string]: string } = {
  'Action': 'bg-gradient-to-br from-red-500 to-red-600',
  'Adventure': 'bg-gradient-to-br from-orange-500 to-orange-600',
  'Animation': 'bg-gradient-to-br from-purple-500 to-purple-600',
  'Comedy': 'bg-gradient-to-br from-yellow-500 to-yellow-600',
  'Crime': 'bg-gradient-to-br from-gray-700 to-gray-800',
  'Documentary': 'bg-gradient-to-br from-green-600 to-green-700',
  'Drama': 'bg-gradient-to-br from-blue-600 to-blue-700',
  'Family': 'bg-gradient-to-br from-pink-500 to-pink-600',
  'Fantasy': 'bg-gradient-to-br from-indigo-500 to-indigo-600',
  'History': 'bg-gradient-to-br from-amber-600 to-amber-700',
  'Horror': 'bg-gradient-to-br from-red-800 to-red-900',
  'Music': 'bg-gradient-to-br from-violet-500 to-violet-600',
  'Mystery': 'bg-gradient-to-br from-slate-600 to-slate-700',
  'Romance': 'bg-gradient-to-br from-rose-500 to-rose-600',
  'Science Fiction': 'bg-gradient-to-br from-cyan-500 to-cyan-600',
  'TV Movie': 'bg-gradient-to-br from-teal-500 to-teal-600',
  'Thriller': 'bg-gradient-to-br from-red-700 to-red-800',
  'War': 'bg-gradient-to-br from-stone-600 to-stone-700',
  'Western': 'bg-gradient-to-br from-orange-700 to-orange-800',
  // TV Genres
  'Action & Adventure': 'bg-gradient-to-br from-red-500 to-orange-500',
  'Kids': 'bg-gradient-to-br from-green-400 to-green-500',
  'News': 'bg-gradient-to-br from-blue-500 to-blue-600',
  'Reality': 'bg-gradient-to-br from-purple-400 to-purple-500',
  'Sci-Fi & Fantasy': 'bg-gradient-to-br from-cyan-400 to-indigo-500',
  'Soap': 'bg-gradient-to-br from-pink-400 to-pink-500',
  'Talk': 'bg-gradient-to-br from-emerald-500 to-emerald-600',
  'War & Politics': 'bg-gradient-to-br from-stone-500 to-stone-600'
};

const getGenreColor = (genreName: string): string => {
  return GENRE_COLORS[genreName] || 'bg-gradient-to-br from-gray-500 to-gray-600';
};

export const GenreCard = ({
  genre,
  movieCount,
  tvCount,
  size = 'medium',
  showCounts = true,
  className = ''
}: GenreCardProps) => {
  const sizeClasses = {
    small: 'h-24 p-4',
    medium: 'h-32 p-6',
    large: 'h-40 p-8'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const iconSizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const totalCount = (movieCount || 0) + (tvCount || 0);

  return (
    <Link
      to={`/genre/${genre.id}`}
      className={`
        group relative overflow-hidden rounded-lg cinema-shadow
        hover:scale-105 cinema-transition cursor-pointer
        ${getGenreColor(genre.name)} ${sizeClasses[size]} ${className}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full translate-y-6 -translate-x-6" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between text-white">
        <div className="flex items-start justify-between">
          <h3 className={`font-bold text-white line-clamp-2 ${textSizeClasses[size]}`}>
            {genre.name}
          </h3>
          <ChevronRight className={`${iconSizeClasses[size]} opacity-0 group-hover:opacity-100 cinema-transition flex-shrink-0 ml-2`} />
        </div>

        {showCounts && (totalCount > 0 || movieCount !== undefined || tvCount !== undefined) && (
          <div className="flex items-center gap-2 mt-2">
            {movieCount !== undefined && movieCount > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                <Film className="w-3 h-3 mr-1" />
                {movieCount}
              </Badge>
            )}
            {tvCount !== undefined && tvCount > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                <Tv className="w-3 h-3 mr-1" />
                {tvCount}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 cinema-transition" />
    </Link>
  );
};

// Export the genre colors for use in other components
export { GENRE_COLORS, getGenreColor };
