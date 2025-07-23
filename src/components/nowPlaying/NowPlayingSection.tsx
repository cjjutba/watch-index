import { useState } from 'react';
import { Play, Calendar, Clock, MapPin, Loader2, RefreshCw } from 'lucide-react';
import { MovieCard } from '../movie/MovieCard';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useNowPlayingContent } from '../../hooks/useNowPlaying';
import { useUserRegion } from '../../hooks/useWatchProviders';
import { COMMON_REGIONS } from '../../types/watchProvider';

interface NowPlayingSectionProps {
  showTabs?: boolean;
  maxItems?: number;
  showLoadMore?: boolean;
  className?: string;
}

export const NowPlayingSection = ({
  showTabs = true,
  maxItems,
  showLoadMore = false,
  className = ''
}: NowPlayingSectionProps) => {
  const { userRegion, updateUserRegion } = useUserRegion();
  const { movies, tvShows, isLoading, hasError, refresh } = useNowPlayingContent(userRegion);
  const [activeTab, setActiveTab] = useState<'movies' | 'tv'>('movies');

  const getRegionName = (code: string) => {
    const region = COMMON_REGIONS.find(r => r.code === code);
    return region ? region.name : code;
  };

  const handleRegionChange = (newRegion: string) => {
    updateUserRegion(newRegion);
  };

  const displayMovies = maxItems ? movies.movies.slice(0, maxItems) : movies.movies;
  const displayTVShows = maxItems ? tvShows.tvShows.slice(0, maxItems) : tvShows.tvShows;

  if (isLoading && movies.movies.length === 0 && tvShows.tvShows.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground flex items-center">
            <Play className="w-6 h-6 mr-2 text-primary" />
            Now Playing
          </h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading now playing content...</span>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground flex items-center">
            <Play className="w-6 h-6 mr-2 text-primary" />
            Now Playing
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            className="flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
        <div className="text-center py-12">
          <div className="text-destructive text-lg font-medium mb-2">
            Failed to load content
          </div>
          <p className="text-muted-foreground">
            {movies.error || tvShows.error || 'Something went wrong'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center">
          <Play className="w-6 h-6 mr-2 text-primary" />
          Now Playing
        </h2>
        
        <div className="flex items-center gap-4">
          {/* Region Selector */}
          <Select value={userRegion} onValueChange={handleRegionChange}>
            <SelectTrigger className="w-48">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMMON_REGIONS.map((region) => (
                <SelectItem key={region.code} value={region.code}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={isLoading}
            className="flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      {showTabs ? (
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="movies" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                In Theaters
                {movies.totalResults > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {movies.totalResults}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="tv" className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Airing Today
                {tvShows.totalResults > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {tvShows.totalResults}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Movies Tab */}
          <TabsContent value="movies" className="mt-0">
            {displayMovies.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {displayMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      size="medium"
                      showRating={true}
                    />
                  ))}
                </div>
                
                {showLoadMore && movies.hasMore && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={movies.loadMore}
                      disabled={movies.loading}
                      variant="outline"
                      size="lg"
                    >
                      {movies.loading ? (
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
              </>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <div className="text-lg font-medium text-foreground mb-2">
                  No movies playing in {getRegionName(userRegion)}
                </div>
                <p className="text-muted-foreground">
                  Try selecting a different region above
                </p>
              </div>
            )}
          </TabsContent>

          {/* TV Shows Tab */}
          <TabsContent value="tv" className="mt-0">
            {displayTVShows.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {displayTVShows.map((show) => (
                    <MovieCard
                      key={show.id}
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
                      size="medium"
                      showRating={true}
                      linkTo={`/tv/${show.id}`}
                    />
                  ))}
                </div>
                
                {showLoadMore && tvShows.hasMore && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={tvShows.loadMore}
                      disabled={tvShows.loading}
                      variant="outline"
                      size="lg"
                    >
                      {tvShows.loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load More Shows'
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <div className="text-lg font-medium text-foreground mb-2">
                  No shows airing today
                </div>
                <p className="text-muted-foreground">
                  Check back later for today's TV schedule
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        // Simple grid without tabs
        <div className="space-y-8">
          {/* Movies Section */}
          {displayMovies.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                In Theaters ({movies.totalResults})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {displayMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    size="medium"
                    showRating={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TV Shows Section */}
          {displayTVShows.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Airing Today ({tvShows.totalResults})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {displayTVShows.map((show) => (
                  <MovieCard
                    key={show.id}
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
                    size="medium"
                    showRating={true}
                    linkTo={`/tv/${show.id}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
