import { useState, useEffect, useCallback, useRef } from 'react';
import { Movie } from '../types/movie';
import { TVShow } from '../types/tvshow';
import { Person } from '../types/person';
import tmdbApi from '../services/tmdbApi';

export interface SearchResult {
  movies: Movie[];
  tvShows: TVShow[];
  people: Person[];
  totalResults: number;
}

export interface UseSearchWithDropdownReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult;
  loading: boolean;
  error: string | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  clearSearch: () => void;
  handleSearch: (searchQuery?: string) => void;
}

const DEBOUNCE_DELAY = 300; // 300ms debounce
const MIN_QUERY_LENGTH = 2; // Minimum characters to trigger search

export const useSearchWithDropdown = (): UseSearchWithDropdownReturn => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({
    movies: [],
    tvShows: [],
    people: [],
    totalResults: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < MIN_QUERY_LENGTH) {
      setResults({ movies: [], tvShows: [], people: [], totalResults: 0 });
      setLoading(false);
      setIsOpen(false);
      return;
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      // Perform multi-search to get all types of results
      const response = await tmdbApi.searchMulti(searchQuery, 1);
      console.log('Search response:', response);

      // Filter results by media type
      const movies = response.results.filter(
        (item: any) => item.media_type === 'movie'
      ) as Movie[];

      const tvShows = response.results.filter(
        (item: any) => item.media_type === 'tv'
      ) as TVShow[];

      const people = response.results.filter(
        (item: any) => item.media_type === 'person'
      ) as Person[];

      console.log('Filtered results:', { movies: movies.length, tvShows: tvShows.length, people: people.length });

      const searchResults: SearchResult = {
        movies: movies.slice(0, 5), // Limit to 5 results per category for dropdown
        tvShows: tvShows.slice(0, 5),
        people: people.slice(0, 5),
        totalResults: response.total_results
      };

      setResults(searchResults);
      setIsOpen(true);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Search failed');
        console.error('Search error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (query.trim()) {
      debounceTimeoutRef.current = setTimeout(() => {
        performSearch(query.trim());
      }, DEBOUNCE_DELAY);
    } else {
      setResults({ movies: [], tvShows: [], people: [], totalResults: 0 });
      setIsOpen(false);
      setLoading(false);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query, performSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults({ movies: [], tvShows: [], people: [], totalResults: 0 });
    setIsOpen(false);
    setError(null);
    setLoading(false);
  }, []);

  const handleSearch = useCallback((searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      // Use React Router navigation instead of window.location for better UX
      const searchUrl = `/discover?q=${encodeURIComponent(finalQuery.trim())}`;
      // Check if we're in a React Router context
      if (typeof window !== 'undefined') {
        window.location.href = searchUrl;
      }
    }
  }, [query]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    isOpen,
    setIsOpen,
    clearSearch,
    handleSearch
  };
};

// Hook for quick search suggestions (lighter version)
export const useQuickSearch = (query: string, enabled: boolean = true) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || query.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return;
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await tmdbApi.searchMulti(query, 1);
        
        // Extract unique titles/names for suggestions
        const titles = response.results
          .slice(0, 8) // Limit suggestions
          .map((item: any) => {
            if (item.media_type === 'movie') return item.title;
            if (item.media_type === 'tv') return item.name;
            if (item.media_type === 'person') return item.name;
            return null;
          })
          .filter((title: string | null) => title !== null)
          .filter((title: string, index: number, arr: string[]) => 
            arr.indexOf(title) === index // Remove duplicates
          );

        setSuggestions(titles);
      } catch (error) {
        console.error('Quick search error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query, enabled]);

  return { suggestions, loading };
};
