import { Link } from 'react-router-dom';
import { HeroSection } from '../components/hero/HeroSection';
import { MovieCarousel } from '../components/movie/MovieCarousel';
import { MovieGrid } from '../components/movie/MovieGrid';
import { NowPlayingSection } from '../components/nowPlaying/NowPlayingSection';
import { GenreSection } from '../components/genre/GenreSection';
import { useMovies } from '../hooks/useMovies';
import { useTVShows } from '../hooks/useTVShows';

import { Footer } from '../components/layout/Footer';

const Home = () => {
  const { movies: popularMovies, loading: popularLoading } = useMovies('popular');
  const { movies: topRatedMovies, loading: topRatedLoading } = useMovies('top_rated');
  const { movies: upcomingMovies, loading: upcomingLoading } = useMovies('upcoming');

  // TV Shows data
  const { tvShows: popularTVShows, loading: tvLoading } = useTVShows('popular');

  // Convert TV shows to movie-like format for compatibility with MovieCarousel
  const convertedTVShows = popularTVShows.map(show => ({
    ...show,
    title: show.name || show.original_name,
    release_date: show.first_air_date,
    original_title: show.original_name,
    media_type: 'tv',
    video: false // Required Movie property
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Now Playing Movies Carousel */}
      <MovieCarousel
        movies={topRatedMovies.slice(0, 12)}
        title="Now Playing in Theaters"
        loading={topRatedLoading}
        cardSize="medium"
      />

      {/* Popular Movies Carousel */}
      <MovieCarousel
        movies={popularMovies.slice(0, 12)}
        title="Popular Movies"
        loading={popularLoading}
        cardSize="medium"
      />

      {/* Top Rated Movies Carousel */}
      <MovieCarousel
        movies={topRatedMovies.slice(0, 12)}
        title="Top Rated Movies"
        loading={topRatedLoading}
        cardSize="medium"
        className="bg-muted/20"
      />

      {/* Upcoming Movies Carousel */}
      <MovieCarousel
        movies={upcomingMovies.slice(0, 12)}
        title="Coming Soon"
        loading={upcomingLoading}
        cardSize="medium"
      />

      {/* Popular TV Shows Carousel */}
      <MovieCarousel
        movies={convertedTVShows.slice(0, 12)}
        title="Popular TV Shows"
        loading={tvLoading}
        cardSize="medium"
        className="bg-muted/20"
      />

      {/* Genre Section */}
      <div className="container mx-auto px-4 py-16">
        <GenreSection
          maxGenres={8}
          showContent={false}
        />
      </div>

      {/* Featured Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Discover Your Next Favorite Movie
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore thousands of movies, from the latest blockbusters to hidden gems. 
            Find detailed information, cast details, trailers, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/movies"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-black bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse All Movies
            </Link>
            <Link
              to="/tv-shows"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-foreground bg-transparent border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Explore TV Shows
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;