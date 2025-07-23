import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Film, Tv, User, ArrowRight, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { SearchResult } from '../../hooks/useSearchWithDropdown';
import tmdbApi from '../../services/tmdbApi';

interface SearchDropdownProps {
  results: SearchResult;
  loading: boolean;
  error: string | null;
  isOpen: boolean;
  onClose: () => void;
  onItemClick: () => void;
  onViewAllResults: () => void;
  query: string;
  className?: string;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  results,
  loading,
  error,
  isOpen,
  onClose,
  onItemClick,
  onViewAllResults,
  query,
  className = ''
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasResults = results.movies.length > 0 || results.tvShows.length > 0 || results.people.length > 0;

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full left-0 right-0 mt-2 z-50 ${className}`}
    >
      <Card className="bg-card/95 backdrop-blur-sm border-border shadow-2xl max-h-96 overflow-y-auto animate-in slide-in-from-top-2 duration-200 scrollbar-premium">
        {loading && (
          <div className="p-4 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-muted-foreground">Searching...</span>
          </div>
        )}

        {error && (
          <div className="p-4 text-center">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && !hasResults && query.length >= 2 && (
          <div className="p-4 text-center">
            <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No results found for "{query}"</p>
            <p className="text-muted-foreground text-xs mt-1">Try a different search term</p>
          </div>
        )}

        {!loading && !error && hasResults && (
          <div className="p-2">
            {/* Movies Section */}
            {results.movies.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center px-2 py-1 mb-2">
                  <Film className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-foreground">Movies</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {results.movies.length}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {results.movies.map((movie) => (
                    <Link
                      key={movie.id}
                      to={`/movie/${movie.id}`}
                      onClick={onItemClick}
                      className="flex items-center p-2 rounded-md hover:bg-accent/50 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-10 h-15 bg-muted rounded overflow-hidden mr-3">
                        {movie.poster_path ? (
                          <img
                            src={tmdbApi.getImageURL(movie.poster_path, 'w92')}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {movie.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
                          {movie.vote_average > 0 && (
                            <span className="ml-2">★ {movie.vote_average.toFixed(1)}</span>
                          )}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* TV Shows Section */}
            {results.tvShows.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center px-2 py-1 mb-2">
                  <Tv className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-foreground">TV Shows</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {results.tvShows.length}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {results.tvShows.map((show) => (
                    <Link
                      key={show.id}
                      to={`/tv/${show.id}`}
                      onClick={onItemClick}
                      className="flex items-center p-2 rounded-md hover:bg-accent/50 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-10 h-15 bg-muted rounded overflow-hidden mr-3">
                        {show.poster_path ? (
                          <img
                            src={tmdbApi.getImageURL(show.poster_path, 'w92')}
                            alt={show.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Tv className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {show.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'TBA'}
                          {show.vote_average > 0 && (
                            <span className="ml-2">★ {show.vote_average.toFixed(1)}</span>
                          )}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* People Section */}
            {results.people.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center px-2 py-1 mb-2">
                  <User className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-sm font-medium text-foreground">People</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {results.people.length}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {results.people.map((person) => (
                    <Link
                      key={person.id}
                      to={`/person/${person.id}`}
                      onClick={onItemClick}
                      className="flex items-center p-2 rounded-md hover:bg-accent/50 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-full overflow-hidden mr-3">
                        {person.profile_path ? (
                          <img
                            src={tmdbApi.getImageURL(person.profile_path, 'w92')}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {person.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {person.known_for_department || 'Actor'}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* View All Results Button */}
            {hasResults && (
              <div className="border-t border-border pt-2 mt-2">
                <Button
                  variant="ghost"
                  onClick={onViewAllResults}
                  className="w-full justify-between text-sm hover:bg-primary/10"
                >
                  <span>
                    {results.totalResults > 15
                      ? `View all ${results.totalResults} results`
                      : `Search "${query}" in discover`
                    }
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
