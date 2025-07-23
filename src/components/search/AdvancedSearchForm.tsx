import { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, Star, Clock, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Badge } from '../ui/badge';
import { DiscoverFilters, MOVIE_SORT_OPTIONS, TV_SORT_OPTIONS, LANGUAGE_OPTIONS, REGION_OPTIONS } from '../../types/genre';
import { Genre } from '../../types/genre';

interface AdvancedSearchFormProps {
  onSearch: (query: string, filters: DiscoverFilters, searchType: 'multi' | 'movie' | 'tv' | 'person') => void;
  movieGenres: Genre[];
  tvGenres: Genre[];
  loading?: boolean;
  className?: string;
  initialQuery?: string;
}

export const AdvancedSearchForm = ({
  onSearch,
  movieGenres,
  tvGenres,
  loading = false,
  className = '',
  initialQuery = ''
}: AdvancedSearchFormProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<'multi' | 'movie' | 'tv' | 'person'>('multi');

  // Update query when initialQuery changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  // Filter states
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [excludedGenres, setExcludedGenres] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [yearRange, setYearRange] = useState<[number, number]>([1900, new Date().getFullYear() + 2]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 10]);
  const [minVotes, setMinVotes] = useState(0);
  const [runtimeRange, setRuntimeRange] = useState<[number, number]>([0, 300]);
  const [language, setLanguage] = useState('none');
  const [region, setRegion] = useState('none');
  const [includeAdult, setIncludeAdult] = useState(false);

  const currentGenres = searchType === 'tv' ? tvGenres : movieGenres;
  const currentSortOptions = searchType === 'tv' ? TV_SORT_OPTIONS : MOVIE_SORT_OPTIONS;

  const handleGenreToggle = (genreId: number, isExcluded = false) => {
    if (isExcluded) {
      setExcludedGenres(prev => 
        prev.includes(genreId) 
          ? prev.filter(id => id !== genreId)
          : [...prev, genreId]
      );
    } else {
      setSelectedGenres(prev => 
        prev.includes(genreId) 
          ? prev.filter(id => id !== genreId)
          : [...prev, genreId]
      );
    }
  };

  const buildFilters = (): DiscoverFilters => {
    const filters: DiscoverFilters = {
      sort_by: sortBy,
      include_adult: includeAdult,
    };

    if (selectedGenres.length > 0) {
      filters.with_genres = selectedGenres.join(',');
    }

    if (excludedGenres.length > 0) {
      filters.without_genres = excludedGenres.join(',');
    }

    if (yearRange[0] > 1900 || yearRange[1] < new Date().getFullYear() + 2) {
      if (searchType === 'movie') {
        filters['primary_release_date.gte'] = `${yearRange[0]}-01-01`;
        filters['primary_release_date.lte'] = `${yearRange[1]}-12-31`;
      } else if (searchType === 'tv') {
        filters['first_air_date.gte'] = `${yearRange[0]}-01-01`;
        filters['first_air_date.lte'] = `${yearRange[1]}-12-31`;
      }
    }

    if (ratingRange[0] > 0 || ratingRange[1] < 10) {
      filters['vote_average.gte'] = ratingRange[0];
      filters['vote_average.lte'] = ratingRange[1];
    }

    if (minVotes > 0) {
      filters['vote_count.gte'] = minVotes;
    }

    if (searchType === 'movie' && (runtimeRange[0] > 0 || runtimeRange[1] < 300)) {
      filters['with_runtime.gte'] = runtimeRange[0];
      filters['with_runtime.lte'] = runtimeRange[1];
    }

    if (language && language !== 'none') {
      filters.with_original_language = language;
    }

    if (region && region !== 'none') {
      filters.region = region;
    }

    return filters;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filters = buildFilters();
    onSearch(query, filters, searchType);
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setExcludedGenres([]);
    setSortBy('popularity.desc');
    setYearRange([1900, new Date().getFullYear() + 2]);
    setRatingRange([0, 10]);
    setMinVotes(0);
    setRuntimeRange([0, 300]);
    setLanguage('none');
    setRegion('none');
    setIncludeAdult(false);
  };

  const activeFiltersCount = [
    selectedGenres.length > 0,
    excludedGenres.length > 0,
    sortBy !== 'popularity.desc',
    yearRange[0] > 1900 || yearRange[1] < new Date().getFullYear() + 2,
    ratingRange[0] > 0 || ratingRange[1] < 10,
    minVotes > 0,
    searchType === 'movie' && (runtimeRange[0] > 0 || runtimeRange[1] < 300),
    language !== 'none',
    region !== 'none',
    includeAdult
  ].filter(Boolean).length;

  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`}>
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Basic Search */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search movies, TV shows, people..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="text-lg h-12"
              />
            </div>
            <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multi">All</SelectItem>
                <SelectItem value="movie">Movies</SelectItem>
                <SelectItem value="tv">TV Shows</SelectItem>
                <SelectItem value="person">People</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" disabled={loading} className="gold-gradient h-12">
              <Search className="w-5 h-5 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
            
            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" type="button" className="h-12">
                  <Filter className="w-5 h-5 mr-2" />
                  Advanced Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>

        {/* Advanced Filters */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleContent className="space-y-6">
            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Advanced Filters</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sort By */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentSortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center">
                    <Globe className="w-4 h-4 mr-1" />
                    Language
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Any language</SelectItem>
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Region */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Region</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Any region</SelectItem>
                      {REGION_OPTIONS.map((reg) => (
                        <SelectItem key={reg.value} value={reg.value}>
                          {reg.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Year Range: {yearRange[0]} - {yearRange[1]}
                  </Label>
                  <Slider
                    value={yearRange}
                    onValueChange={(value) => setYearRange(value as [number, number])}
                    min={1900}
                    max={new Date().getFullYear() + 2}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Rating Range */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Rating: {ratingRange[0]} - {ratingRange[1]}
                  </Label>
                  <Slider
                    value={ratingRange}
                    onValueChange={(value) => setRatingRange(value as [number, number])}
                    min={0}
                    max={10}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Runtime Range (Movies only) */}
                {searchType === 'movie' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Runtime: {runtimeRange[0]} - {runtimeRange[1]} min
                    </Label>
                    <Slider
                      value={runtimeRange}
                      onValueChange={(value) => setRuntimeRange(value as [number, number])}
                      min={0}
                      max={300}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {/* Minimum Votes */}
              <div className="mt-6 space-y-2">
                <Label className="text-sm font-medium">
                  Minimum Votes: {minVotes}
                </Label>
                <Slider
                  value={[minVotes]}
                  onValueChange={(value) => setMinVotes(value[0])}
                  min={0}
                  max={10000}
                  step={100}
                  className="w-full max-w-md"
                />
              </div>

              {/* Genres */}
              {(searchType === 'movie' || searchType === 'tv') && currentGenres.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Include Genres</Label>
                    <div className="flex flex-wrap gap-2">
                      {currentGenres.map((genre) => (
                        <Badge
                          key={genre.id}
                          variant={selectedGenres.includes(genre.id) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary/80 transition-colors"
                          onClick={() => handleGenreToggle(genre.id)}
                        >
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Exclude Genres</Label>
                    <div className="flex flex-wrap gap-2">
                      {currentGenres.map((genre) => (
                        <Badge
                          key={genre.id}
                          variant={excludedGenres.includes(genre.id) ? "destructive" : "outline"}
                          className="cursor-pointer hover:bg-destructive/80 transition-colors"
                          onClick={() => handleGenreToggle(genre.id, true)}
                        >
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Include Adult Content */}
              <div className="mt-6 flex items-center space-x-2">
                <Checkbox
                  id="include-adult"
                  checked={includeAdult}
                  onCheckedChange={(checked) => setIncludeAdult(checked as boolean)}
                />
                <Label htmlFor="include-adult" className="text-sm">
                  Include adult content
                </Label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </form>
    </div>
  );
};
