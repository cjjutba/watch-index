import { useState, useEffect } from 'react';
import { TVShow, TVShowDetails } from '../types/tvshow';
import { TMDBResponse } from '../types/api';
import tmdbApi from '../services/tmdbApi';

export const useTVShows = (endpoint: 'popular' | 'top_rated' | 'on_the_air' | 'trending') => {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        setLoading(true);
        setError(null);

        let response: TMDBResponse<TVShow>;
        
        switch (endpoint) {
          case 'popular':
            response = await tmdbApi.getPopularTVShows(page);
            break;
          case 'top_rated':
            response = await tmdbApi.getTopRatedTVShows(page);
            break;
          case 'on_the_air':
            response = await tmdbApi.getOnTheAirTVShows(page);
            break;
          case 'trending':
            response = await tmdbApi.getTrendingTVShows();
            break;
          default:
            throw new Error('Invalid endpoint');
        }

        if (page === 1) {
          setTVShows(response.results);
        } else {
          setTVShows(prev => [...prev, ...response.results]);
        }
        
        setTotalPages(response.total_pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTVShows();
  }, [endpoint, page]);

  const loadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const hasMore = page < totalPages;

  return {
    tvShows,
    loading,
    error,
    loadMore,
    hasMore,
    totalPages,
    currentPage: page
  };
};

export const useTVShowDetails = (tvId: number | null) => {
  const [tvShow, setTVShow] = useState<TVShowDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tvId) {
      setLoading(false);
      return;
    }

    const fetchTVShowDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdbApi.getTVShowDetails(tvId);
        setTVShow(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTVShowDetails();
  }, [tvId]);

  return {
    tvShow,
    loading,
    error
  };
};
