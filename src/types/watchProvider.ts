export interface WatchProvider {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

export interface WatchProviderRegion {
  link?: string;
  flatrate?: WatchProvider[]; // Streaming (subscription)
  rent?: WatchProvider[]; // Rental
  buy?: WatchProvider[]; // Purchase
  ads?: WatchProvider[]; // Free with ads
}

export interface WatchProviderResponse {
  id: number;
  results: {
    [countryCode: string]: WatchProviderRegion;
  };
}

export interface WatchProviderRegionInfo {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}

export interface WatchProviderRegionsResponse {
  results: WatchProviderRegionInfo[];
}

export interface WatchProviderInfo {
  display_priority: number;
  logo_path: string;
  provider_name: string;
  provider_id: number;
}

export interface WatchProviderListResponse {
  results: WatchProviderInfo[];
}

// Grouped watch providers for easier display
export interface GroupedWatchProviders {
  streaming: WatchProvider[];
  rent: WatchProvider[];
  buy: WatchProvider[];
  ads: WatchProvider[];
  link?: string;
}

// Popular streaming services with their brand colors
export const PROVIDER_COLORS: { [key: string]: string } = {
  'Netflix': '#E50914',
  'Amazon Prime Video': '#00A8E1',
  'Disney Plus': '#113CCF',
  'HBO Max': '#B026FF',
  'Hulu': '#1CE783',
  'Apple TV Plus': '#000000',
  'Paramount Plus': '#0064FF',
  'Peacock': '#000000',
  'YouTube': '#FF0000',
  'Google Play Movies': '#4285F4',
  'Vudu': '#3399FF',
  'Microsoft Store': '#00BCF2',
  'FandangoNOW': '#FF6600',
  'Crackle': '#FF6600',
  'Tubi': '#FA541C',
  'Pluto TV': '#000000',
  'IMDb TV': '#F5C518',
  'Roku Channel': '#662D91',
  'Crunchyroll': '#FF6600',
  'Funimation': '#5B4E75',
  'ESPN Plus': '#FF0000',
  'Discovery Plus': '#0077B6',
  'Showtime': '#FF0000',
  'Starz': '#000000',
  'Cinemax': '#FFD700',
  'Epix': '#000000',
  'BritBox': '#0066CC',
  'Acorn TV': '#8B4513',
  'Shudder': '#FF0000',
  'Sundance Now': '#FF6600',
  'Kanopy': '#FF6600',
  'Hoopla': '#0066CC',
  'Plex': '#E5A00D',
  'The Criterion Channel': '#000000'
};

// Provider type categories for better organization
export enum ProviderType {
  STREAMING = 'streaming',
  RENT = 'rent',
  BUY = 'buy',
  ADS = 'ads'
}

export interface ProviderTypeInfo {
  type: ProviderType;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export const PROVIDER_TYPE_INFO: { [key in ProviderType]: ProviderTypeInfo } = {
  [ProviderType.STREAMING]: {
    type: ProviderType.STREAMING,
    label: 'Stream',
    icon: '📺',
    description: 'Watch with subscription',
    color: 'bg-green-500'
  },
  [ProviderType.RENT]: {
    type: ProviderType.RENT,
    label: 'Rent',
    icon: '💰',
    description: 'Rent for limited time',
    color: 'bg-blue-500'
  },
  [ProviderType.BUY]: {
    type: ProviderType.BUY,
    label: 'Buy',
    icon: '🛒',
    description: 'Purchase to own',
    color: 'bg-purple-500'
  },
  [ProviderType.ADS]: {
    type: ProviderType.ADS,
    label: 'Free',
    icon: '📺',
    description: 'Watch with ads',
    color: 'bg-gray-500'
  }
};

// Common regions for quick access
export const COMMON_REGIONS = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'IN', name: 'India' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' }
];

// Helper function to get provider brand color
export const getProviderColor = (providerName: string): string => {
  return PROVIDER_COLORS[providerName] || '#6B7280'; // Default gray color
};

// Helper function to group providers by type
export const groupWatchProviders = (regionData: WatchProviderRegion): GroupedWatchProviders => {
  return {
    streaming: regionData.flatrate || [],
    rent: regionData.rent || [],
    buy: regionData.buy || [],
    ads: regionData.ads || [],
    link: regionData.link
  };
};

// Helper function to get all unique providers from a region
export const getAllProvidersFromRegion = (regionData: WatchProviderRegion): WatchProvider[] => {
  const allProviders: WatchProvider[] = [];
  
  if (regionData.flatrate) allProviders.push(...regionData.flatrate);
  if (regionData.rent) allProviders.push(...regionData.rent);
  if (regionData.buy) allProviders.push(...regionData.buy);
  if (regionData.ads) allProviders.push(...regionData.ads);
  
  // Remove duplicates based on provider_id
  const uniqueProviders = allProviders.filter((provider, index, self) => 
    index === self.findIndex(p => p.provider_id === provider.provider_id)
  );
  
  // Sort by display priority
  return uniqueProviders.sort((a, b) => a.display_priority - b.display_priority);
};

// Helper function to check if providers are available in a region
export const hasWatchProviders = (regionData: WatchProviderRegion | undefined): boolean => {
  if (!regionData) return false;
  
  return !!(
    (regionData.flatrate && regionData.flatrate.length > 0) ||
    (regionData.rent && regionData.rent.length > 0) ||
    (regionData.buy && regionData.buy.length > 0) ||
    (regionData.ads && regionData.ads.length > 0)
  );
};
