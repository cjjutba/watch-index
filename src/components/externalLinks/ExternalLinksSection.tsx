import { useState } from 'react';
import { ExternalLink as ExternalLinkIcon, ChevronDown, ChevronUp, Database, Users, Book, Play } from 'lucide-react';
import { ExternalLinkButton } from './ExternalLinkButton';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { GroupedExternalLinks, CATEGORY_CONFIG } from '../../types/externalLinks';

interface ExternalLinksSectionProps {
  groupedLinks: GroupedExternalLinks | null;
  loading?: boolean;
  error?: string | null;
  onLinkClick?: (platform: string) => void;
  title?: string;
  compact?: boolean;
  showCategories?: boolean;
  className?: string;
}

export const ExternalLinksSection = ({
  groupedLinks,
  loading = false,
  error = null,
  onLinkClick,
  title = 'External Links',
  compact = false,
  showCategories = true,
  className = ''
}: ExternalLinksSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(!compact);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <ExternalLinkIcon className="w-5 h-5 mr-2" />
          {title}
        </h3>
        <div className="animate-pulse flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 w-20 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <ExternalLinkIcon className="w-5 h-5 mr-2" />
          {title}
        </h3>
        <div className="text-sm text-muted-foreground">
          Unable to load external links
        </div>
      </div>
    );
  }

  if (!groupedLinks) {
    return null;
  }

  // Count total links
  const totalLinks = Object.values(groupedLinks).reduce((sum, links) => sum + links.length, 0);

  if (totalLinks === 0) {
    return null;
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'social':
        return <Users className="w-4 h-4" />;
      case 'wiki':
        return <Book className="w-4 h-4" />;
      case 'streaming':
        return <Play className="w-4 h-4" />;
      default:
        return <ExternalLinkIcon className="w-4 h-4" />;
    }
  };

  // Render compact view (all links in one row)
  if (compact) {
    const allLinks = [
      ...groupedLinks.database,
      ...groupedLinks.social,
      ...groupedLinks.wiki,
      ...groupedLinks.streaming
    ];

    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className={className}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <ExternalLinkIcon className="w-5 h-5 mr-2" />
            {title}
            <Badge variant="secondary" className="ml-2">
              {totalLinks}
            </Badge>
          </h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {allLinks.map((link) => (
              <ExternalLinkButton
                key={link.id}
                link={link}
                size="sm"
                variant="outline"
                showLabel={true}
                onClick={onLinkClick}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  // Render full view with categories
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <ExternalLinkIcon className="w-5 h-5 mr-2" />
          {title}
        </h3>
        <Badge variant="outline">
          {totalLinks} link{totalLinks !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Database Links */}
        {groupedLinks.database.length > 0 && (
          <div className="space-y-3">
            {showCategories && (
              <div className="flex items-center gap-2">
                {getCategoryIcon('database')}
                <h4 className="font-medium text-foreground">
                  {CATEGORY_CONFIG.database.label}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {groupedLinks.database.length}
                </Badge>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {groupedLinks.database.map((link) => (
                <ExternalLinkButton
                  key={link.id}
                  link={link}
                  size="md"
                  variant="outline"
                  showLabel={true}
                  onClick={onLinkClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Social Media Links */}
        {groupedLinks.social.length > 0 && (
          <div className="space-y-3">
            {showCategories && groupedLinks.database.length > 0 && <Separator />}
            {showCategories && (
              <div className="flex items-center gap-2">
                {getCategoryIcon('social')}
                <h4 className="font-medium text-foreground">
                  {CATEGORY_CONFIG.social.label}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {groupedLinks.social.length}
                </Badge>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {groupedLinks.social.map((link) => (
                <ExternalLinkButton
                  key={link.id}
                  link={link}
                  size="md"
                  variant="outline"
                  showLabel={true}
                  onClick={onLinkClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Wiki Links */}
        {groupedLinks.wiki.length > 0 && (
          <div className="space-y-3">
            {showCategories && (groupedLinks.database.length > 0 || groupedLinks.social.length > 0) && <Separator />}
            {showCategories && (
              <div className="flex items-center gap-2">
                {getCategoryIcon('wiki')}
                <h4 className="font-medium text-foreground">
                  {CATEGORY_CONFIG.wiki.label}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {groupedLinks.wiki.length}
                </Badge>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {groupedLinks.wiki.map((link) => (
                <ExternalLinkButton
                  key={link.id}
                  link={link}
                  size="md"
                  variant="outline"
                  showLabel={true}
                  onClick={onLinkClick}
                />
              ))}
            </div>
          </div>
        )}

        {/* Streaming Links */}
        {groupedLinks.streaming.length > 0 && (
          <div className="space-y-3">
            {showCategories && (
              groupedLinks.database.length > 0 || 
              groupedLinks.social.length > 0 || 
              groupedLinks.wiki.length > 0
            ) && <Separator />}
            {showCategories && (
              <div className="flex items-center gap-2">
                {getCategoryIcon('streaming')}
                <h4 className="font-medium text-foreground">
                  {CATEGORY_CONFIG.streaming.label}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {groupedLinks.streaming.length}
                </Badge>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {groupedLinks.streaming.map((link) => (
                <ExternalLinkButton
                  key={link.id}
                  link={link}
                  size="md"
                  variant="outline"
                  showLabel={true}
                  onClick={onLinkClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-xs text-muted-foreground pt-2 border-t border-border">
        External links open in a new tab. WatchIndex is not affiliated with these platforms.
      </div>
    </div>
  );
};
