import { Link } from 'react-router-dom';
import { Calendar, Star, Clock, Play } from 'lucide-react';
import { Episode } from '../../types/season';
import { Badge } from '../ui/badge';
import { formatEpisodeNumber, formatRuntime, getEpisodeStatus } from '../../types/season';
import tmdbApi from '../../services/tmdbApi';

interface EpisodeCardProps {
  episode: Episode;
  seriesId: number;
  seriesName: string;
  seasonName?: string;
  layout?: 'horizontal' | 'vertical';
  showDescription?: boolean;
  showRating?: boolean;
  showRuntime?: boolean;
  className?: string;
}

export const EpisodeCard = ({
  episode,
  seriesId,
  seriesName,
  seasonName,
  layout = 'horizontal',
  showDescription = true,
  showRating = true,
  showRuntime = true,
  className = ''
}: EpisodeCardProps) => {
  const stillUrl = episode.still_path 
    ? tmdbApi.getImageURL(episode.still_path, 'w300')
    : null;

  const episodeCode = formatEpisodeNumber(episode.season_number, episode.episode_number);
  const status = getEpisodeStatus(episode);
  const airDate = episode.air_date ? new Date(episode.air_date) : null;
  const isUpcoming = status === 'upcoming';

  const linkTo = `/tv/${seriesId}/season/${episode.season_number}/episode/${episode.episode_number}`;

  if (layout === 'vertical') {
    return (
      <Link
        to={linkTo}
        className={`
          group block bg-card rounded-lg cinema-shadow overflow-hidden
          hover:scale-105 cinema-transition ${className}
        `}
      >
        {/* Still Image */}
        <div className="aspect-video bg-muted relative overflow-hidden">
          {stillUrl ? (
            <img
              src={stillUrl}
              alt={`${seriesName} - ${episode.name}`}
              className="w-full h-full object-cover group-hover:scale-110 cinema-transition"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          
          {/* Fallback */}
          <div className={`${stillUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full bg-muted text-muted-foreground`}>
            <Play className="w-8 h-8" />
          </div>

          {/* Episode Number */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-black/70 text-white border-none">
              {episodeCode}
            </Badge>
          </div>

          {/* Rating */}
          {showRating && episode.vote_average > 0 && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-black/70 text-white border-none flex items-center">
                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                {episode.vote_average.toFixed(1)}
              </Badge>
            </div>
          )}

          {/* Runtime */}
          {showRuntime && episode.runtime && (
            <div className="absolute bottom-2 right-2">
              <Badge variant="secondary" className="bg-black/70 text-white border-none flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatRuntime(episode.runtime)}
              </Badge>
            </div>
          )}

          {/* Upcoming Overlay */}
          {isUpcoming && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="bg-blue-600 text-white">
                Upcoming
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
            {episode.name}
          </h3>
          
          {episode.air_date && (
            <div className="flex items-center text-muted-foreground text-sm mb-2">
              <Calendar className="w-4 h-4 mr-1" />
              {airDate?.toLocaleDateString()}
            </div>
          )}

          {showDescription && episode.overview && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {episode.overview}
            </p>
          )}
        </div>
      </Link>
    );
  }

  // Horizontal layout
  return (
    <Link
      to={linkTo}
      className={`
        group flex bg-card rounded-lg cinema-shadow overflow-hidden
        hover:shadow-lg cinema-transition ${className}
      `}
    >
      {/* Still Image */}
      <div className="w-48 aspect-video bg-muted relative overflow-hidden flex-shrink-0">
        {stillUrl ? (
          <img
            src={stillUrl}
            alt={`${seriesName} - ${episode.name}`}
            className="w-full h-full object-cover group-hover:scale-110 cinema-transition"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        
        {/* Fallback */}
        <div className={`${stillUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full bg-muted text-muted-foreground`}>
          <Play className="w-6 h-6" />
        </div>

        {/* Episode Number */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-black/70 text-white border-none text-xs">
            {episodeCode}
          </Badge>
        </div>

        {/* Upcoming Overlay */}
        {isUpcoming && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
              Upcoming
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground line-clamp-2 flex-1 mr-2">
            {episode.name}
          </h3>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {showRating && episode.vote_average > 0 && (
              <Badge variant="outline" className="flex items-center">
                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                {episode.vote_average.toFixed(1)}
              </Badge>
            )}
            
            {showRuntime && episode.runtime && (
              <Badge variant="outline" className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatRuntime(episode.runtime)}
              </Badge>
            )}
          </div>
        </div>
        
        {episode.air_date && (
          <div className="flex items-center text-muted-foreground text-sm mb-2">
            <Calendar className="w-4 h-4 mr-1" />
            {airDate?.toLocaleDateString()}
          </div>
        )}

        {showDescription && episode.overview && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {episode.overview}
          </p>
        )}
      </div>
    </Link>
  );
};
