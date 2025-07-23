import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Movie, MovieDetails } from '../types/movie';
import { TVShow, TVShowDetails } from '../types/tvshow';
import { Person, PersonDetails, CombinedCredits, MovieCredits, TVCredits, PersonImages, ExternalIds } from '../types/person';
import { GenreResponse, DiscoverFilters } from '../types/genre';
import { WatchProviderResponse, WatchProviderRegionsResponse, WatchProviderListResponse } from '../types/watchProvider';
import { SeasonDetails, EpisodeDetails, EpisodeGroup, EpisodeGroupDetails } from '../types/season';
import { TMDBResponse, TMDBError } from '../types/api';

class TMDBApi {
  private api: AxiosInstance;
  private apiKey: string;
  private baseURL: string;
  public imageBaseURL: string;

  constructor() {
    // Get API configuration from environment variables
    this.apiKey = import.meta.env.VITE_TMDB_API_KEY || '';
    this.baseURL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
    this.imageBaseURL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/';

    if (!this.apiKey) {
      console.error('TMDB API key is not configured. Please add VITE_TMDB_API_KEY to your .env file.');
    }

    this.api = axios.create({
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
      },
      timeout: 10000,
    });

    // Request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        console.log(`Making request to: ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.data) {
          const tmdbError: TMDBError = error.response.data;
          console.error('TMDB API Error:', tmdbError.status_message);
        }
        return Promise.reject(error);
      }
    );
  }

  // Helper method to construct image URLs
  getImageURL(path: string | null, size: string = 'w500'): string {
    if (!path || path.trim() === '') {
      // Return a data URL for a simple placeholder instead of a file path
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik0xNTAgMjI1TDE3NSAyMDBIMTI1TDE1MCAyMjVaIiBmaWxsPSIjNjY2Ii8+CjxwYXRoIGQ9Ik0xMjUgMjI1SDE3NVYyNTBIMTI1VjIyNVoiIGZpbGw9IiM2NjYiLz4KPHR4dCB4PSIxNTAiIHk9IjMwMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdHh0Pgo8L3N2Zz4K';
    }
    return `${this.imageBaseURL}${size}${path}`;
  }

  // Movies
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'day'): Promise<TMDBResponse<Movie>> {
    const response: AxiosResponse<TMDBResponse<Movie>> = await this.api.get(
      `/trending/movie/${timeWindow}`
    );
    return response.data;
  }

  async getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    const response: AxiosResponse<TMDBResponse<Movie>> = await this.api.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  }

  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    const response: AxiosResponse<TMDBResponse<Movie>> = await this.api.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  }

  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    const response: AxiosResponse<TMDBResponse<Movie>> = await this.api.get('/movie/upcoming', {
      params: { page },
    });
    return response.data;
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    const response: AxiosResponse<MovieDetails> = await this.api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos,similar,recommendations',
      },
    });
    return response.data;
  }

  async getMovieExternalIds(movieId: number): Promise<ExternalIds> {
    const response: AxiosResponse<ExternalIds> = await this.api.get(`/movie/${movieId}/external_ids`);
    return response.data;
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse<Movie>> {
    const response: AxiosResponse<TMDBResponse<Movie>> = await this.api.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  }





  async discoverMovies(params: {
    page?: number;
    genre?: number;
    year?: number;
    sort_by?: string;
    vote_average_gte?: number;
    vote_average_lte?: number;
  }): Promise<TMDBResponse<Movie>> {
    const response: AxiosResponse<TMDBResponse<Movie>> = await this.api.get('/discover/movie', {
      params: {
        page: params.page || 1,
        with_genres: params.genre,
        year: params.year,
        sort_by: params.sort_by || 'popularity.desc',
        'vote_average.gte': params.vote_average_gte,
        'vote_average.lte': params.vote_average_lte,
      },
    });
    return response.data;
  }

  // TV Shows
  async getTrendingTVShows(timeWindow: 'day' | 'week' = 'day'): Promise<TMDBResponse<TVShow>> {
    const response: AxiosResponse<TMDBResponse<TVShow>> = await this.api.get(
      `/trending/tv/${timeWindow}`
    );
    return response.data;
  }

  async getPopularTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    const response: AxiosResponse<TMDBResponse<TVShow>> = await this.api.get('/tv/popular', {
      params: { page },
    });
    return response.data;
  }

  async getTopRatedTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    const response: AxiosResponse<TMDBResponse<TVShow>> = await this.api.get('/tv/top_rated', {
      params: { page },
    });
    return response.data;
  }

  async getOnTheAirTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    const response: AxiosResponse<TMDBResponse<TVShow>> = await this.api.get('/tv/on_the_air', {
      params: { page },
    });
    return response.data;
  }

  async getTVShowDetails(tvId: number): Promise<TVShowDetails> {
    const response: AxiosResponse<TVShowDetails> = await this.api.get(`/tv/${tvId}`, {
      params: {
        append_to_response: 'credits,videos,similar,recommendations',
      },
    });
    return response.data;
  }

  async getTVShowExternalIds(tvId: number): Promise<ExternalIds> {
    const response: AxiosResponse<ExternalIds> = await this.api.get(`/tv/${tvId}/external_ids`);
    return response.data;
  }

  async searchTVShows(query: string, page: number = 1): Promise<TMDBResponse<TVShow>> {
    const response: AxiosResponse<TMDBResponse<TVShow>> = await this.api.get('/search/tv', {
      params: { query, page },
    });
    return response.data;
  }

  // People
  async getPopularPeople(page: number = 1): Promise<TMDBResponse<Person>> {
    const response: AxiosResponse<TMDBResponse<Person>> = await this.api.get('/person/popular', {
      params: { page },
    });
    return response.data;
  }

  async getPersonDetails(personId: number): Promise<PersonDetails> {
    const response: AxiosResponse<PersonDetails> = await this.api.get(`/person/${personId}`, {
      params: {
        append_to_response: 'combined_credits,movie_credits,tv_credits,images,external_ids',
      },
    });
    return response.data;
  }

  async getPersonCombinedCredits(personId: number): Promise<CombinedCredits> {
    const response: AxiosResponse<CombinedCredits> = await this.api.get(`/person/${personId}/combined_credits`);
    return response.data;
  }

  async getPersonMovieCredits(personId: number): Promise<MovieCredits> {
    const response: AxiosResponse<MovieCredits> = await this.api.get(`/person/${personId}/movie_credits`);
    return response.data;
  }

  async getPersonTVCredits(personId: number): Promise<TVCredits> {
    const response: AxiosResponse<TVCredits> = await this.api.get(`/person/${personId}/tv_credits`);
    return response.data;
  }

  async getPersonImages(personId: number): Promise<PersonImages> {
    const response: AxiosResponse<PersonImages> = await this.api.get(`/person/${personId}/images`);
    return response.data;
  }

  async getPersonExternalIds(personId: number): Promise<ExternalIds> {
    const response: AxiosResponse<ExternalIds> = await this.api.get(`/person/${personId}/external_ids`);
    return response.data;
  }

  async searchPeople(query: string, page: number = 1): Promise<TMDBResponse<Person>> {
    const response: AxiosResponse<TMDBResponse<Person>> = await this.api.get('/search/person', {
      params: { query, page },
    });
    return response.data;
  }

  async searchMulti(query: string, page: number = 1): Promise<TMDBResponse<Movie | TVShow | Person>> {
    const response: AxiosResponse<TMDBResponse<Movie | TVShow | Person>> = await this.api.get('/search/multi', {
      params: { query, page },
    });
    return response.data;
  }

  // Genres
  async getMovieGenres(): Promise<GenreResponse> {
    const response: AxiosResponse<GenreResponse> = await this.api.get('/genre/movie/list');
    return response.data;
  }

  async getTVGenres(): Promise<GenreResponse> {
    const response: AxiosResponse<GenreResponse> = await this.api.get('/genre/tv/list');
    return response.data;
  }

  // Enhanced Discover with comprehensive filters
  async discoverMoviesAdvanced(filters: DiscoverFilters = {}): Promise<TMDBResponse<Movie>> {
    const response: AxiosResponse<TMDBResponse<Movie>> = await this.api.get('/discover/movie', {
      params: {
        page: filters.page || 1,
        sort_by: filters.sort_by || 'popularity.desc',
        include_adult: filters.include_adult || false,
        include_video: filters.include_video || false,
        with_genres: filters.with_genres,
        without_genres: filters.without_genres,
        'primary_release_date.gte': filters['primary_release_date.gte'],
        'primary_release_date.lte': filters['primary_release_date.lte'],
        year: filters.year,
        primary_release_year: filters.primary_release_year,
        'vote_average.gte': filters['vote_average.gte'],
        'vote_average.lte': filters['vote_average.lte'],
        'vote_count.gte': filters['vote_count.gte'],
        'with_runtime.gte': filters['with_runtime.gte'],
        'with_runtime.lte': filters['with_runtime.lte'],
        with_original_language: filters.with_original_language,
        region: filters.region,
        with_companies: filters.with_companies,
        with_keywords: filters.with_keywords,
        without_keywords: filters.without_keywords,
        with_people: filters.with_people,
        with_cast: filters.with_cast,
        with_crew: filters.with_crew,
      },
    });
    return response.data;
  }

  async discoverTVAdvanced(filters: DiscoverFilters = {}): Promise<TMDBResponse<TVShow>> {
    const response: AxiosResponse<TMDBResponse<TVShow>> = await this.api.get('/discover/tv', {
      params: {
        page: filters.page || 1,
        sort_by: filters.sort_by || 'popularity.desc',
        include_adult: filters.include_adult || false,
        with_genres: filters.with_genres,
        without_genres: filters.without_genres,
        'first_air_date.gte': filters['first_air_date.gte'],
        'first_air_date.lte': filters['first_air_date.lte'],
        first_air_date_year: filters.first_air_date_year,
        'vote_average.gte': filters['vote_average.gte'],
        'vote_average.lte': filters['vote_average.lte'],
        'vote_count.gte': filters['vote_count.gte'],
        with_original_language: filters.with_original_language,
        region: filters.region,
        with_networks: filters.with_networks,
        with_companies: filters.with_companies,
        with_keywords: filters.with_keywords,
        without_keywords: filters.without_keywords,
        with_people: filters.with_people,
        with_cast: filters.with_cast,
        with_crew: filters.with_crew,
        with_status: filters.with_status,
        with_type: filters.with_type,
        air_date_gte: filters.air_date_gte,
        air_date_lte: filters.air_date_lte,
        timezone: filters.timezone,
      },
    });
    return response.data;
  }

  // Search with additional filters
  async searchMoviesAdvanced(query: string, filters: DiscoverFilters = {}): Promise<TMDBResponse<Movie>> {
    const response: AxiosResponse<TMDBResponse<Movie>> = await this.api.get('/search/movie', {
      params: {
        query,
        page: filters.page || 1,
        include_adult: filters.include_adult || false,
        region: filters.region,
        year: filters.year,
        primary_release_year: filters.primary_release_year,
      },
    });
    return response.data;
  }

  async searchTVAdvanced(query: string, filters: DiscoverFilters = {}): Promise<TMDBResponse<TVShow>> {
    const response: AxiosResponse<TMDBResponse<TVShow>> = await this.api.get('/search/tv', {
      params: {
        query,
        page: filters.page || 1,
        include_adult: filters.include_adult || false,
        first_air_date_year: filters.first_air_date_year,
      },
    });
    return response.data;
  }

  async searchMultiAdvanced(query: string, filters: DiscoverFilters = {}): Promise<TMDBResponse<Movie | TVShow | Person>> {
    const response: AxiosResponse<TMDBResponse<Movie | TVShow | Person>> = await this.api.get('/search/multi', {
      params: {
        query,
        page: filters.page || 1,
        include_adult: filters.include_adult || false,
        region: filters.region,
      },
    });
    return response.data;
  }

  // Watch Providers
  async getMovieWatchProviders(movieId: number): Promise<WatchProviderResponse> {
    const response: AxiosResponse<WatchProviderResponse> = await this.api.get(`/movie/${movieId}/watch/providers`);
    return response.data;
  }

  async getTVWatchProviders(tvId: number): Promise<WatchProviderResponse> {
    const response: AxiosResponse<WatchProviderResponse> = await this.api.get(`/tv/${tvId}/watch/providers`);
    return response.data;
  }

  async getWatchProviderRegions(): Promise<WatchProviderRegionsResponse> {
    const response: AxiosResponse<WatchProviderRegionsResponse> = await this.api.get('/watch/providers/regions');
    return response.data;
  }

  async getMovieWatchProviderList(): Promise<WatchProviderListResponse> {
    const response: AxiosResponse<WatchProviderListResponse> = await this.api.get('/watch/providers/movie');
    return response.data;
  }

  async getTVWatchProviderList(): Promise<WatchProviderListResponse> {
    const response: AxiosResponse<WatchProviderListResponse> = await this.api.get('/watch/providers/tv');
    return response.data;
  }

  // Now Playing & Airing Today
  async getNowPlayingMovies(page: number = 1, region?: string): Promise<TMDBResponse<Movie>> {
    const response: AxiosResponse<TMDBResponse<Movie>> = await this.api.get('/movie/now_playing', {
      params: { page, region },
    });
    return response.data;
  }

  async getAiringTodayTV(page: number = 1): Promise<TMDBResponse<TVShow>> {
    const response: AxiosResponse<TMDBResponse<TVShow>> = await this.api.get('/tv/airing_today', {
      params: { page },
    });
    return response.data;
  }

  async getOnTheAirTV(page: number = 1): Promise<TMDBResponse<TVShow>> {
    const response: AxiosResponse<TMDBResponse<TVShow>> = await this.api.get('/tv/on_the_air', {
      params: { page },
    });
    return response.data;
  }

  // TV Seasons
  async getSeasonDetails(seriesId: number, seasonNumber: number): Promise<SeasonDetails> {
    const response: AxiosResponse<SeasonDetails> = await this.api.get(`/tv/${seriesId}/season/${seasonNumber}`);
    return response.data;
  }

  async getSeasonCredits(seriesId: number, seasonNumber: number) {
    const response = await this.api.get(`/tv/${seriesId}/season/${seasonNumber}/credits`);
    return response.data;
  }

  async getSeasonImages(seriesId: number, seasonNumber: number) {
    const response = await this.api.get(`/tv/${seriesId}/season/${seasonNumber}/images`);
    return response.data;
  }

  async getSeasonVideos(seriesId: number, seasonNumber: number) {
    const response = await this.api.get(`/tv/${seriesId}/season/${seasonNumber}/videos`);
    return response.data;
  }

  async getSeasonExternalIds(seriesId: number, seasonNumber: number) {
    const response = await this.api.get(`/tv/${seriesId}/season/${seasonNumber}/external_ids`);
    return response.data;
  }

  // TV Episodes
  async getEpisodeDetails(seriesId: number, seasonNumber: number, episodeNumber: number): Promise<EpisodeDetails> {
    const response: AxiosResponse<EpisodeDetails> = await this.api.get(`/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`);
    return response.data;
  }

  async getEpisodeCredits(seriesId: number, seasonNumber: number, episodeNumber: number) {
    const response = await this.api.get(`/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/credits`);
    return response.data;
  }

  async getEpisodeImages(seriesId: number, seasonNumber: number, episodeNumber: number) {
    const response = await this.api.get(`/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/images`);
    return response.data;
  }

  async getEpisodeVideos(seriesId: number, seasonNumber: number, episodeNumber: number) {
    const response = await this.api.get(`/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/videos`);
    return response.data;
  }

  async getEpisodeExternalIds(seriesId: number, seasonNumber: number, episodeNumber: number) {
    const response = await this.api.get(`/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}/external_ids`);
    return response.data;
  }

  // Episode Groups
  async getEpisodeGroups(seriesId: number): Promise<{ results: EpisodeGroup[] }> {
    const response: AxiosResponse<{ results: EpisodeGroup[] }> = await this.api.get(`/tv/${seriesId}/episode_groups`);
    return response.data;
  }

  async getEpisodeGroupDetails(groupId: string): Promise<EpisodeGroupDetails> {
    const response: AxiosResponse<EpisodeGroupDetails> = await this.api.get(`/tv/episode_group/${groupId}`);
    return response.data;
  }
}

export const tmdbApi = new TMDBApi();
export default tmdbApi;