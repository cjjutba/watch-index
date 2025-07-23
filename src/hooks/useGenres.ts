import { useState, useEffect } from 'react';
import { Movie } from '../types/movie';
import { TVShow } from '../types/tvshow';
import { Genre } from '../types/genre';
import { TMDBResponse } from '../types/api';
import tmdbApi from '../services/tmdbApi';

export const useGenreMovies = (genreId: number | null, sortBy: string = 'popularity.desc') => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const fetchMovies = async (pageNum: number = 1, resetData: boolean = false) => {
    if (!genreId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await tmdbApi.discoverMoviesAdvanced({
        page: pageNum,
        with_genres: genreId.toString(),
        sort_by: sortBy,
        include_adult: false
      });
      
      if (resetData || pageNum === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      
      setPage(pageNum);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch genre movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (genreId) {
      fetchMovies(1, true);
    }
  }, [genreId, sortBy]);

  const loadMore = () => {
    if (page < totalPages && !loading) {
      fetchMovies(page + 1, false);
    }
  };

  const refresh = (newSortBy?: string) => {
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

export const useGenreTVShows = (genreId: number | null, sortBy: string = 'popularity.desc') => {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const fetchTVShows = async (pageNum: number = 1, resetData: boolean = false) => {
    if (!genreId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await tmdbApi.discoverTVAdvanced({
        page: pageNum,
        with_genres: genreId.toString(),
        sort_by: sortBy,
        include_adult: false
      });
      
      if (resetData || pageNum === 1) {
        setTVShows(response.results);
      } else {
        setTVShows(prev => [...prev, ...response.results]);
      }
      
      setPage(pageNum);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch genre TV shows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (genreId) {
      fetchTVShows(1, true);
    }
  }, [genreId, sortBy]);

  const loadMore = () => {
    if (page < totalPages && !loading) {
      fetchTVShows(page + 1, false);
    }
  };

  const refresh = (newSortBy?: string) => {
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

// Combined hook for getting both movies and TV shows for a genre
export const useGenreContent = (genreId: number | null, sortBy: string = 'popularity.desc') => {
  const movies = useGenreMovies(genreId, sortBy);
  const tvShows = useGenreTVShows(genreId, sortBy);

  const isLoading = movies.loading || tvShows.loading;
  const hasError = movies.error || tvShows.error;

  const refresh = (newSortBy?: string) => {
    movies.refresh(newSortBy);
    tvShows.refresh(newSortBy);
  };

  return {
    movies,
    tvShows,
    isLoading,
    hasError,
    refresh
  };
};

// Hook for getting popular content from multiple genres (for home page)
export const usePopularGenreContent = (genreIds: number[], limit: number = 6) => {
  const [content, setContent] = useState<{
    [genreId: number]: {
      genre: Genre | null;
      movies: Movie[];
      tvShows: TVShow[];
    }
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenreContent = async () => {
      if (genreIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get genres first
        const [movieGenres, tvGenres] = await Promise.all([
          tmdbApi.getMovieGenres(),
          tmdbApi.getTVGenres()
        ]);

        const allGenres = [...movieGenres.genres, ...tvGenres.genres];
        const genreMap = new Map(allGenres.map(g => [g.id, g]));

        // Fetch content for each genre
        const genreContent: typeof content = {};

        for (const genreId of genreIds) {
          const [movieResponse, tvResponse] = await Promise.all([
            tmdbApi.discoverMoviesAdvanced({
              with_genres: genreId.toString(),
              sort_by: 'popularity.desc',
              page: 1
            }),
            tmdbApi.discoverTVAdvanced({
              with_genres: genreId.toString(),
              sort_by: 'popularity.desc',
              page: 1
            })
          ]);

          genreContent[genreId] = {
            genre: genreMap.get(genreId) || null,
            movies: movieResponse.results.slice(0, limit),
            tvShows: tvResponse.results.slice(0, limit)
          };
        }

        setContent(genreContent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch genre content');
      } finally {
        setLoading(false);
      }
    };

    fetchGenreContent();
  }, [genreIds.join(','), limit]);

  return {
    content,
    loading,
    error
  };
};

// Hook for getting a single genre's info and sample content
export const useGenrePreview = (genreId: number | null, limit: number = 12) => {
  const [genre, setGenre] = useState<Genre | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenrePreview = async () => {
      if (!genreId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get genres and content in parallel
        const [movieGenres, tvGenres, movieResponse, tvResponse] = await Promise.all([
          tmdbApi.getMovieGenres(),
          tmdbApi.getTVGenres(),
          tmdbApi.discoverMoviesAdvanced({
            with_genres: genreId.toString(),
            sort_by: 'popularity.desc',
            page: 1
          }),
          tmdbApi.discoverTVAdvanced({
            with_genres: genreId.toString(),
            sort_by: 'popularity.desc',
            page: 1
          })
        ]);

        // Find the genre
        const allGenres = [...movieGenres.genres, ...tvGenres.genres];
        const foundGenre = allGenres.find(g => g.id === genreId);

        setGenre(foundGenre || null);
        setMovies(movieResponse.results.slice(0, limit));
        setTVShows(tvResponse.results.slice(0, limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch genre preview');
      } finally {
        setLoading(false);
      }
    };

    fetchGenrePreview();
  }, [genreId, limit]);

  return {
    genre,
    movies,
    tvShows,
    loading,
    error
  };
};
