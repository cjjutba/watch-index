import { useState, useEffect } from 'react';
import { Movie } from '../types/movie';
import { TVShow } from '../types/tvshow';
import { TMDBResponse } from '../types/api';
import tmdbApi from '../services/tmdbApi';

export const useNowPlayingMovies = (region?: string) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const fetchMovies = async (pageNum: number = 1, resetData: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tmdbApi.getNowPlayingMovies(pageNum, region);
      
      if (resetData || pageNum === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      
      setPage(pageNum);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch now playing movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(1, true);
  }, [region]);

  const loadMore = () => {
    if (page < totalPages && !loading) {
      fetchMovies(page + 1, false);
    }
  };

  const refresh = () => {
    fetchMovies(1, true);
  };

  const hasMore = page < totalPages;

  return {
    movies,
    loading,
    error,
    loadMore,
    refresh,
    hasMore,
    page,
    totalPages,
    totalResults
  };
};

export const useAiringTodayTV = () => {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const fetchTVShows = async (pageNum: number = 1, resetData: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tmdbApi.getAiringTodayTV(pageNum);
      
      if (resetData || pageNum === 1) {
        setTVShows(response.results);
      } else {
        setTVShows(prev => [...prev, ...response.results]);
      }
      
      setPage(pageNum);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch airing today TV shows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTVShows(1, true);
  }, []);

  const loadMore = () => {
    if (page < totalPages && !loading) {
      fetchTVShows(page + 1, false);
    }
  };

  const refresh = () => {
    fetchTVShows(1, true);
  };

  const hasMore = page < totalPages;

  return {
    tvShows,
    loading,
    error,
    loadMore,
    refresh,
    hasMore,
    page,
    totalPages,
    totalResults
  };
};

export const useOnTheAirTV = () => {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const fetchTVShows = async (pageNum: number = 1, resetData: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tmdbApi.getOnTheAirTV(pageNum);
      
      if (resetData || pageNum === 1) {
        setTVShows(response.results);
      } else {
        setTVShows(prev => [...prev, ...response.results]);
      }
      
      setPage(pageNum);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch on the air TV shows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTVShows(1, true);
  }, []);

  const loadMore = () => {
    if (page < totalPages && !loading) {
      fetchTVShows(page + 1, false);
    }
  };

  const refresh = () => {
    fetchTVShows(1, true);
  };

  const hasMore = page < totalPages;

  return {
    tvShows,
    loading,
    error,
    loadMore,
    refresh,
    hasMore,
    page,
    totalPages,
    totalResults
  };
};

// Combined hook for getting both now playing movies and airing today TV shows
export const useNowPlayingContent = (region?: string) => {
  const nowPlayingMovies = useNowPlayingMovies(region);
  const airingTodayTV = useAiringTodayTV();

  const isLoading = nowPlayingMovies.loading || airingTodayTV.loading;
  const hasError = nowPlayingMovies.error || airingTodayTV.error;

  const refresh = () => {
    nowPlayingMovies.refresh();
    airingTodayTV.refresh();
  };

  return {
    movies: nowPlayingMovies,
    tvShows: airingTodayTV,
    isLoading,
    hasError,
    refresh
  };
};
