import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Star, Clock, Users, Info } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { EpisodeList } from '../components/episode/EpisodeList';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useSeasonDetails } from '../hooks/useSeasons';
import { useTVShowDetails } from '../hooks/useTVShows';
import { useSeasonExternalLinks } from '../hooks/useExternalLinks';
import { ExternalLinksSection } from '../components/externalLinks/ExternalLinksSection';
import { getSeasonTitle } from '../types/season';
import tmdbApi from '../services/tmdbApi';

const SeasonDetail = () => {
  const { seriesId, seasonNumber } = useParams<{ seriesId: string; seasonNumber: string }>();
  const tvId = seriesId ? parseInt(seriesId) : null;
  const seasonNum = seasonNumber ? parseInt(seasonNumber) : null;

  const { season, loading: seasonLoading, error: seasonError } = useSeasonDetails(tvId, seasonNum);
  const { tvShow, loading: showLoading } = useTVShowDetails(tvId);

  // External links
  const {
    groupedLinks,
    loading: externalLinksLoading,
    error: externalLinksError,
    handleLinkClick
  } = useSeasonExternalLinks(tvId, seasonNum);

  const loading = seasonLoading || showLoading;
  const error = seasonError;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="h-64 bg-muted rounded" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-48 aspect-video bg-muted rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !season || !tvShow) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-destructive text-lg font-medium mb-2">
              {error || 'Season not found'}
            </div>
            <p className="text-muted-foreground mb-4">
              The requested season could not be loaded
            </p>
            <Button asChild>
              <Link to={tvId ? `/tv/${tvId}` : '/tv-shows'}>
                Go Back
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const seasonTitle = getSeasonTitle(season.season_number, season.name);
  const posterUrl = season.poster_path 
    ? tmdbApi.getImageURL(season.poster_path, 'w500')
    : null;
  const airYear = season.air_date ? new Date(season.air_date).getFullYear() : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to={`/tv/${tvId}`} className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {tvShow.name}
            </Link>
          </Button>
        </div>

        {/* Season Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Poster */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden cinema-shadow">
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={`${tvShow.name} - ${seasonTitle}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                    <Calendar className="w-16 h-16" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="mb-4">
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {seasonTitle}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {tvShow.name}
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {airYear && (
                  <Badge variant="outline" className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {airYear}
                  </Badge>
                )}
                
                <Badge variant="outline" className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {season.episode_count} episode{season.episode_count !== 1 ? 's' : ''}
                </Badge>

                {season.vote_average > 0 && (
                  <Badge variant="outline" className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {season.vote_average.toFixed(1)}
                  </Badge>
                )}
              </div>

              {/* Overview */}
              {season.overview && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-foreground mb-2">Overview</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {season.overview}
                  </p>
                </div>
              )}

              {/* Cast */}
              {season.credits && season.credits.cast.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Main Cast
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {season.credits.cast.slice(0, 6).map((actor) => (
                      <Link 
                        key={actor.id} 
                        to={`/person/${actor.id}`}
                        className="flex items-center space-x-3 hover:bg-muted/50 rounded-lg p-2 cinema-transition group"
                      >
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                          {actor.profile_path ? (
                            <img
                              src={tmdbApi.getImageURL(actor.profile_path, 'w185')}
                              alt={actor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users className="w-5 h-5 text-muted-foreground" />
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
            </div>
          </div>
        </div>

        {/* Season Navigation */}
        {tvShow.seasons && tvShow.seasons.length > 1 && (
          <div className="mb-8">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Other Seasons:</strong> This show has {tvShow.seasons.length} seasons. 
                <div className="flex flex-wrap gap-2 mt-2">
                  {tvShow.seasons
                    .filter(s => s.season_number !== season.season_number)
                    .slice(0, 10)
                    .map((s) => (
                      <Button key={s.id} variant="outline" size="sm" asChild>
                        <Link to={`/tv/${tvId}/season/${s.season_number}`}>
                          {getSeasonTitle(s.season_number, s.name)}
                        </Link>
                      </Button>
                    ))}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* External Links */}
        <section className="mb-16">
          <ExternalLinksSection
            groupedLinks={groupedLinks}
            loading={externalLinksLoading}
            error={externalLinksError}
            onLinkClick={handleLinkClick}
            title="External Links"
            compact={true}
            showCategories={false}
          />
        </section>

        {/* Episodes */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Episodes</h2>
          <EpisodeList
            episodes={season.episodes}
            seriesId={tvId!}
            seriesName={tvShow.name}
            seasonName={seasonTitle}
            layout="horizontal"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SeasonDetail;
