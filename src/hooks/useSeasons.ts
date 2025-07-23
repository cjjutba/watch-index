import { useState, useEffect } from 'react';
import { SeasonDetails, EpisodeDetails, Episode, EpisodeGroup, EpisodeGroupDetails } from '../types/season';
import tmdbApi from '../services/tmdbApi';

export const useSeasonDetails = (seriesId: number | null, seasonNumber: number | null) => {
  const [season, setSeason] = useState<SeasonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!seriesId || seasonNumber === null) {
      setLoading(false);
      return;
    }

    const fetchSeasonDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tmdbApi.getSeasonDetails(seriesId, seasonNumber);
        setSeason(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch season details');
        setSeason(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonDetails();
  }, [seriesId, seasonNumber]);

  const refresh = () => {
    if (seriesId && seasonNumber !== null) {
      const fetchSeasonDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await tmdbApi.getSeasonDetails(seriesId, seasonNumber);
          setSeason(response);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch season details');
        } finally {
          setLoading(false);
        }
      };

      fetchSeasonDetails();
    }
  };

  return {
    season,
    loading,
    error,
    refresh
  };
};

export const useEpisodeDetails = (
  seriesId: number | null, 
  seasonNumber: number | null, 
  episodeNumber: number | null
) => {
  const [episode, setEpisode] = useState<EpisodeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!seriesId || seasonNumber === null || episodeNumber === null) {
      setLoading(false);
      return;
    }

    const fetchEpisodeDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tmdbApi.getEpisodeDetails(seriesId, seasonNumber, episodeNumber);
        setEpisode(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch episode details');
        setEpisode(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeDetails();
  }, [seriesId, seasonNumber, episodeNumber]);

  const refresh = () => {
    if (seriesId && seasonNumber !== null && episodeNumber !== null) {
      const fetchEpisodeDetails = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await tmdbApi.getEpisodeDetails(seriesId, seasonNumber, episodeNumber);
          setEpisode(response);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch episode details');
        } finally {
          setLoading(false);
        }
      };

      fetchEpisodeDetails();
    }
  };

  return {
    episode,
    loading,
    error,
    refresh
  };
};

export const useEpisodeGroups = (seriesId: number | null) => {
  const [episodeGroups, setEpisodeGroups] = useState<EpisodeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!seriesId) {
      setLoading(false);
      return;
    }

    const fetchEpisodeGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tmdbApi.getEpisodeGroups(seriesId);
        setEpisodeGroups(response.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch episode groups');
        setEpisodeGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeGroups();
  }, [seriesId]);

  return {
    episodeGroups,
    loading,
    error
  };
};

export const useEpisodeGroupDetails = (groupId: string | null) => {
  const [episodeGroup, setEpisodeGroup] = useState<EpisodeGroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    const fetchEpisodeGroupDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tmdbApi.getEpisodeGroupDetails(groupId);
        setEpisodeGroup(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch episode group details');
        setEpisodeGroup(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeGroupDetails();
  }, [groupId]);

  return {
    episodeGroup,
    loading,
    error
  };
};

// Hook for managing season navigation
export const useSeasonNavigation = (seasons: { season_number: number; name: string }[], currentSeason: number) => {
  const [selectedSeason, setSelectedSeason] = useState(currentSeason);

  const nextSeason = seasons.find(s => s.season_number > selectedSeason);
  const previousSeason = seasons
    .filter(s => s.season_number < selectedSeason)
    .sort((a, b) => b.season_number - a.season_number)[0];

  const goToNextSeason = () => {
    if (nextSeason) {
      setSelectedSeason(nextSeason.season_number);
    }
  };

  const goToPreviousSeason = () => {
    if (previousSeason) {
      setSelectedSeason(previousSeason.season_number);
    }
  };

  const goToSeason = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
  };

  return {
    selectedSeason,
    nextSeason,
    previousSeason,
    goToNextSeason,
    goToPreviousSeason,
    goToSeason,
    hasNext: !!nextSeason,
    hasPrevious: !!previousSeason
  };
};

// Hook for managing episode navigation within a season
export const useEpisodeNavigation = (episodes: Episode[], currentEpisodeNumber: number) => {
  const [selectedEpisode, setSelectedEpisode] = useState(currentEpisodeNumber);

  const sortedEpisodes = [...episodes].sort((a, b) => a.episode_number - b.episode_number);
  const currentIndex = sortedEpisodes.findIndex(ep => ep.episode_number === selectedEpisode);
  
  const nextEpisode = currentIndex < sortedEpisodes.length - 1 ? sortedEpisodes[currentIndex + 1] : null;
  const previousEpisode = currentIndex > 0 ? sortedEpisodes[currentIndex - 1] : null;

  const goToNextEpisode = () => {
    if (nextEpisode) {
      setSelectedEpisode(nextEpisode.episode_number);
    }
  };

  const goToPreviousEpisode = () => {
    if (previousEpisode) {
      setSelectedEpisode(previousEpisode.episode_number);
    }
  };

  const goToEpisode = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
  };

  return {
    selectedEpisode,
    nextEpisode,
    previousEpisode,
    goToNextEpisode,
    goToPreviousEpisode,
    goToEpisode,
    hasNext: !!nextEpisode,
    hasPrevious: !!previousEpisode,
    currentEpisode: sortedEpisodes[currentIndex] || null
  };
};
