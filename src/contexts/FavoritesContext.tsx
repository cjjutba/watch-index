import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface FavoriteItem {
  id: number;
  title: string;
  name?: string; // For TV shows
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string; // For TV shows
  vote_average: number;
  overview: string;
  media_type: 'movie' | 'tv';
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: number, mediaType: 'movie' | 'tv') => void;
  isFavorite: (id: number, mediaType: 'movie' | 'tv') => boolean;
  favoritesCount: number;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'watchindex_favorites';

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  const addToFavorites = (item: FavoriteItem) => {
    setFavorites(prev => {
      // Check if item already exists (by id and media_type)
      const exists = prev.some(fav => fav.id === item.id && fav.media_type === item.media_type);
      if (exists) {
        return prev; // Don't add duplicates
      }
      return [...prev, item];
    });
  };

  const removeFromFavorites = (id: number, mediaType: 'movie' | 'tv') => {
    setFavorites(prev => prev.filter(fav => !(fav.id === id && fav.media_type === mediaType)));
  };

  const isFavorite = (id: number, mediaType: 'movie' | 'tv') => {
    return favorites.some(fav => fav.id === id && fav.media_type === mediaType);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    favoritesCount: favorites.length,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
