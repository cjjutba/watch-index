import { Link } from 'react-router-dom';
import { Calendar, Star, Play, Clock } from 'lucide-react';
import { Season } from '../../types/season';
import { Badge } from '../ui/badge';
import { getSeasonTitle } from '../../types/season';
import tmdbApi from '../../services/tmdbApi';

interface SeasonCardProps {
  season: Season;
  seriesId: number;
  seriesName: string;
  size?: 'small' | 'medium' | 'large';
  showEpisodeCount?: boolean;
  showRating?: boolean;
  className?: string;
}

export const SeasonCard = ({
  season,
  seriesId,
  seriesName,
  size = 'medium',
  showEpisodeCount = true,
  showRating = true,
  className = ''
}: SeasonCardProps) => {
  const posterUrl = season.poster_path 
    ? tmdbApi.getImageURL(season.poster_path, 'w342')
    : null;

  const sizeClasses = {
    small: 'w-32',
    medium: 'w-48',
    large: 'w-64'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const seasonTitle = getSeasonTitle(season.season_number, season.name);
  const airYear = season.air_date ? new Date(season.air_date).getFullYear() : null;

  return (
    <Link
      to={`/tv/${seriesId}/season/${season.season_number}`}
      className={`
        group block ${sizeClasses[size]} cinema-transition
        hover:scale-105 ${className}
      `}
    >
      <div className="bg-card rounded-lg cinema-shadow overflow-hidden">
        {/* Poster */}
        <div className="aspect-[2/3] bg-muted relative overflow-hidden">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${seriesName} - ${seasonTitle}`}
              className="w-full h-full object-cover group-hover:scale-110 cinema-transition"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          
          {/* Fallback */}
          <div className={`${posterUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full bg-muted text-muted-foreground`}>
            <Play className="w-12 h-12" />
          </div>

          {/* Overlay with season number */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-black/70 text-white border-none">
              {season.season_number === 0 ? 'SP' : `S${season.season_number}`}
            </Badge>
          </div>

          {/* Rating */}
          {showRating && season.vote_average > 0 && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-black/70 text-white border-none flex items-center">
                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                {season.vote_average.toFixed(1)}
              </Badge>
            </div>
          )}

          {/* Episode Count */}
          {showEpisodeCount && (
            <div className="absolute bottom-2 right-2">
              <Badge variant="secondary" className="bg-black/70 text-white border-none flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {season.episode_count} ep{season.episode_count !== 1 ? 's' : ''}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className={`font-semibold text-foreground line-clamp-2 mb-2 ${textSizeClasses[size]}`}>
            {seasonTitle}
          </h3>
          
          {season.air_date && (
            <div className="flex items-center text-muted-foreground text-sm mb-2">
              <Calendar className="w-4 h-4 mr-1" />
              {airYear}
            </div>
          )}

          {season.overview && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {season.overview}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
