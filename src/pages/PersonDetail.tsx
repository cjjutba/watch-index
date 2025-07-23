import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  User,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronLeft,
  Film,
  Tv,
  Star
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { MovieCard } from '../components/movie/MovieCard';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { usePersonDetails } from '../hooks/usePeople';
import { usePersonExternalLinks } from '../hooks/useExternalLinks';
import { ExternalLinksSection } from '../components/externalLinks/ExternalLinksSection';
import { CombinedCastCredit } from '../types/person';
import tmdbApi from '../services/tmdbApi';

const PersonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const personId = id ? parseInt(id) : null;
  const { person, loading, error } = usePersonDetails(personId);

  // External links
  const {
    groupedLinks,
    loading: externalLinksLoading,
    error: externalLinksError,
    handleLinkClick
  } = usePersonExternalLinks(personId);
  const [activeTab, setActiveTab] = useState('overview');

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

  if (error || !person) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Person Not Found</h1>
            <p className="text-muted-foreground mb-8">
              {error || 'The person you are looking for could not be found.'}
            </p>
            <Link to="/">
              <Button>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const profileUrl = person.profile_path 
    ? tmdbApi.getImageURL(person.profile_path, 'w500')
    : null;

  const birthYear = person.birthday ? new Date(person.birthday).getFullYear() : null;
  const deathYear = person.deathday ? new Date(person.deathday).getFullYear() : null;
  const age = person.birthday && !person.deathday 
    ? new Date().getFullYear() - new Date(person.birthday).getFullYear()
    : null;

  // Sort credits by popularity and release date
  const sortedCastCredits = person.combined_credits?.cast
    .sort((a, b) => {
      const aDate = a.release_date || a.first_air_date || '0000-00-00';
      const bDate = b.release_date || b.first_air_date || '0000-00-00';
      return bDate.localeCompare(aDate);
    }) || [];

  const movieCredits = sortedCastCredits.filter(credit => credit.media_type === 'movie');
  const tvCredits = sortedCastCredits.filter(credit => credit.media_type === 'tv');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground cinema-transition mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>

        {/* Person Header */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Profile Image */}
          <div className="md:col-span-1">
            <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden cinema-shadow">
              {profileUrl ? (
                <img
                  src={profileUrl}
                  alt={person.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`${profileUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                <User className="w-16 h-16 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Person Info */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{person.name}</h1>
              {person.known_for_department && (
                <p className="text-xl text-muted-foreground">{person.known_for_department}</p>
              )}
            </div>

            {/* Personal Details */}
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {person.birthday && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Born:</span>
                  <span className="text-foreground">
                    {new Date(person.birthday).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {age && ` (age ${age})`}
                  </span>
                </div>
              )}

              {person.deathday && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Died:</span>
                  <span className="text-foreground">
                    {new Date(person.deathday).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}

              {person.place_of_birth && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Born in:</span>
                  <span className="text-foreground">{person.place_of_birth}</span>
                </div>
              )}
            </div>

            {/* External Links */}
            {person.external_ids && (
              <div className="flex flex-wrap gap-2">
                {person.external_ids.imdb_id && (
                  <a
                    href={`https://www.imdb.com/name/${person.external_ids.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 cinema-transition text-sm"
                  >
                    IMDb
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
                
                {person.external_ids.instagram_id && (
                  <a
                    href={`https://www.instagram.com/${person.external_ids.instagram_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-pink-600 text-white rounded-md hover:bg-pink-700 cinema-transition text-sm"
                  >
                    Instagram
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}

                {person.external_ids.twitter_id && (
                  <a
                    href={`https://twitter.com/${person.external_ids.twitter_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 cinema-transition text-sm"
                  >
                    Twitter
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="movies">Movies ({movieCredits.length})</TabsTrigger>
            <TabsTrigger value="tv">TV Shows ({tvCredits.length})</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="space-y-8">
              {person.biography && (
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Biography</h2>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    {person.biography.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* External Links */}
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
          </TabsContent>

          <TabsContent value="movies" className="mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movieCredits.slice(0, 24).map((credit) => (
                <div key={`${credit.id}-${credit.credit_id}`} className="w-full">
                  <MovieCard
                    movie={{
                      id: credit.id,
                      title: credit.title || credit.original_title || '',
                      original_title: credit.original_title || credit.title || '',
                      overview: credit.overview,
                      poster_path: credit.poster_path,
                      backdrop_path: credit.backdrop_path,
                      release_date: credit.release_date || '',
                      vote_average: credit.vote_average,
                      vote_count: credit.vote_count,
                      genre_ids: credit.genre_ids,
                      adult: credit.adult || false,
                      popularity: credit.popularity,
                      original_language: 'en',
                      video: false
                    }}
                    size="medium"
                    showRating={true}
                  />
                  <div className="mt-2 text-center">
                    <p className="text-xs text-muted-foreground">as {credit.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tv" className="mt-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {tvCredits.slice(0, 24).map((credit) => (
                <div key={`${credit.id}-${credit.credit_id}`} className="w-full">
                  <Link to={`/tv/${credit.id}`}>
                    <div className="bg-card rounded-lg cinema-shadow overflow-hidden hover:scale-105 cinema-transition">
                      <div className="aspect-[2/3] bg-muted flex items-center justify-center">
                        {credit.poster_path ? (
                          <img
                            src={tmdbApi.getImageURL(credit.poster_path, 'w300')}
                            alt={credit.name || credit.original_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`${credit.poster_path ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                          <Tv className="w-8 h-8 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-foreground line-clamp-2 text-sm">
                          {credit.name || credit.original_name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {credit.first_air_date ? new Date(credit.first_air_date).getFullYear() : 'TBA'}
                        </p>
                        <div className="flex items-center mt-1">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                          <span className="text-xs text-muted-foreground">
                            {credit.vote_average ? credit.vote_average.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="mt-2 text-center">
                    <p className="text-xs text-muted-foreground">as {credit.character}</p>
                    {credit.episode_count && (
                      <p className="text-xs text-muted-foreground">
                        {credit.episode_count} episode{credit.episode_count !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photos" className="mt-8">
            {person.images && person.images.profiles.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {person.images.profiles.slice(0, 20).map((image, index) => (
                  <div key={index} className="aspect-[2/3] bg-muted rounded-lg overflow-hidden cinema-shadow">
                    <img
                      src={tmdbApi.getImageURL(image.file_path, 'w300')}
                      alt={`${person.name} photo ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 cinema-transition cursor-pointer"
                      onClick={() => window.open(tmdbApi.getImageURL(image.file_path, 'original'), '_blank')}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No photos available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default PersonDetail;
