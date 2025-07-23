import { useState, useEffect } from 'react';
import { Person, PersonDetails } from '../types/person';
import { TMDBResponse } from '../types/api';
import tmdbApi from '../services/tmdbApi';

export const usePopularPeople = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdbApi.getPopularPeople(page);
        
        if (page === 1) {
          setPeople(response.results);
        } else {
          setPeople(prev => [...prev, ...response.results]);
        }
        
        setTotalPages(response.total_pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, [page]);

  const loadMore = () => {
    if (page < totalPages && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const hasMore = page < totalPages;

  return {
    people,
    loading,
    error,
    loadMore,
    hasMore,
    page,
    totalPages
  };
};

export const usePersonDetails = (personId: number | null) => {
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!personId) {
      setLoading(false);
      return;
    }

    const fetchPersonDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdbApi.getPersonDetails(personId);
        setPerson(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [personId]);

  return {
    person,
    loading,
    error
  };
};

export const useSearchPeople = (query: string) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      setPeople([]);
      setTotalPages(0);
      return;
    }

    const searchPeople = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await tmdbApi.searchPeople(query, page);
        
        if (page === 1) {
          setPeople(response.results);
        } else {
          setPeople(prev => [...prev, ...response.results]);
        }
        
        setTotalPages(response.total_pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    searchPeople();
  }, [query, page]);

  const loadMore = () => {
    if (page < totalPages && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const hasMore = page < totalPages;

  return {
    people,
    loading,
    error,
    loadMore,
    hasMore,
    page,
    totalPages
  };
};
