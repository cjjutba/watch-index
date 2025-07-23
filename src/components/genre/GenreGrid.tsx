import { useState } from 'react';
import { Filter, Grid, List, Loader2 } from 'lucide-react';
import { GenreCard } from './GenreCard';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Genre } from '../../types/genre';

interface GenreGridProps {
  movieGenres: Genre[];
  tvGenres: Genre[];
  loading?: boolean;
  error?: string | null;
  showTabs?: boolean;
  cardSize?: 'small' | 'medium' | 'large';
  className?: string;
}

export const GenreGrid = ({
  movieGenres,
  tvGenres,
  loading = false,
  error = null,
  showTabs = true,
  cardSize = 'medium',
  className = ''
}: GenreGridProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'tv'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'popularity'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Combine and deduplicate genres
  const allGenres = [...movieGenres, ...tvGenres].reduce((acc, genre) => {
    if (!acc.find(g => g.id === genre.id)) {
      acc.push(genre);
    }
    return acc;
  }, [] as Genre[]);

  // Sort genres
  const sortGenres = (genres: Genre[]) => {
    return [...genres].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // For popularity, we'll use the order from TMDB (which is already sorted by popularity)
      return 0;
    });
  };

  const getDisplayGenres = () => {
    switch (activeTab) {
      case 'movies':
        return sortGenres(movieGenres);
      case 'tv':
        return sortGenres(tvGenres);
      default:
        return sortGenres(allGenres);
    }
  };

  const displayGenres = getDisplayGenres();

  const gridClasses = {
    small: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
    medium: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    large: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading genres...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <div className="text-destructive text-lg font-medium mb-2">
            Failed to load genres
          </div>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {showTabs && (
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full sm:w-auto">
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger value="all">All Genres</TabsTrigger>
              <TabsTrigger value="movies">Movies</TabsTrigger>
              <TabsTrigger value="tv">TV Shows</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <div className="flex items-center gap-4">
          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">A-Z</SelectItem>
              <SelectItem value="popularity">Popular</SelectItem>
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

      {/* Genre Count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span>
          {displayGenres.length} {activeTab === 'all' ? 'genres' : activeTab === 'movies' ? 'movie genres' : 'TV genres'}
        </span>
      </div>

      {/* Genres Grid/List */}
      {displayGenres.length > 0 ? (
        <div className={`grid gap-4 ${viewMode === 'grid' ? gridClasses[cardSize] : 'grid-cols-1 sm:grid-cols-2'}`}>
          {displayGenres.map((genre) => (
            <GenreCard
              key={genre.id}
              genre={genre}
              size={viewMode === 'list' ? 'small' : cardSize}
              showCounts={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-lg font-medium text-foreground mb-2">
            No genres found
          </div>
          <p className="text-muted-foreground">
            Try switching to a different tab above
          </p>
        </div>
      )}
    </div>
  );
};
