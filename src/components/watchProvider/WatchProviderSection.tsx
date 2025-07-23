import { useState } from 'react';
import { Globe, ExternalLink, Tv, DollarSign, ShoppingCart, Zap } from 'lucide-react';
import { WatchProviderCard } from './WatchProviderCard';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { GroupedWatchProviders, COMMON_REGIONS } from '../../types/watchProvider';
import { useUserRegion } from '../../hooks/useWatchProviders';

interface WatchProviderSectionProps {
  groupedProviders: GroupedWatchProviders | null;
  availableRegions: string[];
  currentRegion: string;
  onRegionChange: (region: string) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export const WatchProviderSection = ({
  groupedProviders,
  availableRegions,
  currentRegion,
  onRegionChange,
  loading = false,
  error = null,
  className = ''
}: WatchProviderSectionProps) => {
  const [showAllRegions, setShowAllRegions] = useState(false);
  const { updateUserRegion } = useUserRegion();

  const handleRegionChange = (region: string) => {
    onRegionChange(region);
    updateUserRegion(region);
  };

  const getRegionName = (code: string) => {
    const commonRegion = COMMON_REGIONS.find(r => r.code === code);
    return commonRegion ? commonRegion.name : code;
  };

  const sortedRegions = availableRegions.sort((a, b) => {
    // Prioritize common regions
    const aIsCommon = COMMON_REGIONS.some(r => r.code === a);
    const bIsCommon = COMMON_REGIONS.some(r => r.code === b);
    
    if (aIsCommon && !bIsCommon) return -1;
    if (!aIsCommon && bIsCommon) return 1;
    
    return getRegionName(a).localeCompare(getRegionName(b));
  });

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground flex items-center">
            <Tv className="w-5 h-5 mr-2" />
            Where to Watch
          </h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <Tv className="w-5 h-5 mr-2" />
          Where to Watch
        </h2>
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            Unable to load watch providers
          </div>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!groupedProviders || availableRegions.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <Tv className="w-5 h-5 mr-2" />
          Where to Watch
        </h2>
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            No watch providers available
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            This content may not be available for streaming in your region
          </p>
        </div>
      </div>
    );
  }

  const hasAnyProviders = 
    groupedProviders.streaming.length > 0 ||
    groupedProviders.rent.length > 0 ||
    groupedProviders.buy.length > 0 ||
    groupedProviders.ads.length > 0;

  if (!hasAnyProviders) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground flex items-center">
            <Tv className="w-5 h-5 mr-2" />
            Where to Watch
          </h2>
          {availableRegions.length > 1 && (
            <Select value={currentRegion} onValueChange={handleRegionChange}>
              <SelectTrigger className="w-48">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortedRegions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {getRegionName(region)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            Not available in {getRegionName(currentRegion)}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Try selecting a different region above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground flex items-center">
          <Tv className="w-5 h-5 mr-2" />
          Where to Watch
        </h2>
        {availableRegions.length > 1 && (
          <Select value={currentRegion} onValueChange={handleRegionChange}>
            <SelectTrigger className="w-48">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortedRegions.map((region) => (
                <SelectItem key={region} value={region}>
                  {getRegionName(region)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Current Region Info */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <Globe className="w-3 h-3" />
          {getRegionName(currentRegion)}
        </Badge>
        {groupedProviders.link && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(groupedProviders.link, '_blank')}
            className="text-xs"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            JustWatch
          </Button>
        )}
      </div>

      {/* Streaming Services */}
      {groupedProviders.streaming.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-foreground flex items-center">
            <Zap className="w-4 h-4 mr-2 text-green-500" />
            Stream
            <Badge variant="secondary" className="ml-2 bg-green-500 text-white">
              {groupedProviders.streaming.length}
            </Badge>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {groupedProviders.streaming.map((provider) => (
              <WatchProviderCard
                key={provider.provider_id}
                provider={provider}
                type="streaming"
                link={groupedProviders.link}
                showType={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Free with Ads */}
      {groupedProviders.ads.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-foreground flex items-center">
            <Tv className="w-4 h-4 mr-2 text-gray-500" />
            Free with Ads
            <Badge variant="secondary" className="ml-2 bg-gray-500 text-white">
              {groupedProviders.ads.length}
            </Badge>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {groupedProviders.ads.map((provider) => (
              <WatchProviderCard
                key={provider.provider_id}
                provider={provider}
                type="ads"
                link={groupedProviders.link}
                showType={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Rental and Purchase */}
      {(groupedProviders.rent.length > 0 || groupedProviders.buy.length > 0) && (
        <div className="space-y-4">
          <Separator />
          
          {/* Rent */}
          {groupedProviders.rent.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-foreground flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
                Rent
                <Badge variant="secondary" className="ml-2 bg-blue-500 text-white">
                  {groupedProviders.rent.length}
                </Badge>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {groupedProviders.rent.map((provider) => (
                  <WatchProviderCard
                    key={provider.provider_id}
                    provider={provider}
                    type="rent"
                    link={groupedProviders.link}
                    showType={false}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Buy */}
          {groupedProviders.buy.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-foreground flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2 text-purple-500" />
                Buy
                <Badge variant="secondary" className="ml-2 bg-purple-500 text-white">
                  {groupedProviders.buy.length}
                </Badge>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {groupedProviders.buy.map((provider) => (
                  <WatchProviderCard
                    key={provider.provider_id}
                    provider={provider}
                    type="buy"
                    link={groupedProviders.link}
                    showType={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
        Watch provider data provided by JustWatch. Availability may vary by region and change over time.
      </div>
    </div>
  );
};
