import { useState, useEffect } from 'react';
import { WatchProviderResponse, WatchProviderRegion, GroupedWatchProviders, WatchProviderRegionsResponse, groupWatchProviders, hasWatchProviders } from '../types/watchProvider';
import tmdbApi from '../services/tmdbApi';

export const useMovieWatchProviders = (movieId: number | null, region: string = 'US') => {
  const [watchProviders, setWatchProviders] = useState<WatchProviderResponse | null>(null);
  const [regionData, setRegionData] = useState<WatchProviderRegion | null>(null);
  const [groupedProviders, setGroupedProviders] = useState<GroupedWatchProviders | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasProviders, setHasProviders] = useState(false);

  useEffect(() => {
    if (!movieId) {
      setLoading(false);
      return;
    }

    const fetchWatchProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tmdbApi.getMovieWatchProviders(movieId);
        setWatchProviders(response);
        
        const currentRegionData = response.results[region];
        setRegionData(currentRegionData || null);
        
        if (currentRegionData) {
          const grouped = groupWatchProviders(currentRegionData);
          setGroupedProviders(grouped);
          setHasProviders(hasWatchProviders(currentRegionData));
        } else {
          setGroupedProviders(null);
          setHasProviders(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch watch providers');
        setWatchProviders(null);
        setRegionData(null);
        setGroupedProviders(null);
        setHasProviders(false);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchProviders();
  }, [movieId, region]);

  const changeRegion = (newRegion: string) => {
    if (watchProviders) {
      const newRegionData = watchProviders.results[newRegion];
      setRegionData(newRegionData || null);
      
      if (newRegionData) {
        const grouped = groupWatchProviders(newRegionData);
        setGroupedProviders(grouped);
        setHasProviders(hasWatchProviders(newRegionData));
      } else {
        setGroupedProviders(null);
        setHasProviders(false);
      }
    }
  };

  const availableRegions = watchProviders ? Object.keys(watchProviders.results) : [];

  return {
    watchProviders,
    regionData,
    groupedProviders,
    loading,
    error,
    hasProviders,
    availableRegions,
    changeRegion
  };
};

export const useTVWatchProviders = (tvId: number | null, region: string = 'US') => {
  const [watchProviders, setWatchProviders] = useState<WatchProviderResponse | null>(null);
  const [regionData, setRegionData] = useState<WatchProviderRegion | null>(null);
  const [groupedProviders, setGroupedProviders] = useState<GroupedWatchProviders | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasProviders, setHasProviders] = useState(false);

  useEffect(() => {
    if (!tvId) {
      setLoading(false);
      return;
    }

    const fetchWatchProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tmdbApi.getTVWatchProviders(tvId);
        setWatchProviders(response);
        
        const currentRegionData = response.results[region];
        setRegionData(currentRegionData || null);
        
        if (currentRegionData) {
          const grouped = groupWatchProviders(currentRegionData);
          setGroupedProviders(grouped);
          setHasProviders(hasWatchProviders(currentRegionData));
        } else {
          setGroupedProviders(null);
          setHasProviders(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch watch providers');
        setWatchProviders(null);
        setRegionData(null);
        setGroupedProviders(null);
        setHasProviders(false);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchProviders();
  }, [tvId, region]);

  const changeRegion = (newRegion: string) => {
    if (watchProviders) {
      const newRegionData = watchProviders.results[newRegion];
      setRegionData(newRegionData || null);
      
      if (newRegionData) {
        const grouped = groupWatchProviders(newRegionData);
        setGroupedProviders(grouped);
        setHasProviders(hasWatchProviders(newRegionData));
      } else {
        setGroupedProviders(null);
        setHasProviders(false);
      }
    }
  };

  const availableRegions = watchProviders ? Object.keys(watchProviders.results) : [];

  return {
    watchProviders,
    regionData,
    groupedProviders,
    loading,
    error,
    hasProviders,
    availableRegions,
    changeRegion
  };
};

export const useWatchProviderRegions = () => {
  const [regions, setRegions] = useState<WatchProviderRegionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdbApi.getWatchProviderRegions();
        setRegions(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch regions');
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  return {
    regions: regions?.results || [],
    loading,
    error
  };
};

// Custom hook for managing user's preferred region
export const useUserRegion = () => {
  const [userRegion, setUserRegion] = useState<string>(() => {
    // Try to get from localStorage first
    const saved = localStorage.getItem('watchindex-user-region');
    if (saved) return saved;
    
    // Try to detect from browser locale
    const locale = navigator.language || 'en-US';
    const countryCode = locale.split('-')[1];
    
    // Map common country codes
    const regionMap: { [key: string]: string } = {
      'US': 'US',
      'GB': 'GB',
      'CA': 'CA',
      'AU': 'AU',
      'DE': 'DE',
      'FR': 'FR',
      'ES': 'ES',
      'IT': 'IT',
      'JP': 'JP',
      'KR': 'KR',
      'BR': 'BR',
      'MX': 'MX',
      'IN': 'IN',
      'NL': 'NL',
      'SE': 'SE',
      'NO': 'NO',
      'DK': 'DK',
      'FI': 'FI'
    };
    
    return regionMap[countryCode] || 'US';
  });

  const updateUserRegion = (region: string) => {
    setUserRegion(region);
    localStorage.setItem('watchindex-user-region', region);
  };

  return {
    userRegion,
    updateUserRegion
  };
};
