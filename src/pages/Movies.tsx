import { useState, useEffect } from 'react';
import { Filter, SortAsc, Grid, List, Film } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { MovieGrid } from '../components/movie/MovieGrid';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useMovies } from '../hooks/useMovies';
import { Movie } from '../types/movie';
import tmdbApi from '../services/tmdbApi';

import { Footer } from '../components/layout/Footer';

const Movies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);

  const { 
    movies: popularMovies, 
    loading: popularLoading, 
    loadMore, 
    hasMore 
  } = useMovies('popular');

  useEffect(() => {
    setMovies(popularMovies);
    setFilteredMovies(popularMovies);
  }, [popularMovies]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredMovies(movies);
      return;
    }

    try {
      setLoading(true);
      const response = await tmdbApi.searchMovies(query);
      setFilteredMovies(response.results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    
    const sorted = [...filteredMovies].sort((a, b) => {
      switch (value) {
        case 'title.asc':
          return a.title.localeCompare(b.title);
        case 'title.desc':
          return b.title.localeCompare(a.title);
        case 'release_date.desc':
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        case 'release_date.asc':
          return new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
        case 'vote_average.desc':
          return b.vote_average - a.vote_average;
        case 'vote_average.asc':
          return a.vote_average - b.vote_average;
        case 'popularity.desc':
        default:
          return b.popularity - a.popularity;
      }
    });
    
    setFilteredMovies(sorted);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Film className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Movies</h1>
              <p className="text-muted-foreground text-lg mt-1">
                Explore our vast collection of movies from all genres and eras
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mb-8 space-y-4">
          {/* Search and Sort Row */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-48">
                  <SortAsc className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity.desc">Most Popular</SelectItem>
                  <SelectItem value="vote_average.desc">Highest Rated</SelectItem>
                  <SelectItem value="release_date.desc">Newest First</SelectItem>
                  <SelectItem value="release_date.asc">Oldest First</SelectItem>
                  <SelectItem value="title.asc">Title A-Z</SelectItem>
                  <SelectItem value="title.desc">Title Z-A</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border border-border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              All Genres
            </Button>
            <Button variant="outline" size="sm">Action</Button>
            <Button variant="outline" size="sm">Comedy</Button>
            <Button variant="outline" size="sm">Drama</Button>
            <Button variant="outline" size="sm">Sci-Fi</Button>
            <Button variant="outline" size="sm">Horror</Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading ? 'Searching...' : `Showing ${filteredMovies.length} movies`}
          </p>
        </div>

        {/* Movies Grid */}
        <MovieGrid
          movies={filteredMovies}
          loading={loading || popularLoading}
          showLoadMore={!searchQuery && hasMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          cardSize="medium"
        />
      </main>
      <Footer />
    </div>
  );
};

export default Movies;