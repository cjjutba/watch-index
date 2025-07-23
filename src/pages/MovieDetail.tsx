import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Star,
  Calendar,
  Clock,
  Heart,
  Share2,
  Play,
  ChevronLeft,
  User,
  Film,
  Globe,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Building2,
  MapPin
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { MovieCarousel } from '../components/movie/MovieCarousel';
import { Button } from '../components/ui/button';
import { TrailerModal } from '../components/ui/trailer-modal';
import { useMovieDetails } from '../hooks/useMovies';
import { useMovieWatchProviders, useUserRegion } from '../hooks/useWatchProviders';
import { useMovieExternalLinks } from '../hooks/useExternalLinks';
import { WatchProviderSection } from '../components/watchProvider/WatchProviderSection';
import { ExternalLinksSection } from '../components/externalLinks/ExternalLinksSection';
import { useFavorites, FavoriteItem } from '../contexts/FavoritesContext';
import tmdbApi from '../services/tmdbApi';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? parseInt(id) : null;
  const { movie, loading, error } = useMovieDetails(movieId);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);

  // Watch providers
  const { userRegion } = useUserRegion();
  const {
    groupedProviders,
    availableRegions,
    changeRegion,
    loading: watchProvidersLoading,
    error: watchProvidersError
  } = useMovieWatchProviders(movieId, userRegion);

  // External links
  const {
    groupedLinks,
    loading: externalLinksLoading,
    error: externalLinksError,
    handleLinkClick
  } = useMovieExternalLinks(movieId);

  const itemIsFavorited = movieId ? isFavorite(movieId, 'movie') : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="animate-pulse">
          <div className="h-96 bg-muted" />
          <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="aspect-[2/3] bg-muted rounded-lg" />
              <div className="md:col-span-2 space-y-4">
                <div className="h-8 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-20 bg-muted rounded" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Movie Not Found</h1>
            <p className="text-muted-foreground mb-8">
              {error || 'The movie you are looking for does not exist.'}
            </p>
            <Button asChild>
              <Link to="/">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const backdropUrl = tmdbApi.getImageURL(movie.backdrop_path, 'original');
  const posterUrl = tmdbApi.getImageURL(movie.poster_path, 'w500');
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';

  const director = movie.credits?.crew.find(person => person.job === 'Director');
  const mainCast = movie.credits?.cast.slice(0, 6) || [];
  const trailer = movie.videos?.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

  const handleFavoriteToggle = () => {
    if (!movie || !movieId) return;

    const favoriteItem: FavoriteItem = {
      id: movie.id,
      title: movie.title,
      name: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      overview: movie.overview,
      media_type: 'movie',
      genre_ids: movie.genre_ids,
      genres: movie.genres
    };

    if (itemIsFavorited) {
      removeFromFavorites(movieId, 'movie');
    } else {
      addToFavorites(favoriteItem);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = movie?.title || 'Movie';
    const text = `Check out ${title} on WatchIndex`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        // You could add a toast notification here
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        // Final fallback: select the URL
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copied to clipboard!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
          
          {/* Navigation */}
          <div className="relative container mx-auto px-4 pt-8">
            <Button variant="ghost" asChild className="text-white hover:bg-white/10">
              <Link to="/">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </section>

        {/* Movie Details */}
        <section className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Poster */}
            <div className="md:col-span-1">
              <div className="sticky top-8">
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover rounded-lg cinema-shadow"
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="md:col-span-3 space-y-6">
              {/* Title and Meta */}
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                  {movie.title}
                </h1>
                
                {movie.tagline && (
                  <p className="text-lg text-muted-foreground italic mb-4">
                    "{movie.tagline}"
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-primary fill-current" />
                    <span className="font-medium">{rating}</span>
                    <span className="text-muted-foreground">({movie.vote_count} votes)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-5 h-5" />
                    <span>{releaseYear}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-5 h-5" />
                    <span>{runtime}</span>
                  </div>
                  {director && (
                    <div className="flex items-center space-x-1">
                      <User className="w-5 h-5" />
                      <span>Dir. {director.name}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="inline-block bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {trailer && (
                  <Button
                    size="lg"
                    className="gold-gradient"
                    onClick={() => setIsTrailerModalOpen(true)}
                  >
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Watch Trailer
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleFavoriteToggle}
                  className={itemIsFavorited ? 'border-red-500 text-red-500' : ''}
                >
                  <Heart className={`w-5 h-5 mr-2 ${itemIsFavorited ? 'fill-current' : ''}`} />
                  {itemIsFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>

              {/* Overview */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Overview</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {movie.overview}
                </p>
              </div>

              {/* Cast */}
              {mainCast.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Cast</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {mainCast.map((actor) => (
                      <Link
                        key={actor.id}
                        to={`/person/${actor.id}`}
                        className="flex items-center space-x-3 hover:bg-muted/50 rounded-lg p-2 cinema-transition group"
                      >
                        <img
                          src={tmdbApi.getImageURL(actor.profile_path, 'w185')}
                          alt={actor.name}
                          className="w-12 h-12 rounded-full object-cover bg-muted"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-actor.jpg';
                          }}
                        />
                        <div>
                          <p className="font-medium text-foreground group-hover:text-primary cinema-transition">{actor.name}</p>
                          <p className="text-sm text-muted-foreground">{actor.character}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Movie Details */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Movie Info Card */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Film className="w-5 h-5 mr-2 text-primary" />
                    Movie Info
                  </h3>
                  <dl className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <dt className="text-muted-foreground flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Status
                      </dt>
                      <dd className="text-foreground font-medium">
                        {movie.status || 'N/A'}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <dt className="text-muted-foreground flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        Original Language
                      </dt>
                      <dd className="text-foreground font-medium uppercase">
                        {movie.original_language}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <dt className="text-muted-foreground flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Budget
                      </dt>
                      <dd className="text-foreground font-medium">
                        {movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <dt className="text-muted-foreground flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Revenue
                      </dt>
                      <dd className="text-foreground font-medium">
                        {movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Production Card */}
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                      <Building2 className="w-5 h-5 mr-2 text-primary" />
                      Production
                    </h3>
                    <div className="space-y-4">
                      {movie.production_companies.slice(0, 4).map((company) => (
                        <div key={company.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          {company.logo_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                              alt={company.name}
                              className="w-8 h-8 object-contain rounded"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-primary" />
                            </div>
                          )}
                          <div className="flex-1">
                            <span className="text-foreground font-medium text-sm">{company.name}</span>
                            {company.origin_country && (
                              <div className="flex items-center mt-1">
                                <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground uppercase">
                                  {company.origin_country}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {movie.production_companies.length > 4 && (
                        <div className="text-center">
                          <span className="text-sm text-muted-foreground">
                            +{movie.production_companies.length - 4} more companies
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Watch Providers */}
        <section className="mt-16">
          <div className="container mx-auto px-4">
            <WatchProviderSection
              groupedProviders={groupedProviders}
              availableRegions={availableRegions}
              currentRegion={userRegion}
              onRegionChange={changeRegion}
              loading={watchProvidersLoading}
              error={watchProvidersError}
            />
          </div>
        </section>

        {/* External Links */}
        <section className="mt-16">
          <div className="container mx-auto px-4">
            <ExternalLinksSection
              groupedLinks={groupedLinks}
              loading={externalLinksLoading}
              error={externalLinksError}
              onLinkClick={handleLinkClick}
              title="External Links"
              compact={false}
              showCategories={true}
            />
          </div>
        </section>

        {/* Similar Movies */}
        {movie.similar && movie.similar.results.length > 0 && (
          <MovieCarousel
            movies={movie.similar.results.slice(0, 12)}
            title="Similar Movies"
            cardSize="medium"
            className="mt-16"
          />
        )}

        {/* Recommendations */}
        {movie.recommendations && movie.recommendations.results.length > 0 && (
          <MovieCarousel
            movies={movie.recommendations.results.slice(0, 12)}
            title="You Might Also Like"
            cardSize="medium"
            className="mb-16"
          />
        )}
      </main>
      <Footer />

      {/* Trailer Modal */}
      {trailer && (
        <TrailerModal
          isOpen={isTrailerModalOpen}
          onClose={() => setIsTrailerModalOpen(false)}
          videoKey={trailer.key}
          title={movie.title}
        />
      )}
    </div>
  );
};

export default MovieDetail;