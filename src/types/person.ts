export interface Person {
  id: number;
  name: string;
  original_name: string;
  media_type?: string;
  adult: boolean;
  popularity: number;
  gender: number | null;
  known_for_department: string;
  profile_path: string | null;
  known_for?: Array<{
    id: number;
    title?: string;
    name?: string;
    original_title?: string;
    original_name?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    media_type: 'movie' | 'tv';
    adult: boolean;
    release_date?: string;
    first_air_date?: string;
    genre_ids: number[];
    vote_average: number;
    vote_count: number;
  }>;
}

export interface PersonDetails extends Person {
  also_known_as: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  homepage: string | null;
  imdb_id: string | null;
  place_of_birth: string | null;
  combined_credits?: CombinedCredits;
  movie_credits?: MovieCredits;
  tv_credits?: TVCredits;
  images?: PersonImages;
  external_ids?: ExternalIds;
}

export interface CombinedCredits {
  id: number;
  cast: CombinedCastCredit[];
  crew: CombinedCrewCredit[];
}

export interface CombinedCastCredit {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  character: string;
  credit_id: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: 'movie' | 'tv';
  adult?: boolean;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  episode_count?: number;
  order?: number;
}

export interface CombinedCrewCredit {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  job: string;
  department: string;
  credit_id: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: 'movie' | 'tv';
  adult?: boolean;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  episode_count?: number;
}

export interface MovieCredits {
  id: number;
  cast: MovieCastCredit[];
  crew: MovieCrewCredit[];
}

export interface MovieCastCredit {
  id: number;
  title: string;
  original_title: string;
  character: string;
  credit_id: string;
  order: number;
  poster_path: string | null;
  backdrop_path: string | null;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
}

export interface MovieCrewCredit {
  id: number;
  title: string;
  original_title: string;
  job: string;
  department: string;
  credit_id: string;
  poster_path: string | null;
  backdrop_path: string | null;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
}

export interface TVCredits {
  id: number;
  cast: TVCastCredit[];
  crew: TVCrewCredit[];
}

export interface TVCastCredit {
  id: number;
  name: string;
  original_name: string;
  character: string;
  credit_id: string;
  episode_count: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
}

export interface TVCrewCredit {
  id: number;
  name: string;
  original_name: string;
  job: string;
  department: string;
  credit_id: string;
  episode_count: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
}

export interface PersonImages {
  id: number;
  profiles: PersonImage[];
}

export interface PersonImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface ExternalIds {
  id: number;
  freebase_mid: string | null;
  freebase_id: string | null;
  imdb_id: string | null;
  tvrage_id: number | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
  tiktok_id: string | null;
  youtube_id: string | null;
}
