import { useState } from 'react';
import { Grid, List, Calendar, Clock, Star, Filter } from 'lucide-react';
import { EpisodeCard } from './EpisodeCard';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Episode } from '../../types/season';
import { getEpisodeStatus } from '../../types/season';

interface EpisodeListProps {
  episodes: Episode[];
  seriesId: number;
  seriesName: string;
  seasonName?: string;
  loading?: boolean;
  error?: string | null;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export const EpisodeList = ({
  episodes,
  seriesId,
  seriesName,
  seasonName,
  loading = false,
  error = null,
  layout = 'horizontal',
  className = ''
}: EpisodeListProps) => {
  const [sortBy, setSortBy] = useState<'episode_number' | 'air_date' | 'rating'>('episode_number');
  const [filterBy, setFilterBy] = useState<'all' | 'aired' | 'upcoming'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(layout === 'vertical' ? 'grid' : 'list');

  // Filter episodes
  const filteredEpisodes = episodes.filter(episode => {
    if (filterBy === 'all') return true;
    const status = getEpisodeStatus(episode);
    return filterBy === 'aired' ? status === 'aired' : status === 'upcoming';
  });

  // Sort episodes
  const sortedEpisodes = [...filteredEpisodes].sort((a, b) => {
    switch (sortBy) {
      case 'episode_number':
        return a.episode_number - b.episode_number;
      case 'air_date':
        if (!a.air_date && !b.air_date) return a.episode_number - b.episode_number;
        if (!a.air_date) return 1;
        if (!b.air_date) return -1;
        return new Date(a.air_date).getTime() - new Date(b.air_date).getTime();
      case 'rating':
        return b.vote_average - a.vote_average;
      default:
        return a.episode_number - b.episode_number;
    }
  });

  // Statistics
  const airedCount = episodes.filter(ep => getEpisodeStatus(ep) === 'aired').length;
  const upcomingCount = episodes.filter(ep => getEpisodeStatus(ep) === 'upcoming').length;
  const averageRating = episodes.length > 0 
    ? episodes.reduce((sum, ep) => sum + ep.vote_average, 0) / episodes.length 
    : 0;

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-48 aspect-video bg-muted rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <div className="text-destructive text-lg font-medium mb-2">
            Failed to load episodes
          </div>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <div className="text-lg font-medium text-foreground mb-2">
            No episodes available
          </div>
          <p className="text-muted-foreground">
            This season doesn't have any episodes yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistics */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{episodes.length} episode{episodes.length !== 1 ? 's' : ''}</span>
        </div>
        
        {airedCount > 0 && (
          <Badge variant="outline" className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {airedCount} aired
          </Badge>
        )}
        
        {upcomingCount > 0 && (
          <Badge variant="outline" className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {upcomingCount} upcoming
          </Badge>
        )}
        
        {averageRating > 0 && (
          <Badge variant="outline" className="flex items-center">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            {averageRating.toFixed(1)} avg
          </Badge>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Filter */}
          <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="aired">Aired</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="episode_number">Episode Order</SelectItem>
              <SelectItem value="air_date">Air Date</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

      {/* Episodes */}
      {sortedEpisodes.length > 0 ? (
        <div className={`space-y-4 ${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'space-y-4'
        }`}>
          {sortedEpisodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              seriesId={seriesId}
              seriesName={seriesName}
              seasonName={seasonName}
              layout={viewMode === 'grid' ? 'vertical' : 'horizontal'}
              showDescription={true}
              showRating={true}
              showRuntime={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-lg font-medium text-foreground mb-2">
            No episodes match the current filter
          </div>
          <p className="text-muted-foreground">
            Try changing the filter options above
          </p>
        </div>
      )}
    </div>
  );
};
