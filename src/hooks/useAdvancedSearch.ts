import { useState, useEffect, useCallback } from 'react';
import { Movie } from '../types/movie';
import { TVShow } from '../types/tvshow';
import { Person } from '../types/person';
import { Genre, GenreResponse, DiscoverFilters } from '../types/genre';
import { TMDBResponse } from '../types/api';
import tmdbApi from '../services/tmdbApi';

export const useGenres = () => {
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [tvGenres, setTVGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [movieResponse, tvResponse] = await Promise.all([
          tmdbApi.getMovieGenres(),
          tmdbApi.getTVGenres()
        ]);
        
        setMovieGenres(movieResponse.genres);
        setTVGenres(tvResponse.genres);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch genres');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return {
    movieGenres,
    tvGenres,
    loading,
    error
  };
};

export const useDiscoverMovies = (filters: DiscoverFilters = {}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const fetchMovies = async (newFilters: DiscoverFilters = {}, resetPage = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = resetPage ? 1 : page;
      const response = await tmdbApi.discoverMoviesAdvanced({
        ...filters,
        ...newFilters,
        page: currentPage
      });
      
      if (resetPage || currentPage === 1) {
        setMovies(response.results);
        setPage(1);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to discover movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(filters, true);
  }, [JSON.stringify(filters)]);

  const loadMore = () => {
    if (page < totalPages && !loading) {
      setPage(prev => prev + 1);
      fetchMovies(filters, false);
    }
  };

  const refresh = (newFilters: DiscoverFilters = {}) => {
    fetchMovies(newFilters, true);
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

export const useDiscoverTV = (filters: DiscoverFilters = {}) => {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const fetchTVShows = async (newFilters: DiscoverFilters = {}, resetPage = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = resetPage ? 1 : page;
      const response = await tmdbApi.discoverTVAdvanced({
        ...filters,
        ...newFilters,
        page: currentPage
      });
      
      if (resetPage || currentPage === 1) {
        setTVShows(response.results);
        setPage(1);
      } else {
        setTVShows(prev => [...prev, ...response.results]);
      }
      
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to discover TV shows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTVShows(filters, true);
  }, [JSON.stringify(filters)]);

  const loadMore = () => {
    if (page < totalPages && !loading) {
      setPage(prev => prev + 1);
      fetchTVShows(filters, false);
    }
  };

  const refresh = (newFilters: DiscoverFilters = {}) => {
    fetchTVShows(newFilters, true);
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

export const useAdvancedSearch = () => {
  const [results, setResults] = useState<{
    movies: Movie[];
    tvShows: TVShow[];
    people: Person[];
  }>({
    movies: [],
    tvShows: [],
    people: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentFilters, setCurrentFilters] = useState<DiscoverFilters>({});
  const [currentSearchType, setCurrentSearchType] = useState<'multi' | 'movie' | 'tv' | 'person'>('multi');

  const search = useCallback(async (
    query: string,
    filters: DiscoverFilters = {},
    searchType: 'multi' | 'movie' | 'tv' | 'person' = 'multi',
    resetPage = true
  ) => {
    if (!query.trim()) {
      setResults({ movies: [], tvShows: [], people: [] });
      setTotalResults(0);
      setPage(1);
      setTotalPages(0);
      return;
    }

    // Store current search parameters
    setCurrentQuery(query);
    setCurrentFilters(filters);
    setCurrentSearchType(searchType);

    if (resetPage) {
      setPage(1);
    }

    try {
      setLoading(true);
      setError(null);

      const currentPage = resetPage ? 1 : page;
      const searchFilters = { ...filters, page: currentPage };

      if (searchType === 'multi') {
        const response = await tmdbApi.searchMultiAdvanced(query, searchFilters);
        const movies = response.results.filter(item => item.media_type === 'movie') as Movie[];
        const tvShows = response.results.filter(item => item.media_type === 'tv') as TVShow[];
        const people = response.results.filter(item => item.media_type === 'person') as Person[];

        if (resetPage || currentPage === 1) {
          setResults({ movies, tvShows, people });
        } else {
          setResults(prev => ({
            movies: [...prev.movies, ...movies],
            tvShows: [...prev.tvShows, ...tvShows],
            people: [...prev.people, ...people]
          }));
        }
        setTotalResults(response.total_results);
        setTotalPages(response.total_pages);
      } else if (searchType === 'movie') {
        const response = await tmdbApi.searchMoviesAdvanced(query, searchFilters);
        if (resetPage || currentPage === 1) {
          setResults({ movies: response.results, tvShows: [], people: [] });
        } else {
          setResults(prev => ({
            movies: [...prev.movies, ...response.results],
            tvShows: [],
            people: []
          }));
        }
        setTotalResults(response.total_results);
        setTotalPages(response.total_pages);
      } else if (searchType === 'tv') {
        const response = await tmdbApi.searchTVAdvanced(query, searchFilters);
        if (resetPage || currentPage === 1) {
          setResults({ movies: [], tvShows: response.results, people: [] });
        } else {
          setResults(prev => ({
            movies: [],
            tvShows: [...prev.tvShows, ...response.results],
            people: []
          }));
        }
        setTotalResults(response.total_results);
        setTotalPages(response.total_pages);
      } else if (searchType === 'person') {
        const response = await tmdbApi.searchPeople(query, currentPage);
        if (resetPage || currentPage === 1) {
          setResults({ movies: [], tvShows: [], people: response.results });
        } else {
          setResults(prev => ({
            movies: [],
            tvShows: [],
            people: [...prev.people, ...response.results]
          }));
        }
        setTotalResults(response.total_results);
        setTotalPages(response.total_pages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [page]);

  const loadMore = useCallback(() => {
    if (page < totalPages && !loading && currentQuery) {
      setPage(prev => prev + 1);
      // Trigger search with next page
      setTimeout(() => {
        search(currentQuery, currentFilters, currentSearchType, false);
      }, 0);
    }
  }, [page, totalPages, loading, currentQuery, currentFilters, currentSearchType, search]);

  const hasMore = page < totalPages;

  return {
    results,
    loading,
    error,
    search,
    totalResults,
    loadMore,
    hasMore,
    page,
    totalPages
  };
};
