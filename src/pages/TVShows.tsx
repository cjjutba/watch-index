import { useState, useEffect } from 'react';
import { Filter, SortAsc, Grid, List, Tv } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { MovieGrid } from '../components/movie/MovieGrid';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useTVShows } from '../hooks/useTVShows';
import tmdbApi from '../services/tmdbApi';

import { Footer } from '../components/layout/Footer';

const TVShows = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tvShows, setTVShows] = useState<any[]>([]);
  const [filteredTVShows, setFilteredTVShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);

  const {
    tvShows: popularTVShows,
    loading: popularLoading,
    loadMore,
    hasMore
  } = useTVShows('popular');

  useEffect(() => {
    // Convert TV shows to movie-like format for compatibility with MovieGrid
    const convertedTVShows = popularTVShows.map(show => ({
      ...show,
      title: show.name || show.original_name,
      release_date: show.first_air_date,
      original_title: show.original_name,
      media_type: 'tv',
      video: false // Required Movie property
    }));
    setTVShows(convertedTVShows);
    setFilteredTVShows(convertedTVShows);
  }, [popularTVShows]);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setFilteredTVShows(tvShows);
    }
  }, [searchQuery, tvShows]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await tmdbApi.searchTVShows(searchQuery, page);
      const convertedResults = response.results.map((show: any) => ({
        ...show,
        title: show.name || show.original_name,
        release_date: show.first_air_date,
        original_title: show.original_name,
        media_type: 'tv',
        video: false // Required Movie property
      }));
      setFilteredTVShows(convertedResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const sorted = [...filteredTVShows].sort((a, b) => {
      switch (value) {
        case 'popularity.desc':
          return b.popularity - a.popularity;
        case 'popularity.asc':
          return a.popularity - b.popularity;
        case 'vote_average.desc':
          return b.vote_average - a.vote_average;
        case 'vote_average.asc':
          return a.vote_average - b.vote_average;
        case 'first_air_date.desc':
          return new Date(b.first_air_date || '').getTime() - new Date(a.first_air_date || '').getTime();
        case 'first_air_date.asc':
          return new Date(a.first_air_date || '').getTime() - new Date(b.first_air_date || '').getTime();
        case 'name.asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name.desc':
          return (b.name || '').localeCompare(a.name || '');
        default:
          return 0;
      }
    });
    setFilteredTVShows(sorted);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Tv className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">TV Shows</h1>
              <p className="text-muted-foreground text-lg mt-1">
                Explore our vast collection of TV shows from all genres and eras
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity.desc">Most Popular</SelectItem>
                  <SelectItem value="popularity.asc">Least Popular</SelectItem>
                  <SelectItem value="vote_average.desc">Highest Rated</SelectItem>
                  <SelectItem value="vote_average.asc">Lowest Rated</SelectItem>
                  <SelectItem value="first_air_date.desc">Newest First</SelectItem>
                  <SelectItem value="first_air_date.asc">Oldest First</SelectItem>
                  <SelectItem value="name.asc">A-Z</SelectItem>
                  <SelectItem value="name.desc">Z-A</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredTVShows.length} TV shows
          </p>
        </div>

        {/* TV Shows Grid */}
        <MovieGrid
          movies={filteredTVShows}
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

export default TVShows;