import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, Loader2, Compass } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { AdvancedSearchForm } from '../components/search/AdvancedSearchForm';
import { MovieCard } from '../components/movie/MovieCard';
import { PersonCard } from '../components/person/PersonCard';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useGenres, useDiscoverMovies, useDiscoverTV, useAdvancedSearch } from '../hooks/useAdvancedSearch';
import { DiscoverFilters } from '../types/genre';
import { Movie } from '../types/movie';
import { TVShow } from '../types/tvshow';

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'discover' | 'search'>('discover');
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFilters, setCurrentFilters] = useState<DiscoverFilters>({});

  // Get initial query from URL
  const initialQuery = searchParams.get('q') || '';
  
  // Hooks
  const { movieGenres, tvGenres, loading: genresLoading } = useGenres();
  const { 
    movies, 
    loading: moviesLoading, 
    error: moviesError, 
    loadMore: loadMoreMovies, 
    hasMore: hasMoreMovies,
    totalResults: movieResults,
    refresh: refreshMovies
  } = useDiscoverMovies(mediaType === 'movie' ? currentFilters : {});
  
  const { 
    tvShows, 
    loading: tvLoading, 
    error: tvError, 
    loadMore: loadMoreTV, 
    hasMore: hasMoreTV,
    totalResults: tvResults,
    refresh: refreshTV
  } = useDiscoverTV(mediaType === 'tv' ? currentFilters : {});

  const {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
    search,
    totalResults: searchTotalResults,
    loadMore: loadMoreSearch,
    hasMore: hasMoreSearch
  } = useAdvancedSearch();

  // Track if initial search has been performed
  const initialSearchPerformed = useRef(false);

  // Set initial tab based on URL query and trigger search
  useEffect(() => {
    if (initialQuery && !initialSearchPerformed.current) {
      setActiveTab('search');
      // Trigger the search with the initial query
      search(initialQuery, {}, 'multi');
      initialSearchPerformed.current = true;
    }
  }, [initialQuery, search]);

  const handleSearch = (query: string, filters: DiscoverFilters, searchType: 'multi' | 'movie' | 'tv' | 'person') => {
    search(query, filters, searchType);
    setActiveTab('search');
    
    // Update URL
    const newSearchParams = new URLSearchParams();
    if (query) newSearchParams.set('q', query);
    setSearchParams(newSearchParams);
  };

  const handleDiscoverFilters = (filters: DiscoverFilters) => {
    setCurrentFilters(filters);
    if (mediaType === 'movie') {
      refreshMovies(filters);
    } else {
      refreshTV(filters);
    }
  };

  const handleLoadMore = () => {
    if (mediaType === 'movie' && hasMoreMovies) {
      loadMoreMovies();
    } else if (mediaType === 'tv' && hasMoreTV) {
      loadMoreTV();
    }
  };

  const currentResults = mediaType === 'movie' ? movies : tvShows;
  const currentLoading = mediaType === 'movie' ? moviesLoading : tvLoading;
  const currentError = mediaType === 'movie' ? moviesError : tvError;
  const currentHasMore = mediaType === 'movie' ? hasMoreMovies : hasMoreTV;
  const currentTotalResults = mediaType === 'movie' ? movieResults : tvResults;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Compass className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Discover</h1>
              <p className="text-muted-foreground text-lg mt-1">
                Find your next favorite movie or TV show with advanced filters
              </p>
            </div>
          </div>
        </div>

        {/* Advanced Search Form */}
        <div className="mb-8">
          <AdvancedSearchForm
            onSearch={handleSearch}
            movieGenres={movieGenres}
            tvGenres={tvGenres}
            loading={searchLoading}
            initialQuery={initialQuery}
          />
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="search">Search Results</TabsTrigger>
            </TabsList>

            {activeTab === 'discover' && (
              <div className="flex items-center gap-4">
                <Select value={mediaType} onValueChange={(value: any) => setMediaType(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="movie">Movies</SelectItem>
                    <SelectItem value="tv">TV Shows</SelectItem>
                  </SelectContent>
                </Select>

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
            )}
          </div>

          {/* Discover Tab */}
          <TabsContent value="discover" className="mt-0">
            {genresLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading genres...</span>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {currentTotalResults.toLocaleString()} {mediaType === 'movie' ? 'movies' : 'TV shows'} found
                    </span>
                  </div>
                </div>

                {/* Error State */}
                {currentError && (
                  <div className="text-center py-12">
                    <div className="text-destructive text-lg font-medium mb-2">
                      Failed to load {mediaType === 'movie' ? 'movies' : 'TV shows'}
                    </div>
                    <p className="text-muted-foreground">{currentError}</p>
                  </div>
                )}

                {/* Results Grid */}
                {!currentError && (
                  <div className={`grid gap-4 mb-8 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {currentResults.map((item) => (
                      <MovieCard
                        key={item.id}
                        movie={mediaType === 'movie' ? item as Movie : {
                          id: item.id,
                          title: (item as TVShow).name || (item as TVShow).original_name || '',
                          original_title: (item as TVShow).original_name || (item as TVShow).name || '',
                          overview: item.overview,
                          poster_path: item.poster_path,
                          backdrop_path: item.backdrop_path,
                          release_date: (item as TVShow).first_air_date || '',
                          vote_average: item.vote_average,
                          vote_count: item.vote_count,
                          genre_ids: item.genre_ids,
                          adult: false,
                          popularity: item.popularity,
                          original_language: 'en',
                          video: false
                        }}
                        size={viewMode === 'grid' ? 'medium' : 'large'}
                        showRating={true}
                        linkTo={mediaType === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
                      />
                    ))}
                  </div>
                )}

                {/* Load More Button */}
                {currentHasMore && !currentLoading && (
                  <div className="text-center">
                    <Button
                      onClick={handleLoadMore}
                      variant="outline"
                      size="lg"
                      disabled={currentLoading}
                    >
                      {currentLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load More'
                      )}
                    </Button>
                  </div>
                )}

                {/* Loading State */}
                {currentLoading && currentResults.length === 0 && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">
                      Loading {mediaType === 'movie' ? 'movies' : 'TV shows'}...
                    </span>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Search Results Tab */}
          <TabsContent value="search" className="mt-0">
            {searchLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Searching...</span>
              </div>
            ) : searchError ? (
              <div className="text-center py-12">
                <div className="text-destructive text-lg font-medium mb-2">Search Failed</div>
                <p className="text-muted-foreground">{searchError}</p>
              </div>
            ) : searchTotalResults === 0 && initialQuery ? (
              <div className="text-center py-12">
                <div className="text-lg font-medium text-foreground mb-2">No results found</div>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Movies */}
                {searchResults.movies.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      Movies ({searchResults.movies.length})
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {searchResults.movies.map((movie) => (
                        <MovieCard
                          key={movie.id}
                          movie={movie}
                          size="medium"
                          showRating={true}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* TV Shows */}
                {searchResults.tvShows.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      TV Shows ({searchResults.tvShows.length})
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {searchResults.tvShows.map((show) => (
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
                            original_language: 'en',
                            video: false
                          }}
                          size="medium"
                          showRating={true}
                          linkTo={`/tv/${show.id}`}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* People */}
                {searchResults.people.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      People ({searchResults.people.length})
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {searchResults.people.map((person) => (
                        <PersonCard
                          key={person.id}
                          person={person}
                          size="medium"
                          showKnownFor={true}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Load More Search Results Button */}
                {hasMoreSearch && !searchLoading && (searchResults.movies.length > 0 || searchResults.tvShows.length > 0 || searchResults.people.length > 0) && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={loadMoreSearch}
                      variant="outline"
                      size="lg"
                      disabled={searchLoading}
                    >
                      {searchLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load More Results'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Discover;
