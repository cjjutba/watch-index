import { CastMember, CrewMember } from './movie';
import { ExternalIds } from './person';

export interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
}

export interface EpisodeDetails extends Episode {
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
    guest_stars: CastMember[];
  };
  external_ids: ExternalIds;
  images: {
    stills: {
      aspect_ratio: number;
      file_path: string;
      height: number;
      iso_639_1: string | null;
      vote_average: number;
      vote_count: number;
      width: number;
    }[];
  };
  videos: {
    results: {
      id: string;
      iso_639_1: string;
      iso_3166_1: string;
      key: string;
      name: string;
      official: boolean;
      published_at: string;
      site: string;
      size: number;
      type: string;
    }[];
  };
}

export interface Season {
  id: number;
  air_date: string;
  episode_count: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export interface SeasonDetails extends Season {
  episodes: Episode[];
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  external_ids: ExternalIds;
  images: {
    posters: {
      aspect_ratio: number;
      file_path: string;
      height: number;
      iso_639_1: string | null;
      vote_average: number;
      vote_count: number;
      width: number;
    }[];
  };
  videos: {
    results: {
      id: string;
      iso_639_1: string;
      iso_3166_1: string;
      key: string;
      name: string;
      official: boolean;
      published_at: string;
      site: string;
      size: number;
      type: string;
    }[];
  };
}

export interface EpisodeGroup {
  description: string;
  episode_count: number;
  group_count: number;
  id: string;
  name: string;
  network: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  };
  type: number;
}

export interface EpisodeGroupDetails extends EpisodeGroup {
  groups: {
    id: string;
    name: string;
    order: number;
    episodes: {
      air_date: string;
      episode_number: number;
      id: number;
      name: string;
      overview: string;
      production_code: string;
      runtime: number;
      season_number: number;
      show_id: number;
      still_path: string | null;
      vote_average: number;
      vote_count: number;
      order: number;
    }[];
    locked: boolean;
  }[];
}

// Helper interfaces for better organization
export interface SeasonSummary {
  season: Season;
  episodeCount: number;
  averageRating: number;
  latestEpisode?: Episode;
  nextEpisode?: Episode;
}

export interface EpisodeSummary {
  episode: Episode;
  seasonName: string;
  showName: string;
  previousEpisode?: Episode;
  nextEpisode?: Episode;
}

// Season status types
export enum SeasonStatus {
  UPCOMING = 'upcoming',
  AIRING = 'airing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Episode status types
export enum EpisodeStatus {
  UPCOMING = 'upcoming',
  AIRED = 'aired',
  UNKNOWN = 'unknown'
}

// Helper functions
export const getSeasonStatus = (season: Season): SeasonStatus => {
  const now = new Date();
  const airDate = new Date(season.air_date);
  
  if (airDate > now) {
    return SeasonStatus.UPCOMING;
  }
  
  // This would need additional data from the API to determine if still airing
  return SeasonStatus.COMPLETED;
};

export const getEpisodeStatus = (episode: Episode): EpisodeStatus => {
  if (!episode.air_date) return EpisodeStatus.UNKNOWN;
  
  const now = new Date();
  const airDate = new Date(episode.air_date);
  
  return airDate <= now ? EpisodeStatus.AIRED : EpisodeStatus.UPCOMING;
};

export const formatEpisodeNumber = (seasonNumber: number, episodeNumber: number): string => {
  const season = seasonNumber.toString().padStart(2, '0');
  const episode = episodeNumber.toString().padStart(2, '0');
  return `S${season}E${episode}`;
};

export const formatRuntime = (runtime: number | null): string => {
  if (!runtime) return 'Unknown';
  
  if (runtime < 60) {
    return `${runtime}m`;
  }
  
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${minutes}m`;
};

export const getSeasonTitle = (seasonNumber: number, seasonName?: string): string => {
  if (seasonNumber === 0) {
    return 'Specials';
  }
  
  if (seasonName && seasonName !== `Season ${seasonNumber}`) {
    return seasonName;
  }
  
  return `Season ${seasonNumber}`;
};

export const sortEpisodesByAirDate = (episodes: Episode[]): Episode[] => {
  return [...episodes].sort((a, b) => {
    if (!a.air_date && !b.air_date) return a.episode_number - b.episode_number;
    if (!a.air_date) return 1;
    if (!b.air_date) return -1;
    
    const dateA = new Date(a.air_date);
    const dateB = new Date(b.air_date);
    
    return dateA.getTime() - dateB.getTime();
  });
};

export const getNextEpisode = (episodes: Episode[], currentEpisode: Episode): Episode | undefined => {
  const sortedEpisodes = sortEpisodesByAirDate(episodes);
  const currentIndex = sortedEpisodes.findIndex(ep => ep.id === currentEpisode.id);
  
  if (currentIndex === -1 || currentIndex === sortedEpisodes.length - 1) {
    return undefined;
  }
  
  return sortedEpisodes[currentIndex + 1];
};

export const getPreviousEpisode = (episodes: Episode[], currentEpisode: Episode): Episode | undefined => {
  const sortedEpisodes = sortEpisodesByAirDate(episodes);
  const currentIndex = sortedEpisodes.findIndex(ep => ep.id === currentEpisode.id);
  
  if (currentIndex <= 0) {
    return undefined;
  }
  
  return sortedEpisodes[currentIndex - 1];
};
