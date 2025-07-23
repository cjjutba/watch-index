import { useState, useEffect } from 'react';
import { Movie, MovieDetails } from '../types/movie';
import { TMDBResponse } from '../types/api';
import tmdbApi from '../services/tmdbApi';

export const useMovies = (endpoint: 'popular' | 'top_rated' | 'upcoming' | 'trending') => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response: TMDBResponse<Movie>;
        
        switch (endpoint) {
          case 'popular':
            response = await tmdbApi.getPopularMovies(page);
            break;
          case 'top_rated':
            response = await tmdbApi.getTopRatedMovies(page);
            break;
          case 'upcoming':
            response = await tmdbApi.getUpcomingMovies(page);
            break;
          case 'trending':
            response = await tmdbApi.getTrendingMovies();
            break;
          default:
            throw new Error('Invalid endpoint');
        }

        if (page === 1) {
          setMovies(response.results);
        } else {
          setMovies(prev => [...prev, ...response.results]);
        }
        
        setTotalPages(response.total_pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [endpoint, page]);

  const loadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const refresh = () => {
    setPage(1);
    setMovies([]);
  };

  return {
    movies,
    loading,
    error,
    page,
    totalPages,
    loadMore,
    refresh,
    hasMore: page < totalPages,
  };
};

export const useMovieDetails = (movieId: number | null) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdbApi.getMovieDetails(movieId);
        setMovie(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  return { movie, loading, error };
};