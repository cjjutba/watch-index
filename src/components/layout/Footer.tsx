import { Link } from 'react-router-dom';
import { Film, Github, Twitter, Heart, Search, Tv, Play } from 'lucide-react';
import { Button } from '../ui/button';

export const Footer = () => {
  return (
    <footer className="bg-cinema-black border-t border-cinema-gray-light mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Film className="w-10 h-10 text-primary group-hover:text-primary/80 transition-colors" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                WatchIndex
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Your ultimate destination for discovering movies and TV shows.
              Explore, rate, and track your favorite entertainment.
            </p>
          </div>

          {/* Discover */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground mb-6 flex items-center space-x-2">
              <Search className="w-5 h-5 text-primary" />
              <span>Discover</span>
            </h3>
            <nav className="space-y-3">
              <Link
                to="/"
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 hover:translate-x-1 transform"
              >
                Home
              </Link>
              <Link
                to="/movies"
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 hover:translate-x-1 transform"
              >
                Movies
              </Link>
              <Link
                to="/tv-shows"
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 hover:translate-x-1 transform"
              >
                TV Shows
              </Link>
              <Link
                to="/discover"
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 hover:translate-x-1 transform"
              >
                Advanced Search
              </Link>
            </nav>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground mb-6 flex items-center space-x-2">
              <Heart className="w-5 h-5 text-primary" />
              <span>Features</span>
            </h3>
            <nav className="space-y-3">
              <Link
                to="/favorites"
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 hover:translate-x-1 transform"
              >
                My Favorites
              </Link>
              <Link
                to="/genres"
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 hover:translate-x-1 transform"
              >
                Browse Genres
              </Link>
              <Link
                to="/now-playing"
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 hover:translate-x-1 transform"
              >
                Now Playing
              </Link>
              <Link
                to="/trending"
                className="block text-muted-foreground hover:text-primary transition-colors duration-200 hover:translate-x-1 transform"
              >
                Trending
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-6">
            <h3 className="font-semibold text-foreground mb-6 flex items-center space-x-2">
              <Play className="w-5 h-5 text-primary" />
              <span>Connect</span>
            </h3>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-110"
              >
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-110"
              >
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-5 h-5" />
                </a>
              </Button>
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Follow us for updates</p>
              <p className="text-xs">Powered by TMDB</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-cinema-gray-light">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} WatchIndex. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};