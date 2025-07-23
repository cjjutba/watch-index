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
  Tv,
  Globe,
  CheckCircle,
  Hash,
  CalendarDays,
  Users
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { MovieCarousel } from '../components/movie/MovieCarousel';
import { Button } from '../components/ui/button';
import { TrailerModal } from '../components/ui/trailer-modal';
import { SeasonGrid } from '../components/season/SeasonGrid';
import { useTVShowDetails } from '../hooks/useTVShows';
import { useTVWatchProviders, useUserRegion } from '../hooks/useWatchProviders';
import { useTVShowExternalLinks } from '../hooks/useExternalLinks';
import { WatchProviderSection } from '../components/watchProvider/WatchProviderSection';
import { ExternalLinksSection } from '../components/externalLinks/ExternalLinksSection';
import { useFavorites, FavoriteItem } from '../contexts/FavoritesContext';
import tmdbApi from '../services/tmdbApi';

const TVShowDetail = () => {
  const { id } = useParams<{ id: string }>();
  const tvId = id ? parseInt(id) : null;
  const { tvShow, loading, error } = useTVShowDetails(tvId);
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
  } = useTVWatchProviders(tvId, userRegion);

  // External links
  const {
    groupedLinks,
    loading: externalLinksLoading,
    error: externalLinksError,
    handleLinkClick
  } = useTVShowExternalLinks(tvId);

  const itemIsFavorited = tvId ? isFavorite(tvId, 'tv') : false;

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

  if (error || !tvShow) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">TV Show Not Found</h1>
            <p className="text-muted-foreground mb-8">
              {error || 'The TV show you are looking for does not exist.'}
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

  const backdropUrl = tmdbApi.getImageURL(tvShow.backdrop_path, 'original');
  const posterUrl = tmdbApi.getImageURL(tvShow.poster_path, 'w500');
  const firstAirYear = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : 'TBA';
  const rating = tvShow.vote_average ? tvShow.vote_average.toFixed(1) : 'N/A';
  const episodeRuntime = tvShow.episode_run_time && tvShow.episode_run_time.length > 0 
    ? `${tvShow.episode_run_time[0]}m` : 'N/A';

  const creators = tvShow.created_by || [];
  const mainCast = tvShow.credits?.cast.slice(0, 6) || [];
  const trailer = tvShow.videos?.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

  const handleFavoriteToggle = () => {
    if (!tvShow || !tvId) return;

    const favoriteItem: FavoriteItem = {
      id: tvShow.id,
      title: tvShow.name,
      name: tvShow.name,
      poster_path: tvShow.poster_path,
      backdrop_path: tvShow.backdrop_path,
      first_air_date: tvShow.first_air_date,
      vote_average: tvShow.vote_average,
      overview: tvShow.overview,
      media_type: 'tv',
      genre_ids: tvShow.genre_ids,
      genres: tvShow.genres
    };

    if (itemIsFavorited) {
      removeFromFavorites(tvId, 'tv');
    } else {
      addToFavorites(favoriteItem);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = tvShow?.name || 'TV Show';
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

        {/* TV Show Details */}
        <section className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Poster */}
            <div className="md:col-span-1">
              <div className="sticky top-8">
                <img
                  src={posterUrl}
                  alt={tvShow.name}
                  className="w-full aspect-[2/3] object-cover rounded-lg cinema-shadow"
                />
              </div>
            </div>

            {/* TV Show Info */}
            <div className="md:col-span-3 space-y-6">
              {/* Title and Meta */}
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                  {tvShow.name}
                </h1>
                
                {tvShow.tagline && (
                  <p className="text-lg text-muted-foreground italic mb-4">
                    "{tvShow.tagline}"
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-primary fill-current" />
                    <span className="text-lg font-semibold text-foreground">{rating}</span>
                    <span className="text-sm">({tvShow.vote_count} votes)</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>{firstAirYear}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{episodeRuntime} per episode</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Tv className="w-5 h-5" />
                    <span>{tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Genres */}
                {tvShow.genres && tvShow.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tvShow.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
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
                  {tvShow.overview}
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
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                          {actor.profile_path ? (
                            <img
                              src={tmdbApi.getImageURL(actor.profile_path, 'w185')}
                              alt={actor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary cinema-transition">
                            {actor.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {actor.character}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* TV Show Details */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Show Info Card */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Tv className="w-5 h-5 mr-2 text-primary" />
                    Show Info
                  </h3>
                  <dl className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <dt className="text-muted-foreground flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Status
                      </dt>
                      <dd className="text-foreground font-medium">
                        {tvShow.status || 'N/A'}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <dt className="text-muted-foreground flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        Original Language
                      </dt>
                      <dd className="text-foreground font-medium uppercase">
                        {tvShow.original_language}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <dt className="text-muted-foreground flex items-center">
                        <Hash className="w-4 h-4 mr-2" />
                        Episodes
                      </dt>
                      <dd className="text-foreground font-medium">
                        {tvShow.number_of_episodes || 'N/A'}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <dt className="text-muted-foreground flex items-center">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        First Air Date
                      </dt>
                      <dd className="text-foreground font-medium">
                        {tvShow.first_air_date ? new Date(tvShow.first_air_date).toLocaleDateString() : 'N/A'}
                      </dd>
                    </div>
                    {tvShow.last_air_date && (
                      <div className="flex items-center justify-between py-2">
                        <dt className="text-muted-foreground flex items-center">
                          <CalendarDays className="w-4 h-4 mr-2" />
                          Last Air Date
                        </dt>
                        <dd className="text-foreground font-medium">
                          {new Date(tvShow.last_air_date).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Created By Card */}
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    Created By
                  </h3>
                  {creators.length > 0 ? (
                    <div className="space-y-4">
                      {creators.map((creator) => (
                        <div key={creator.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                            {creator.profile_path ? (
                              <img
                                src={tmdbApi.getImageURL(creator.profile_path, 'w185')}
                                alt={creator.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{creator.name}</p>
                            <p className="text-sm text-muted-foreground">Creator</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No creator information available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seasons */}
        {tvShow.seasons && tvShow.seasons.length > 0 && (
          <section className="mt-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <Tv className="w-6 h-6 mr-2" />
                Seasons
              </h2>
              <SeasonGrid
                seasons={tvShow.seasons}
                seriesId={tvId!}
                seriesName={tvShow.name}
                cardSize="medium"
              />
            </div>
          </section>
        )}

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

        {/* Similar TV Shows */}
        {tvShow.similar && tvShow.similar.results.length > 0 && (
          <MovieCarousel
            movies={tvShow.similar.results.map(show => ({
              ...show,
              title: show.name || show.original_name,
              release_date: show.first_air_date,
              original_title: show.original_name,
              media_type: 'tv'
            }))}
            title="Similar TV Shows"
            cardSize="medium"
            className="mt-16"
          />
        )}

        {/* Recommendations */}
        {tvShow.recommendations && tvShow.recommendations.results.length > 0 && (
          <MovieCarousel
            movies={tvShow.recommendations.results.map(show => ({
              ...show,
              title: show.name || show.original_name,
              release_date: show.first_air_date,
              original_title: show.original_name,
              media_type: 'tv'
            }))}
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
          title={tvShow.name}
        />
      )}
    </div>
  );
};

export default TVShowDetail;
