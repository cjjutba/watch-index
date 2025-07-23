import { useState, useEffect } from 'react';
import { ExternalIds } from '../types/person';
import { ExternalLink, GroupedExternalLinks, processExternalIds, groupExternalLinks, hasExternalLinks, trackExternalLinkClick } from '../types/externalLinks';
import tmdbApi from '../services/tmdbApi';

export const useMovieExternalLinks = (movieId: number | null) => {
  const [externalIds, setExternalIds] = useState<ExternalIds | null>(null);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);
  const [groupedLinks, setGroupedLinks] = useState<GroupedExternalLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) {
      setLoading(false);
      return;
    }

    const fetchExternalIds = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tmdbApi.getMovieExternalIds(movieId);
        setExternalIds(response);
        
        const links = processExternalIds(response);
        setExternalLinks(links);
        setGroupedLinks(groupExternalLinks(links));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch external links');
        setExternalIds(null);
        setExternalLinks([]);
        setGroupedLinks(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExternalIds();
  }, [movieId]);

  const handleLinkClick = (platform: string) => {
    if (movieId) {
      trackExternalLinkClick({
        platform,
        contentType: 'movie',
        contentId: movieId,
        timestamp: new Date()
      });
    }
  };

  const hasLinks = externalIds ? hasExternalLinks(externalIds) : false;

  return {
    externalIds,
    externalLinks,
    groupedLinks,
    loading,
    error,
    hasLinks,
    handleLinkClick
  };
};

export const useTVShowExternalLinks = (tvId: number | null) => {
  const [externalIds, setExternalIds] = useState<ExternalIds | null>(null);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);
  const [groupedLinks, setGroupedLinks] = useState<GroupedExternalLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tvId) {
      setLoading(false);
      return;
    }

    const fetchExternalIds = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tmdbApi.getTVShowExternalIds(tvId);
        setExternalIds(response);
        
        const links = processExternalIds(response);
        setExternalLinks(links);
        setGroupedLinks(groupExternalLinks(links));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch external links');
        setExternalIds(null);
        setExternalLinks([]);
        setGroupedLinks(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExternalIds();
  }, [tvId]);

  const handleLinkClick = (platform: string) => {
    if (tvId) {
      trackExternalLinkClick({
        platform,
        contentType: 'tv',
        contentId: tvId,
        timestamp: new Date()
      });
    }
  };

  const hasLinks = externalIds ? hasExternalLinks(externalIds) : false;

  return {
    externalIds,
    externalLinks,
    groupedLinks,
    loading,
    error,
    hasLinks,
    handleLinkClick
  };
};

export const usePersonExternalLinks = (personId: number | null) => {
  const [externalIds, setExternalIds] = useState<ExternalIds | null>(null);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);
  const [groupedLinks, setGroupedLinks] = useState<GroupedExternalLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!personId) {
      setLoading(false);
      return;
    }

    const fetchExternalIds = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tmdbApi.getPersonExternalIds(personId);
        setExternalIds(response);
        
        const links = processExternalIds(response);
        setExternalLinks(links);
        setGroupedLinks(groupExternalLinks(links));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch external links');
        setExternalIds(null);
        setExternalLinks([]);
        setGroupedLinks(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExternalIds();
  }, [personId]);

  const handleLinkClick = (platform: string) => {
    if (personId) {
      trackExternalLinkClick({
        platform,
        contentType: 'person',
        contentId: personId,
        timestamp: new Date()
      });
    }
  };

  const hasLinks = externalIds ? hasExternalLinks(externalIds) : false;

  return {
    externalIds,
    externalLinks,
    groupedLinks,
    loading,
    error,
    hasLinks,
    handleLinkClick
  };
};

export const useSeasonExternalLinks = (seriesId: number | null, seasonNumber: number | null) => {
  const [externalIds, setExternalIds] = useState<ExternalIds | null>(null);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);
  const [groupedLinks, setGroupedLinks] = useState<GroupedExternalLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!seriesId || seasonNumber === null) {
      setLoading(false);
      return;
    }

    const fetchExternalIds = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tmdbApi.getSeasonExternalIds(seriesId, seasonNumber);
        setExternalIds(response);
        
        const links = processExternalIds(response);
        setExternalLinks(links);
        setGroupedLinks(groupExternalLinks(links));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch external links');
        setExternalIds(null);
        setExternalLinks([]);
        setGroupedLinks(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExternalIds();
  }, [seriesId, seasonNumber]);

  const handleLinkClick = (platform: string) => {
    if (seriesId) {
      trackExternalLinkClick({
        platform,
        contentType: 'season',
        contentId: seriesId,
        timestamp: new Date()
      });
    }
  };

  const hasLinks = externalIds ? hasExternalLinks(externalIds) : false;

  return {
    externalIds,
    externalLinks,
    groupedLinks,
    loading,
    error,
    hasLinks,
    handleLinkClick
  };
};

export const useEpisodeExternalLinks = (
  seriesId: number | null, 
  seasonNumber: number | null, 
  episodeNumber: number | null
) => {
  const [externalIds, setExternalIds] = useState<ExternalIds | null>(null);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);
  const [groupedLinks, setGroupedLinks] = useState<GroupedExternalLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!seriesId || seasonNumber === null || episodeNumber === null) {
      setLoading(false);
      return;
    }

    const fetchExternalIds = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tmdbApi.getEpisodeExternalIds(seriesId, seasonNumber, episodeNumber);
        setExternalIds(response);
        
        const links = processExternalIds(response);
        setExternalLinks(links);
        setGroupedLinks(groupExternalLinks(links));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch external links');
        setExternalIds(null);
        setExternalLinks([]);
        setGroupedLinks(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExternalIds();
  }, [seriesId, seasonNumber, episodeNumber]);

  const handleLinkClick = (platform: string) => {
    if (seriesId) {
      trackExternalLinkClick({
        platform,
        contentType: 'episode',
        contentId: seriesId,
        timestamp: new Date()
      });
    }
  };

  const hasLinks = externalIds ? hasExternalLinks(externalIds) : false;

  return {
    externalIds,
    externalLinks,
    groupedLinks,
    loading,
    error,
    hasLinks,
    handleLinkClick
  };
};
