import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Star, Clock, Users, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useEpisodeDetails } from '../hooks/useSeasons';
import { useTVShowDetails } from '../hooks/useTVShows';
import { useSeasonDetails } from '../hooks/useSeasons';
import { useEpisodeExternalLinks } from '../hooks/useExternalLinks';
import { ExternalLinksSection } from '../components/externalLinks/ExternalLinksSection';
import { formatEpisodeNumber, formatRuntime, getEpisodeStatus, getNextEpisode, getPreviousEpisode } from '../types/season';
import tmdbApi from '../services/tmdbApi';

const EpisodeDetail = () => {
  const { seriesId, seasonNumber, episodeNumber } = useParams<{ 
    seriesId: string; 
    seasonNumber: string; 
    episodeNumber: string; 
  }>();
  
  const tvId = seriesId ? parseInt(seriesId) : null;
  const seasonNum = seasonNumber ? parseInt(seasonNumber) : null;
  const episodeNum = episodeNumber ? parseInt(episodeNumber) : null;

  const { episode, loading: episodeLoading, error: episodeError } = useEpisodeDetails(tvId, seasonNum, episodeNum);
  const { tvShow, loading: showLoading } = useTVShowDetails(tvId);
  const { season, loading: seasonLoading } = useSeasonDetails(tvId, seasonNum);

  // External links
  const {
    groupedLinks,
    loading: externalLinksLoading,
    error: externalLinksError,
    handleLinkClick
  } = useEpisodeExternalLinks(tvId, seasonNum, episodeNum);

  const loading = episodeLoading || showLoading || seasonLoading;
  const error = episodeError;

  // Navigation
  const nextEpisode = season && episode ? getNextEpisode(season.episodes, episode) : null;
  const previousEpisode = season && episode ? getPreviousEpisode(season.episodes, episode) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="aspect-video bg-muted rounded" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !episode || !tvShow) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-destructive text-lg font-medium mb-2">
              {error || 'Episode not found'}
            </div>
            <p className="text-muted-foreground mb-4">
              The requested episode could not be loaded
            </p>
            <Button asChild>
              <Link to={tvId && seasonNum ? `/tv/${tvId}/season/${seasonNum}` : `/tv/${tvId}`}>
                Go Back
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const episodeCode = formatEpisodeNumber(episode.season_number, episode.episode_number);
  const stillUrl = episode.still_path 
    ? tmdbApi.getImageURL(episode.still_path, 'original')
    : null;
  const status = getEpisodeStatus(episode);
  const airDate = episode.air_date ? new Date(episode.air_date) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to={`/tv/${tvId}/season/${seasonNum}`} className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Season {seasonNum}
            </Link>
          </Button>
        </div>

        {/* Episode Header */}
        <div className="mb-8">
          {/* Still Image */}
          <div className="aspect-video bg-muted rounded-lg overflow-hidden cinema-shadow mb-6">
            {stillUrl ? (
              <img
                src={stillUrl}
                alt={`${tvShow.name} - ${episode.name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                <Play className="w-16 h-16" />
              </div>
            )}
          </div>

          {/* Episode Info */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{episodeCode}</Badge>
                {status === 'upcoming' && (
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    Upcoming
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {episode.name}
              </h1>
              <p className="text-xl text-muted-foreground">
                {tvShow.name} • Season {episode.season_number}
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4">
              {airDate && (
                <Badge variant="outline" className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {airDate.toLocaleDateString()}
                </Badge>
              )}
              
              {episode.runtime && (
                <Badge variant="outline" className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatRuntime(episode.runtime)}
                </Badge>
              )}

              {episode.vote_average > 0 && (
                <Badge variant="outline" className="flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                  {episode.vote_average.toFixed(1)}
                  {episode.vote_count > 0 && (
                    <span className="ml-1 text-muted-foreground">
                      ({episode.vote_count} votes)
                    </span>
                  )}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Episode Navigation */}
        <div className="flex items-center justify-between mb-8 p-4 bg-card rounded-lg border border-border">
          <div className="flex-1">
            {previousEpisode ? (
              <Button variant="ghost" asChild className="justify-start">
                <Link to={`/tv/${tvId}/season/${seasonNum}/episode/${previousEpisode.episode_number}`}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Previous</div>
                    <div className="font-medium truncate max-w-48">
                      {formatEpisodeNumber(previousEpisode.season_number, previousEpisode.episode_number)} • {previousEpisode.name}
                    </div>
                  </div>
                </Link>
              </Button>
            ) : (
              <div />
            )}
          </div>

          <div className="text-center px-4">
            <div className="text-sm text-muted-foreground">Episode</div>
            <div className="font-semibold">{episode.episode_number} of {season?.episode_count || '?'}</div>
          </div>

          <div className="flex-1 flex justify-end">
            {nextEpisode ? (
              <Button variant="ghost" asChild className="justify-end">
                <Link to={`/tv/${tvId}/season/${seasonNum}/episode/${nextEpisode.episode_number}`}>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Next</div>
                    <div className="font-medium truncate max-w-48">
                      {formatEpisodeNumber(nextEpisode.season_number, nextEpisode.episode_number)} • {nextEpisode.name}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* Episode Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            {episode.overview && (
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {episode.overview}
                </p>
              </section>
            )}

            {/* Guest Stars */}
            {episode.credits && episode.credits.guest_stars && episode.credits.guest_stars.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Guest Stars
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {episode.credits.guest_stars.slice(0, 8).map((actor) => (
                    <Link 
                      key={actor.id} 
                      to={`/person/${actor.id}`}
                      className="flex items-center space-x-3 hover:bg-muted/50 rounded-lg p-3 cinema-transition group"
                    >
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                        {actor.profile_path ? (
                          <img
                            src={tmdbApi.getImageURL(actor.profile_path, 'w185')}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate group-hover:text-primary cinema-transition">
                          {actor.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {actor.character}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Episode Details */}
            <section className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-4">Episode Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Episode</span>
                  <span className="font-medium">{episodeCode}</span>
                </div>
                
                {episode.production_code && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Production Code</span>
                    <span className="font-medium">{episode.production_code}</span>
                  </div>
                )}
                
                {airDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Air Date</span>
                    <span className="font-medium">{airDate.toLocaleDateString()}</span>
                  </div>
                )}
                
                {episode.runtime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Runtime</span>
                    <span className="font-medium">{formatRuntime(episode.runtime)}</span>
                  </div>
                )}
                
                {episode.vote_count > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Votes</span>
                    <span className="font-medium">{episode.vote_count.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </section>

            {/* External Links */}
            <section className="bg-card p-6 rounded-lg border border-border">
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

            {/* Quick Links */}
            <section className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <Link to={`/tv/${tvId}`}>
                    View Show Details
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <Link to={`/tv/${tvId}/season/${seasonNum}`}>
                    View Season {seasonNum}
                  </Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EpisodeDetail;
