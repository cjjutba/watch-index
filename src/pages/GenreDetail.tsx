import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter, Grid, List, Loader2, Tags } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { MovieCard } from '../components/movie/MovieCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useGenreContent } from '../hooks/useGenres';
import { useGenres } from '../hooks/useAdvancedSearch';
import { getGenreColor } from '../components/genre/GenreCard';
import { MOVIE_SORT_OPTIONS, TV_SORT_OPTIONS } from '../types/genre';

const GenreDetail = () => {
  const { id } = useParams<{ id: string }>();
  const genreId = id ? parseInt(id) : null;
  
  const [activeTab, setActiveTab] = useState<'movies' | 'tv'>('movies');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { movieGenres, tvGenres, loading: genresLoading } = useGenres();
  const { movies, tvShows, isLoading, hasError, refresh } = useGenreContent(genreId, sortBy);

  // Find the genre info
  const allGenres = [...movieGenres, ...tvGenres];
  const genre = allGenres.find(g => g.id === genreId);

  const currentSortOptions = activeTab === 'movies' ? MOVIE_SORT_OPTIONS : TV_SORT_OPTIONS;
  const currentData = activeTab === 'movies' ? movies : tvShows;

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleLoadMore = () => {
    if (activeTab === 'movies') {
      movies.loadMore();
    } else {
      tvShows.loadMore();
    }
  };

  if (genresLoading || !genre) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading genre...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/genres" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Genres
            </Link>
          </Button>
        </div>

        {/* Genre Header */}
        <div className="mb-8">
          <div 
            className={`
              relative overflow-hidden rounded-lg p-8 mb-6
              ${getGenreColor(genre.name)}
            `}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <Tags className="w-8 h-8 text-white" />
                <h1 className="text-4xl font-bold text-white">{genre.name}</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {movies.totalResults} Movies
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {tvShows.totalResults} TV Shows
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full sm:w-auto">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="movies" className="flex items-center">
                Movies
                {movies.totalResults > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {movies.totalResults}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="tv" className="flex items-center">
                TV Shows
                {tvShows.totalResults > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {tvShows.totalResults}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentSortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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

        {/* Content */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
          {/* Movies Tab */}
          <TabsContent value="movies" className="mt-0">
            {hasError ? (
              <div className="text-center py-12">
                <div className="text-destructive text-lg font-medium mb-2">
                  Failed to load movies
                </div>
                <p className="text-muted-foreground mb-4">{movies.error}</p>
                <Button onClick={() => refresh()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : movies.movies.length > 0 ? (
              <>
                <div className={`grid gap-4 mb-8 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {movies.movies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      size={viewMode === 'grid' ? 'medium' : 'large'}
                      showRating={true}
                    />
                  ))}
                </div>

                {movies.hasMore && (
                  <div className="text-center">
                    <Button
                      onClick={handleLoadMore}
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
            ) : isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading movies...</span>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-lg font-medium text-foreground mb-2">
                  No {genre.name.toLowerCase()} movies found
                </div>
                <p className="text-muted-foreground">
                  Try adjusting the sort order or check back later
                </p>
              </div>
            )}
          </TabsContent>

          {/* TV Shows Tab */}
          <TabsContent value="tv" className="mt-0">
            {hasError ? (
              <div className="text-center py-12">
                <div className="text-destructive text-lg font-medium mb-2">
                  Failed to load TV shows
                </div>
                <p className="text-muted-foreground mb-4">{tvShows.error}</p>
                <Button onClick={() => refresh()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : tvShows.tvShows.length > 0 ? (
              <>
                <div className={`grid gap-4 mb-8 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {tvShows.tvShows.map((show) => (
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
                      size={viewMode === 'grid' ? 'medium' : 'large'}
                      showRating={true}
                      linkTo={`/tv/${show.id}`}
                    />
                  ))}
                </div>

                {tvShows.hasMore && (
                  <div className="text-center">
                    <Button
                      onClick={handleLoadMore}
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
            ) : isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading TV shows...</span>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-lg font-medium text-foreground mb-2">
                  No {genre.name.toLowerCase()} TV shows found
                </div>
                <p className="text-muted-foreground">
                  Try adjusting the sort order or check back later
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default GenreDetail;
