import { Movie } from './movie';

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBError {
  status_message: string;
  status_code: number;
}

export interface SearchResult {
  page: number;
  results: (Movie | TVShow | Person)[];
  total_pages: number;
  total_results: number;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  popularity: number;
  original_language: string;
  original_name: string;
  origin_country: string[];
  media_type?: string;
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  adult: boolean;
  popularity: number;
  known_for_department: string;
  known_for: (Movie | TVShow)[];
  media_type?: string;
}

export type MediaType = 'movie' | 'tv' | 'person';