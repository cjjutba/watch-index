import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Film, Menu, X, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useSearchWithDropdown } from '../../hooks/useSearchWithDropdown';
import { SearchDropdown } from '../search/SearchDropdown';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { favoritesCount } = useFavorites();

  // Search functionality with dropdown
  const {
    query,
    setQuery,
    results,
    loading,
    error,
    isOpen,
    setIsOpen,
    clearSearch,
    handleSearch
  } = useSearchWithDropdown();

  // Close mobile menu and search dropdown when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchDropdownOpen(false);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isSearchDropdownOpen && !target.closest('[data-search-dropdown]')) {
        setIsSearchDropdownOpen(false);
      }
    };

    if (isSearchDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearchDropdownOpen]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
    setIsOpen(false);
    setIsSearchDropdownOpen(false);
  };

  const onSearchItemClick = () => {
    setIsOpen(false);
    setIsMenuOpen(false);
    setIsSearchDropdownOpen(false);
  };

  const onViewAllResults = () => {
    handleSearch();
    setIsOpen(false);
    setIsSearchDropdownOpen(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setIsSearchDropdownOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`transition-all duration-300 sticky top-0 z-50 backdrop-blur-md ${
      isScrolled 
        ? "bg-background/90 border-b border-border shadow-sm" 
        : "bg-background/60"
    }`}>
      <div className="w-full max-[600px]:px-2 px-4">
        <div className="flex items-center h-16">
          {/* Left: Logo - Mobile layout */}
          <div className="flex-shrink-0 max-[600px]:flex-1 max-[1023px]:w-36 min-[1024px]:w-48">
            <Link to="/" className="flex items-center max-[1023px]:space-x-2 min-[1024px]:space-x-3 group">
              <Film className="w-7 h-7 text-primary transition-colors group-hover:text-primary/90" />
              <span className="max-[600px]:hidden max-[1023px]:text-lg min-[1024px]:text-xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent tracking-wide">
                WatchIndex
              </span>
            </Link>
          </div>

          {/* Center: Navigation - Flexible */}
          <div className="flex-1 flex items-center justify-center max-[600px]:hidden">
            {/* Desktop Navigation */}
            <nav className="hidden min-[601px]:flex items-center max-[1023px]:space-x-6 min-[1024px]:space-x-8">
              <Link
                to="/"
                className="text-foreground hover:text-primary cinema-transition font-medium nav-link whitespace-nowrap max-[1023px]:text-sm"
              >
                Home
              </Link>
              <Link
                to="/movies"
                className="text-foreground hover:text-primary cinema-transition font-medium nav-link whitespace-nowrap max-[1023px]:text-sm"
              >
                Movies
              </Link>
              <Link
                to="/tv-shows"
                className="text-foreground hover:text-primary cinema-transition font-medium nav-link whitespace-nowrap max-[1023px]:text-sm"
              >
                TV Shows
              </Link>
              <Link
                to="/discover"
                className="text-foreground hover:text-primary cinema-transition font-medium nav-link whitespace-nowrap max-[1023px]:text-sm"
              >
                Discover
              </Link>
              <Link
                to="/now-playing"
                className="text-foreground hover:text-primary cinema-transition font-medium nav-link whitespace-nowrap max-[1023px]:text-sm"
              >
                Now Playing
              </Link>
              <Link
                to="/genres"
                className="text-foreground hover:text-primary cinema-transition font-medium nav-link whitespace-nowrap max-[1023px]:text-sm"
              >
                Genres
              </Link>
            </nav>


          </div>

          {/* Right: Actions - Responsive */}
          <div className="flex-shrink-0 max-[1023px]:w-40 min-[1024px]:w-56 flex justify-end items-center space-x-2">
            {/* Desktop Actions */}
            <div className="hidden min-[601px]:flex items-center max-[1023px]:space-x-2 min-[1024px]:space-x-4">
              {/* Search Icon - For both Medium (601px-1023px) and Desktop (1024px+) */}
              <Button
                variant="ghost"
                size="sm"
                className="gold-gradient hover:scale-105 transition-transform max-[1023px]:px-2"
                onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
                data-search-dropdown
              >
                <Search className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="sm" className="relative max-[1023px]:px-2" asChild>
                <Link to="/favorites">
                  <Heart className="w-5 h-5" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
              </Button>
            </div>

            {/* Mobile Actions - Right side */}
            <div className="max-[600px]:flex hidden items-center">
              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMenu}
                className="h-10 w-10 p-0 mr-2"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Search Dropdown - For both Medium (601px-1023px) and Desktop (1024px+) */}
        {isSearchDropdownOpen && (
          <div className="hidden min-[601px]:block absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border shadow-lg z-40" data-search-dropdown>
            <div className="max-w-7xl mx-auto px-4 py-3" data-search-dropdown>
              <form onSubmit={onSearchSubmit} className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                  <Input
                    type="text"
                    placeholder="Search movies, TV shows, people..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    onKeyDown={handleInputKeyDown}
                    className="pl-10 bg-card/60 border-border focus:border-primary transition-colors w-full"
                    autoFocus
                  />
                  <SearchDropdown
                    results={results}
                    loading={loading}
                    error={error}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onItemClick={onSearchItemClick}
                    onViewAllResults={onViewAllResults}
                    query={query}
                  />
                </div>
                <Button type="submit" size="sm" className="gold-gradient hover:scale-105 transition-transform flex-shrink-0">
                  <Search className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchDropdownOpen(false)}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        )}

      {/* Mobile Menu Overlay - Only show on mobile */}
      <div className="max-[600px]:block hidden">
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-[9998]"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Slide-in Menu */}
            <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l border-border shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-background">
                <span className="text-lg font-semibold text-foreground">Menu</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-accent"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Menu Content */}
              <div className="p-4 space-y-6 overflow-y-auto flex-1 bg-background" style={{ height: 'calc(100vh - 73px)' }}>
                {/* Mobile Search */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Search</h3>
                  <form onSubmit={onSearchSubmit} className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                      <Input
                        type="text"
                        placeholder="Search movies, TV shows..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length >= 2 && setIsOpen(true)}
                        onKeyDown={handleInputKeyDown}
                        className="pl-10 bg-card/60 border-border focus:border-primary transition-colors w-full"
                      />
                      <SearchDropdown
                        results={results}
                        loading={loading}
                        error={error}
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        onItemClick={onSearchItemClick}
                        onViewAllResults={onViewAllResults}
                        query={query}
                      />
                    </div>
                    <Button type="submit" size="sm" className="gold-gradient hover:scale-105 transition-transform flex-shrink-0">
                      <Search className="w-4 h-4" />
                    </Button>
                  </form>
                </div>

                {/* Mobile Navigation */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Navigation</h3>
                  <nav className="space-y-1 bg-background">
                    <Link
                      to="/"
                      className="block text-foreground hover:text-primary hover:bg-accent cinema-transition font-medium py-3 px-3 rounded-md bg-card/30"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Link
                      to="/movies"
                      className="block text-foreground hover:text-primary hover:bg-accent cinema-transition font-medium py-3 px-3 rounded-md bg-card/30"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Movies
                    </Link>
                    <Link
                      to="/tv-shows"
                      className="block text-foreground hover:text-primary hover:bg-accent cinema-transition font-medium py-3 px-3 rounded-md bg-card/30"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      TV Shows
                    </Link>
                    <Link
                      to="/discover"
                      className="block text-foreground hover:text-primary hover:bg-accent cinema-transition font-medium py-3 px-3 rounded-md bg-card/30"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Discover
                    </Link>
                    <Link
                      to="/now-playing"
                      className="block text-foreground hover:text-primary hover:bg-accent cinema-transition font-medium py-3 px-3 rounded-md bg-card/30"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Now Playing
                    </Link>
                    <Link
                      to="/genres"
                      className="block text-foreground hover:text-primary hover:bg-accent cinema-transition font-medium py-3 px-3 rounded-md bg-card/30"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Genres
                    </Link>
                  </nav>
                </div>

                {/* Mobile Favorites */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Quick Access</h3>
                  <Link
                    to="/favorites"
                    className="flex items-center space-x-3 text-foreground hover:text-primary hover:bg-accent cinema-transition font-medium py-3 px-3 rounded-md bg-card/30"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="w-5 h-5" />
                    <span>Favorites</span>
                    {favoritesCount > 0 && (
                      <span className="bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                        {favoritesCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </header>
  );
};