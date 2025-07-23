import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Movie } from '../../types/movie';
import { useMovies } from '../../hooks/useMovies';
import tmdbApi from '../../services/tmdbApi';

export const HeroSection = () => {
  const { movies: trendingMovies, loading } = useMovies('trending');
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (trendingMovies.length > 0) {
      setCurrentMovie(trendingMovies[0]);
    }
  }, [trendingMovies]);

  useEffect(() => {
    if (trendingMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % Math.min(trendingMovies.length, 5);
          setCurrentMovie(trendingMovies[nextIndex]);
          return nextIndex;
        });
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [trendingMovies]);

  if (loading || !currentMovie) {
    return (
      <div className="relative h-[calc(100vh-4rem)] bg-muted animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-8 bg-muted-foreground/20 rounded mb-4" />
            <div className="w-48 h-4 bg-muted-foreground/20 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const backdropUrl = tmdbApi.getImageURL(currentMovie.backdrop_path, 'original');
  const releaseYear = currentMovie.release_date ? new Date(currentMovie.release_date).getFullYear() : 'TBA';
  const rating = currentMovie.vote_average ? currentMovie.vote_average.toFixed(1) : 'N/A';

  return (
    <section className="relative h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            {/* Movie Title */}
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {currentMovie.title}
            </h1>

            {/* Movie Meta */}
            <div className="flex items-center space-x-6 mb-6 text-white/90">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-primary fill-current" />
                <span className="font-medium">{rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-5 h-5" />
                <span>{releaseYear}</span>
              </div>
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                Trending
              </div>
            </div>

            {/* Overview */}
            <p className="text-lg text-white/90 mb-8 leading-relaxed line-clamp-3">
              {currentMovie.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="gold-gradient text-black font-semibold hover:scale-105 cinema-transition"
              >
                <Link to={`/movie/${currentMovie.id}`}>
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Watch Now
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm cinema-transition"
              >
                <Link to={`/movie/${currentMovie.id}`}>
                  <Info className="w-5 h-5 mr-2" />
                  More Info
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {trendingMovies.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setCurrentMovie(trendingMovies[index]);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/70">
        <div className="flex flex-col items-center">
          <ChevronDown className="w-6 h-6 text-white/60 hover:text-white/80 transition-colors duration-300 cursor-pointer animate-bounce"
                       style={{ animationDuration: '2s' }} />
        </div>
      </div>
    </section>
  );
};