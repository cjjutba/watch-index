import { useState } from 'react';
import { Play, Calendar, Clock, MapPin, Info } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { NowPlayingSection } from '../components/nowPlaying/NowPlayingSection';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';

const NowPlaying = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Play className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Now Playing</h1>
              <p className="text-muted-foreground text-lg mt-1">
                Movies in theaters and TV shows airing today
              </p>
            </div>
          </div>

          {/* Date Badge */}
          <div className="flex items-center gap-4 mb-6">
            <Badge variant="outline" className="text-sm px-3 py-1">
              <Calendar className="w-4 h-4 mr-2" />
              {currentDate}
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Clock className="w-4 h-4 mr-2" />
              Updated hourly
            </Badge>
          </div>

          {/* Info Alert */}
          <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Now Playing</strong> shows movies currently in theaters and TV shows with episodes airing today. 
              Content varies by region - use the region selector to see what's available in your area.
            </AlertDescription>
          </Alert>
        </div>

        {/* Now Playing Content */}
        <NowPlayingSection
          showTabs={true}
          showLoadMore={true}
          className="mb-16"
        />

        {/* Additional Info Section */}
        <section className="mt-16 p-6 bg-card rounded-lg border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            About Now Playing
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Movies in Theaters
              </h3>
              <p>
                Shows movies currently playing in theaters in your selected region. 
                This includes new releases and movies that have been in theaters for a few weeks. 
                Release dates and availability vary by country.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-foreground mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                TV Shows Airing Today
              </h3>
              <p>
                Displays TV shows that have episodes airing today. This includes both 
                new episodes of ongoing series and premieres of new shows. Times and 
                schedules are based on the show's original broadcast region.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <h3 className="font-medium text-foreground mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Regional Availability
            </h3>
            <p className="text-sm text-muted-foreground">
              Content availability varies significantly by region due to distribution rights, 
              release schedules, and local broadcasting agreements. Use the region selector 
              to see what's available in different countries. Data is provided by The Movie Database (TMDB).
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NowPlaying;
