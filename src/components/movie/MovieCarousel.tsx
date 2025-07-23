import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../../types/movie';
import { MovieCard } from './MovieCard';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface MovieCarouselProps {
  movies: Movie[];
  title: string;
  loading?: boolean;
  className?: string;
  cardSize?: 'small' | 'medium' | 'large';
}

export const MovieCarousel = ({
  movies,
  title,
  loading = false,
  className = '',
  cardSize = 'medium'
}: MovieCarouselProps) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [movies]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className={`py-8 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex space-x-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-48 h-[340px] flex flex-col">
                <div className="flex-1 bg-muted animate-pulse rounded-lg mb-4" style={{ aspectRatio: '2/3' }} />
                <div className="space-y-2 flex-shrink-0 px-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <section className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h2>
          
          {/* Navigation Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Gradient */}
          <div className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          } transition-opacity`} />
          
          {/* Right Gradient */}
          <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          } transition-opacity`} />

          {/* Movies Container */}
          <div
            ref={scrollContainerRef}
            className={cn(
              "flex space-x-4 overflow-x-auto scrollbar-hide pb-4 select-none cursor-grab active:cursor-grabbing",
              isDragging && "cursor-grabbing"
            )}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseDown={(e) => {
              setIsDragging(true);
              setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
              setScrollLeft(scrollContainerRef.current!.scrollLeft);
            }}
            onMouseMove={(e) => {
              if (!isDragging) return;
              e.preventDefault();
              const x = e.pageX - scrollContainerRef.current!.offsetLeft;
              const walk = (x - startX) * 2;
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollLeft = scrollLeft - walk;
              }
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={(e) => {
              setIsDragging(true);
              setStartX(e.touches[0].pageX - scrollContainerRef.current!.offsetLeft);
              setScrollLeft(scrollContainerRef.current!.scrollLeft);
            }}
            onTouchMove={(e) => {
              if (!isDragging) return;
              const x = e.touches[0].pageX - scrollContainerRef.current!.offsetLeft;
              const walk = (x - startX) * 2;
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollLeft = scrollLeft - walk;
              }
            }}
            onTouchEnd={() => setIsDragging(false)}
          >
            {movies.map((movie) => (
              <div key={movie.id} className="flex-shrink-0">
                <MovieCard
                  movie={movie}
                  size={cardSize}
                  showRating={true}
                />
              </div>
            ))}
          </div>

          {/* Mobile Navigation Buttons */}
          <div className="md:hidden flex justify-center space-x-4 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};