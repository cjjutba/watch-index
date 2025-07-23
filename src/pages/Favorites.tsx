import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Film, Tv, ChevronLeft } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { MovieCard } from '../components/movie/MovieCard';
import { Button } from '../components/ui/button';
import { useFavorites } from '../contexts/FavoritesContext';

const Favorites = () => {
  const { favorites, removeFromFavorites, clearFavorites, favoritesCount } = useFavorites();
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');

  const filteredFavorites = favorites.filter(item => {
    if (filter === 'all') return true;
    return item.media_type === filter;
  });

  const movieCount = favorites.filter(item => item.media_type === 'movie').length;
  const tvCount = favorites.filter(item => item.media_type === 'tv').length;

  const handleRemoveFromFavorites = (id: number, mediaType: 'movie' | 'tv') => {
    removeFromFavorites(id, mediaType);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      clearFavorites();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center">
                <Heart className="w-8 h-8 mr-3 text-red-500 fill-current" />
                My Favorites
              </h1>
              <p className="text-muted-foreground">
                {favoritesCount === 0 
                  ? 'No favorites yet. Start adding movies and TV shows you love!'
                  : `${favoritesCount} item${favoritesCount !== 1 ? 's' : ''} in your favorites`
                }
              </p>
            </div>
            
            {favoritesCount > 0 && (
              <Button 
                variant="outline" 
                onClick={handleClearAll}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {favoritesCount === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">No Favorites Yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Discover amazing movies and TV shows, then add them to your favorites by clicking the heart icon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/movies">
                  <Film className="w-4 h-4 mr-2" />
                  Browse Movies
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/tv-shows">
                  <Tv className="w-4 h-4 mr-2" />
                  Browse TV Shows
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Tabs */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  size="sm"
                >
                  All ({favoritesCount})
                </Button>
                <Button
                  variant={filter === 'movie' ? 'default' : 'outline'}
                  onClick={() => setFilter('movie')}
                  size="sm"
                >
                  <Film className="w-4 h-4 mr-2" />
                  Movies ({movieCount})
                </Button>
                <Button
                  variant={filter === 'tv' ? 'default' : 'outline'}
                  onClick={() => setFilter('tv')}
                  size="sm"
                >
                  <Tv className="w-4 h-4 mr-2" />
                  TV Shows ({tvCount})
                </Button>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredFavorites.map((item) => (
                <div key={`${item.media_type}-${item.id}`} className="relative group">
                  <MovieCard
                    movie={{
                      ...item,
                      title: item.media_type === 'tv' ? item.name || item.title : item.title,
                      release_date: item.media_type === 'tv' ? item.first_air_date || item.release_date : item.release_date,
                      video: false // Required Movie property
                    }}
                    size="medium"
                    showRating={true}
                  />
                  
                  {/* Remove Button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2"
                    onClick={() => handleRemoveFromFavorites(item.id, item.media_type)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {filteredFavorites.length === 0 && filter !== 'all' && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  {filter === 'movie' ? (
                    <Film className="w-8 h-8 text-muted-foreground" />
                  ) : (
                    <Tv className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No {filter === 'movie' ? 'Movies' : 'TV Shows'} in Favorites
                </h3>
                <p className="text-muted-foreground">
                  You haven't added any {filter === 'movie' ? 'movies' : 'TV shows'} to your favorites yet.
                </p>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Favorites;
