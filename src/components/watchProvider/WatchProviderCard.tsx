import { ExternalLink } from 'lucide-react';
import { WatchProvider } from '../../types/watchProvider';
import { Badge } from '../ui/badge';
import tmdbApi from '../../services/tmdbApi';

interface WatchProviderCardProps {
  provider: WatchProvider;
  type: 'streaming' | 'rent' | 'buy' | 'ads';
  link?: string;
  size?: 'small' | 'medium' | 'large';
  showType?: boolean;
  className?: string;
}

export const WatchProviderCard = ({ 
  provider, 
  type, 
  link,
  size = 'medium',
  showType = true,
  className = '' 
}: WatchProviderCardProps) => {
  const logoUrl = provider.logo_path 
    ? tmdbApi.getImageURL(provider.logo_path, 'w92')
    : null;

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const typeLabels = {
    streaming: 'Stream',
    rent: 'Rent',
    buy: 'Buy',
    ads: 'Free'
  };

  const typeColors = {
    streaming: 'bg-green-500',
    rent: 'bg-blue-500',
    buy: 'bg-purple-500',
    ads: 'bg-gray-500'
  };

  const handleClick = () => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`group ${className}`}>
      <div 
        className={`
          relative bg-card rounded-lg border border-border p-3 
          hover:shadow-lg cinema-transition cursor-pointer
          ${link ? 'hover:border-primary' : ''}
        `}
        onClick={handleClick}
      >
        {/* Provider Logo */}
        <div className={`${sizeClasses[size]} mx-auto mb-2 relative overflow-hidden rounded-lg bg-white`}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={provider.provider_name}
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`${logoUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full bg-muted text-muted-foreground font-bold ${textSizeClasses[size]}`}>
            {provider.provider_name.charAt(0)}
          </div>
        </div>

        {/* Provider Name */}
        <div className="text-center">
          <h4 className={`font-medium text-foreground line-clamp-2 ${textSizeClasses[size]} mb-1`}>
            {provider.provider_name}
          </h4>
          
          {/* Type Badge */}
          {showType && (
            <Badge 
              variant="secondary" 
              className={`${typeColors[type]} text-white text-xs px-2 py-0.5`}
            >
              {typeLabels[type]}
            </Badge>
          )}
        </div>

        {/* External Link Icon */}
        {link && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 cinema-transition">
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
};
