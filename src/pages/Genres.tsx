import { Tags, Info } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { GenreGrid } from '../components/genre/GenreGrid';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useGenres } from '../hooks/useAdvancedSearch';

const Genres = () => {
  const { movieGenres, tvGenres, loading, error } = useGenres();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Tags className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Browse by Genre</h1>
              <p className="text-muted-foreground text-lg mt-1">
                Discover movies and TV shows organized by genre
              </p>
            </div>
          </div>

          {/* Info Alert */}
          <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Genre Discovery</strong> - Each genre contains thousands of movies and TV shows. 
              Click on any genre to explore its complete collection with advanced sorting and filtering options.
            </AlertDescription>
          </Alert>
        </div>

        {/* Genre Grid */}
        <GenreGrid
          movieGenres={movieGenres}
          tvGenres={tvGenres}
          loading={loading}
          error={error}
          showTabs={true}
          cardSize="medium"
        />

        {/* Additional Info Section */}
        <section className="mt-16 p-6 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            About Genres
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground mb-2">Movie Genres</h3>
              <p>
                Movie genres are assigned by The Movie Database (TMDB) based on the film's content, 
                themes, and style. Each movie can have multiple genres, and our system shows content 
                that matches any of the selected genres for broader discovery.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-foreground mb-2">TV Show Genres</h3>
              <p>
                TV show genres reflect the overall tone and content of the series. Some genres like 
                "Action & Adventure" or "Sci-Fi & Fantasy" are specific to television and help you 
                find shows that match your viewing preferences.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <h3 className="font-medium text-foreground mb-2">How to Use</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Click on any genre card to explore all movies and TV shows in that category</li>
              <li>• Use the tabs above to filter between movie genres, TV genres, or view all genres</li>
              <li>• Sort genres alphabetically or by popularity using the dropdown menu</li>
              <li>• Switch between grid and list view for your preferred browsing experience</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Genres;
