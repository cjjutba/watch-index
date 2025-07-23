export interface Genre {
  id: number;
  name: string;
}

export interface GenreResponse {
  genres: Genre[];
}

export interface DiscoverFilters {
  // Common filters
  page?: number;
  sort_by?: string;
  
  // Genre filters
  with_genres?: string; // comma-separated genre IDs
  without_genres?: string; // comma-separated genre IDs
  
  // Date filters
  'primary_release_date.gte'?: string; // YYYY-MM-DD format
  'primary_release_date.lte'?: string; // YYYY-MM-DD format
  'first_air_date.gte'?: string; // For TV shows
  'first_air_date.lte'?: string; // For TV shows
  year?: number;
  primary_release_year?: number; // For movies
  first_air_date_year?: number; // For TV shows
  
  // Rating filters
  'vote_average.gte'?: number; // 0-10
  'vote_average.lte'?: number; // 0-10
  'vote_count.gte'?: number; // Minimum vote count
  
  // Runtime filters (movies only)
  'with_runtime.gte'?: number; // Minutes
  'with_runtime.lte'?: number; // Minutes
  
  // Language and region
  with_original_language?: string; // ISO 639-1 code
  region?: string; // ISO 3166-1 code
  
  // Company and network filters
  with_companies?: string; // comma-separated company IDs
  with_networks?: string; // comma-separated network IDs (TV only)
  
  // Keyword filters
  with_keywords?: string; // comma-separated keyword IDs
  without_keywords?: string; // comma-separated keyword IDs
  
  // People filters
  with_people?: string; // comma-separated person IDs
  with_cast?: string; // comma-separated person IDs
  with_crew?: string; // comma-separated person IDs
  
  // Content filters
  include_adult?: boolean;
  include_video?: boolean; // Include videos (movies only)
  
  // Status filters (TV only)
  with_status?: string; // 0=Returning, 1=Planned, 2=In Production, 3=Ended, 4=Cancelled, 5=Pilot
  with_type?: string; // 0=Documentary, 1=News, 2=Miniseries, 3=Reality, 4=Scripted, 5=Talk Show, 6=Video
  
  // Air date filters (TV only)
  air_date_gte?: string; // YYYY-MM-DD
  air_date_lte?: string; // YYYY-MM-DD
  
  // Timezone (TV only)
  timezone?: string; // e.g., "America/New_York"
}

export interface SortOption {
  value: string;
  label: string;
  mediaType?: 'movie' | 'tv' | 'both';
}

export const MOVIE_SORT_OPTIONS: SortOption[] = [
  { value: 'popularity.desc', label: 'Most Popular', mediaType: 'movie' },
  { value: 'popularity.asc', label: 'Least Popular', mediaType: 'movie' },
  { value: 'release_date.desc', label: 'Newest First', mediaType: 'movie' },
  { value: 'release_date.asc', label: 'Oldest First', mediaType: 'movie' },
  { value: 'vote_average.desc', label: 'Highest Rated', mediaType: 'movie' },
  { value: 'vote_average.asc', label: 'Lowest Rated', mediaType: 'movie' },
  { value: 'vote_count.desc', label: 'Most Voted', mediaType: 'movie' },
  { value: 'vote_count.asc', label: 'Least Voted', mediaType: 'movie' },
  { value: 'title.asc', label: 'Title A-Z', mediaType: 'movie' },
  { value: 'title.desc', label: 'Title Z-A', mediaType: 'movie' },
  { value: 'revenue.desc', label: 'Highest Revenue', mediaType: 'movie' },
  { value: 'revenue.asc', label: 'Lowest Revenue', mediaType: 'movie' },
  { value: 'primary_release_date.desc', label: 'Release Date (Newest)', mediaType: 'movie' },
  { value: 'primary_release_date.asc', label: 'Release Date (Oldest)', mediaType: 'movie' },
  { value: 'original_title.asc', label: 'Original Title A-Z', mediaType: 'movie' },
  { value: 'original_title.desc', label: 'Original Title Z-A', mediaType: 'movie' }
];

export const TV_SORT_OPTIONS: SortOption[] = [
  { value: 'popularity.desc', label: 'Most Popular', mediaType: 'tv' },
  { value: 'popularity.asc', label: 'Least Popular', mediaType: 'tv' },
  { value: 'first_air_date.desc', label: 'Newest First', mediaType: 'tv' },
  { value: 'first_air_date.asc', label: 'Oldest First', mediaType: 'tv' },
  { value: 'vote_average.desc', label: 'Highest Rated', mediaType: 'tv' },
  { value: 'vote_average.asc', label: 'Lowest Rated', mediaType: 'tv' },
  { value: 'vote_count.desc', label: 'Most Voted', mediaType: 'tv' },
  { value: 'vote_count.asc', label: 'Least Voted', mediaType: 'tv' },
  { value: 'name.asc', label: 'Name A-Z', mediaType: 'tv' },
  { value: 'name.desc', label: 'Name Z-A', mediaType: 'tv' },
  { value: 'original_name.asc', label: 'Original Name A-Z', mediaType: 'tv' },
  { value: 'original_name.desc', label: 'Original Name Z-A', mediaType: 'tv' }
];

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ar', label: 'Arabic' },
  { value: 'ru', label: 'Russian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'nl', label: 'Dutch' },
  { value: 'sv', label: 'Swedish' },
  { value: 'da', label: 'Danish' },
  { value: 'no', label: 'Norwegian' },
  { value: 'fi', label: 'Finnish' },
  { value: 'pl', label: 'Polish' },
  { value: 'tr', label: 'Turkish' },
  { value: 'th', label: 'Thai' }
];

export const REGION_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'CN', label: 'China' },
  { value: 'IN', label: 'India' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'RU', label: 'Russia' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'SE', label: 'Sweden' },
  { value: 'DK', label: 'Denmark' },
  { value: 'NO', label: 'Norway' },
  { value: 'FI', label: 'Finland' }
];
