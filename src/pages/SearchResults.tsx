import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Film, Tv, User } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { MovieCard } from '../components/movie/MovieCard';
import { PersonCard } from '../components/person/PersonCard';
import { Button } from '../components/ui/button';
import { Movie } from '../types/movie';
import { TVShow } from '../types/tvshow';
import { Person } from '../types/person';
import tmdbApi from '../services/tmdbApi';

type SearchResultItem = (Movie | TVShow | Person) & { media_type?: string };

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'movie' | 'tv' | 'person'>('all');

  useEffect(() => {
    if (query) {
      searchMulti(query);
    }
  }, [query]);

  const searchMulti = async (searchQuery: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tmdbApi.searchMulti(searchQuery);
      setResults(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const filterResults = (type: string) => {
    if (type === 'all') return results;
    return results.filter(item => item.media_type === type);
  };

  const getFilteredResults = () => filterResults(activeTab);
  const movieResults = filterResults('movie');
  const tvResults = filterResults('tv');
  const personResults = filterResults('person');

  const tabs = [
    { key: 'all', label: 'All', count: results.length, icon: Search },
    { key: 'movie', label: 'Movies', count: movieResults.length, icon: Film },
    { key: 'tv', label: 'TV Shows', count: tvResults.length, icon: Tv },
    { key: 'person', label: 'People', count: personResults.length, icon: User },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-6" />
            <div className="flex space-x-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded w-24" />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[2/3] bg-muted rounded-lg" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Results Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-muted-foreground text-lg">
              Showing results for "<span className="text-foreground font-medium">{query}</span>"
            </p>
          )}
        </div>

        {error && (
          <div className="text-center py-12">
            <div className="text-destructive text-lg font-medium mb-2">
              Search Failed
            </div>
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {!error && (
          <>
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-border">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <Button
                    key={tab.key}
                    variant={activeTab === tab.key ? 'default' : 'ghost'}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Results */}
            <div className="space-y-8">
              {getFilteredResults().length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    No results found
                  </h2>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or browse our collection
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <Button asChild>
                      <Link to="/movies">Browse Movies</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/tv-shows">Browse TV Shows</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Movies */}
                  {(activeTab === 'all' || activeTab === 'movie') && movieResults.length > 0 && (
                    <section>
                      {activeTab === 'all' && (
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                          <Film className="w-5 h-5 mr-2" />
                          Movies ({movieResults.length})
                        </h2>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {(activeTab === 'movie' ? movieResults : movieResults.slice(0, 6)).map((movie) => (
                          <MovieCard
                            key={movie.id}
                            movie={movie as Movie}
                            size="medium"
                            showRating={true}
                            className="mx-auto"
                          />
                        ))}
                      </div>
                      {activeTab === 'all' && movieResults.length > 6 && (
                        <div className="mt-4">
                          <Button 
                            variant="outline"
                            onClick={() => setActiveTab('movie')}
                          >
                            View all {movieResults.length} movies
                          </Button>
                        </div>
                      )}
                    </section>
                  )}

                  {/* TV Shows */}
                  {(activeTab === 'all' || activeTab === 'tv') && tvResults.length > 0 && (
                    <section>
                      {activeTab === 'all' && (
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                          <Tv className="w-5 h-5 mr-2" />
                          TV Shows ({tvResults.length})
                        </h2>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {(activeTab === 'tv' ? tvResults : tvResults.slice(0, 6)).map((show) => (
                          <div key={show.id} className="w-48 mx-auto">
                            {/* TV Show Card - simplified for now */}
                            <div className="bg-card rounded-lg cinema-shadow overflow-hidden hover:scale-105 cinema-transition">
                              <div className="aspect-[2/3] bg-muted flex items-center justify-center">
                                <Tv className="w-8 h-8 text-muted-foreground" />
                              </div>
                              <div className="p-4">
                                <h3 className="font-semibold text-foreground line-clamp-2">
                                  {(show as TVShow).name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {(show as TVShow).first_air_date ? new Date((show as TVShow).first_air_date).getFullYear() : 'TBA'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {activeTab === 'all' && tvResults.length > 6 && (
                        <div className="mt-4">
                          <Button 
                            variant="outline"
                            onClick={() => setActiveTab('tv')}
                          >
                            View all {tvResults.length} TV shows
                          </Button>
                        </div>
                      )}
                    </section>
                  )}

                  {/* People */}
                  {(activeTab === 'all' || activeTab === 'person') && personResults.length > 0 && (
                    <section>
                      {activeTab === 'all' && (
                        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                          <User className="w-5 h-5 mr-2" />
                          People ({personResults.length})
                        </h2>
                      )}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {(activeTab === 'person' ? personResults : personResults.slice(0, 6)).map((person) => (
                          <PersonCard
                            key={person.id}
                            person={person as Person}
                            size="medium"
                            showKnownFor={true}
                            className="mx-auto"
                          />
                        ))}
                      </div>
                      {activeTab === 'all' && personResults.length > 6 && (
                        <div className="mt-4">
                          <Button 
                            variant="outline"
                            onClick={() => setActiveTab('person')}
                          >
                            View all {personResults.length} people
                          </Button>
                        </div>
                      )}
                    </section>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;