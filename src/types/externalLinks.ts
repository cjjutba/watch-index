// External IDs interface (matches TMDB API response)
export interface ExternalIds {
  imdb_id?: string | null;
  facebook_id?: string | null;
  instagram_id?: string | null;
  twitter_id?: string | null;
  wikidata_id?: string | null;
  freebase_mid?: string | null;
  freebase_id?: string | null;
  tvdb_id?: number | null;
  tvrage_id?: number | null;
}

// Extended external IDs for different content types
export interface MovieExternalIds extends ExternalIds {
  // Movies may have additional IDs in the future
}

export interface TVExternalIds extends ExternalIds {
  // TV shows may have additional IDs
}

export interface PersonExternalIds extends ExternalIds {
  // People may have additional social media IDs
}

export interface SeasonExternalIds extends ExternalIds {
  // Seasons may have specific IDs
}

export interface EpisodeExternalIds extends ExternalIds {
  // Episodes may have specific IDs
}

// External link configuration
export interface ExternalLinkConfig {
  id: string;
  name: string;
  baseUrl: string;
  icon: string; // Icon component name or URL
  color: string; // Brand color
  description: string;
  category: 'database' | 'social' | 'wiki' | 'streaming';
}

// Available external link platforms
export const EXTERNAL_LINK_CONFIGS: { [key: string]: ExternalLinkConfig } = {
  imdb: {
    id: 'imdb',
    name: 'IMDb',
    baseUrl: 'https://www.imdb.com/title/',
    icon: 'imdb',
    color: '#F5C518',
    description: 'Internet Movie Database',
    category: 'database'
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    baseUrl: 'https://www.facebook.com/',
    icon: 'facebook',
    color: '#1877F2',
    description: 'Official Facebook page',
    category: 'social'
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    baseUrl: 'https://www.instagram.com/',
    icon: 'instagram',
    color: '#E4405F',
    description: 'Official Instagram account',
    category: 'social'
  },
  twitter: {
    id: 'twitter',
    name: 'Twitter',
    baseUrl: 'https://twitter.com/',
    icon: 'twitter',
    color: '#1DA1F2',
    description: 'Official Twitter account',
    category: 'social'
  },
  wikidata: {
    id: 'wikidata',
    name: 'Wikidata',
    baseUrl: 'https://www.wikidata.org/wiki/',
    icon: 'wiki',
    color: '#006699',
    description: 'Wikidata entry',
    category: 'wiki'
  },
  tvdb: {
    id: 'tvdb',
    name: 'TheTVDB',
    baseUrl: 'https://thetvdb.com/series/',
    icon: 'tv',
    color: '#4CAF50',
    description: 'The Television Database',
    category: 'database'
  }
};

// Processed external link for display
export interface ExternalLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  description: string;
  category: 'database' | 'social' | 'wiki' | 'streaming';
}

// Grouped external links for better organization
export interface GroupedExternalLinks {
  database: ExternalLink[];
  social: ExternalLink[];
  wiki: ExternalLink[];
  streaming: ExternalLink[];
}

// Helper functions
export const buildExternalUrl = (platform: string, id: string | number): string => {
  const config = EXTERNAL_LINK_CONFIGS[platform];
  if (!config) return '';
  
  // Special handling for different platforms
  switch (platform) {
    case 'imdb':
      return `${config.baseUrl}${id}/`;
    case 'tvdb':
      return `${config.baseUrl}${id}`;
    case 'wikidata':
      return `${config.baseUrl}${id}`;
    default:
      return `${config.baseUrl}${id}`;
  }
};

export const processExternalIds = (externalIds: ExternalIds): ExternalLink[] => {
  const links: ExternalLink[] = [];
  
  // Process each available external ID
  Object.entries(externalIds).forEach(([key, value]) => {
    if (!value) return;
    
    // Map API keys to our platform keys
    const platformMap: { [key: string]: string } = {
      'imdb_id': 'imdb',
      'facebook_id': 'facebook',
      'instagram_id': 'instagram',
      'twitter_id': 'twitter',
      'wikidata_id': 'wikidata',
      'tvdb_id': 'tvdb'
    };
    
    const platform = platformMap[key];
    if (!platform) return;
    
    const config = EXTERNAL_LINK_CONFIGS[platform];
    if (!config) return;
    
    const url = buildExternalUrl(platform, value);
    if (!url) return;
    
    links.push({
      id: platform,
      name: config.name,
      url,
      icon: config.icon,
      color: config.color,
      description: config.description,
      category: config.category
    });
  });
  
  return links;
};

export const groupExternalLinks = (links: ExternalLink[]): GroupedExternalLinks => {
  return {
    database: links.filter(link => link.category === 'database'),
    social: links.filter(link => link.category === 'social'),
    wiki: links.filter(link => link.category === 'wiki'),
    streaming: links.filter(link => link.category === 'streaming')
  };
};

export const hasExternalLinks = (externalIds: ExternalIds): boolean => {
  return Object.values(externalIds).some(value => value !== null && value !== undefined);
};

// Platform-specific URL builders for special cases
export const buildIMDbPersonUrl = (imdbId: string): string => {
  return `https://www.imdb.com/name/${imdbId}/`;
};

export const buildIMDbMovieUrl = (imdbId: string): string => {
  return `https://www.imdb.com/title/${imdbId}/`;
};

export const buildIMDbTVUrl = (imdbId: string): string => {
  return `https://www.imdb.com/title/${imdbId}/`;
};

// Social media handle extractors
export const extractTwitterHandle = (twitterId: string): string => {
  // Remove @ if present
  return twitterId.replace(/^@/, '');
};

export const extractInstagramHandle = (instagramId: string): string => {
  // Remove @ if present
  return instagramId.replace(/^@/, '');
};

// Validation helpers
export const isValidIMDbId = (id: string): boolean => {
  return /^tt\d+$/.test(id) || /^nm\d+$/.test(id);
};

export const isValidTVDBId = (id: number): boolean => {
  return id > 0;
};

// Category display configuration
export const CATEGORY_CONFIG = {
  database: {
    label: 'Databases',
    icon: 'database',
    description: 'Movie and TV databases'
  },
  social: {
    label: 'Social Media',
    icon: 'users',
    description: 'Official social media accounts'
  },
  wiki: {
    label: 'Wiki',
    icon: 'book',
    description: 'Wikipedia and knowledge bases'
  },
  streaming: {
    label: 'Streaming',
    icon: 'play',
    description: 'Streaming platforms'
  }
};

// Analytics tracking for external link clicks
export interface ExternalLinkClickEvent {
  platform: string;
  contentType: 'movie' | 'tv' | 'person' | 'season' | 'episode';
  contentId: number;
  timestamp: Date;
}

export const trackExternalLinkClick = (event: ExternalLinkClickEvent): void => {
  // This could be connected to analytics services like Google Analytics
  console.log('External link clicked:', event);
  
  // Example: Send to analytics service
  // analytics.track('external_link_click', event);
};
