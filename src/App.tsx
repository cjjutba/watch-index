import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import TVShows from "./pages/TVShows";
import TVShowDetail from "./pages/TVShowDetail";
import PersonDetail from "./pages/PersonDetail";
import Discover from "./pages/Discover";
import NowPlaying from "./pages/NowPlaying";
import Genres from "./pages/Genres";
import GenreDetail from "./pages/GenreDetail";
import SeasonDetail from "./pages/SeasonDetail";
import EpisodeDetail from "./pages/EpisodeDetail";
import Favorites from "./pages/Favorites";
import SearchResults from "./pages/SearchResults";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FavoritesProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/tv-shows" element={<TVShows />} />
            <Route path="/tv/:id" element={<TVShowDetail />} />
            <Route path="/tv/:seriesId/season/:seasonNumber" element={<SeasonDetail />} />
            <Route path="/tv/:seriesId/season/:seasonNumber/episode/:episodeNumber" element={<EpisodeDetail />} />
            <Route path="/person/:id" element={<PersonDetail />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/now-playing" element={<NowPlaying />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/genre/:id" element={<GenreDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </FavoritesProvider>
  </QueryClientProvider>
);

export default App;
