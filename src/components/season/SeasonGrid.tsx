import { useState } from 'react';
import { Grid, List, Calendar, Loader2 } from 'lucide-react';
import { SeasonCard } from './SeasonCard';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Season } from '../../types/season';

interface SeasonGridProps {
  seasons: Season[];
  seriesId: number;
  seriesName: string;
  loading?: boolean;
  error?: string | null;
  cardSize?: 'small' | 'medium' | 'large';
  className?: string;
}

export const SeasonGrid = ({
  seasons,
  seriesId,
  seriesName,
  loading = false,
  error = null,
  cardSize = 'medium',
  className = ''
}: SeasonGridProps) => {
  const [sortBy, setSortBy] = useState<'season_number' | 'air_date' | 'episode_count'>('season_number');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sort seasons
  const sortedSeasons = [...seasons].sort((a, b) => {
    switch (sortBy) {
      case 'season_number':
        return a.season_number - b.season_number;
      case 'air_date':
        if (!a.air_date && !b.air_date) return a.season_number - b.season_number;
        if (!a.air_date) return 1;
        if (!b.air_date) return -1;
        return new Date(a.air_date).getTime() - new Date(b.air_date).getTime();
      case 'episode_count':
        return b.episode_count - a.episode_count;
      default:
        return a.season_number - b.season_number;
    }
  });

  const gridClasses = {
    small: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8',
    medium: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
    large: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading seasons...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <div className="text-destructive text-lg font-medium mb-2">
            Failed to load seasons
          </div>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (seasons.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <div className="text-lg font-medium text-foreground mb-2">
            No seasons available
          </div>
          <p className="text-muted-foreground">
            This show doesn't have any seasons yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{seasons.length} season{seasons.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="season_number">Season Order</SelectItem>
              <SelectItem value="air_date">Air Date</SelectItem>
              <SelectItem value="episode_count">Episode Count</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Seasons Grid/List */}
      <div className={`grid gap-4 ${viewMode === 'grid' ? gridClasses[cardSize] : 'grid-cols-1 sm:grid-cols-2'}`}>
        {sortedSeasons.map((season) => (
          <SeasonCard
            key={season.id}
            season={season}
            seriesId={seriesId}
            seriesName={seriesName}
            size={viewMode === 'list' ? 'small' : cardSize}
            showEpisodeCount={true}
            showRating={true}
          />
        ))}
      </div>
    </div>
  );
};
