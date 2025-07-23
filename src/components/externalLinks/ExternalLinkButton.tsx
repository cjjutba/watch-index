import { ExternalLink as ExternalLinkIcon, Star, Users, Facebook, Instagram, Twitter, Database, Tv, Book } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { ExternalLink } from '../../types/externalLinks';

interface ExternalLinkButtonProps {
  link: ExternalLink;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost' | 'icon';
  showLabel?: boolean;
  onClick?: (platform: string) => void;
  className?: string;
}

// Icon mapping for different platforms
const getIcon = (iconName: string, size: number = 16) => {
  const iconProps = { size, className: 'flex-shrink-0' };
  
  switch (iconName) {
    case 'imdb':
      return <Star {...iconProps} className={`${iconProps.className} fill-current`} />;
    case 'facebook':
      return <Facebook {...iconProps} />;
    case 'instagram':
      return <Instagram {...iconProps} />;
    case 'twitter':
      return <Twitter {...iconProps} />;
    case 'tv':
      return <Tv {...iconProps} />;
    case 'database':
      return <Database {...iconProps} />;
    case 'wiki':
      return <Book {...iconProps} />;
    case 'users':
      return <Users {...iconProps} />;
    default:
      return <ExternalLinkIcon {...iconProps} />;
  }
};

export const ExternalLinkButton = ({
  link,
  size = 'md',
  variant = 'outline',
  showLabel = true,
  onClick,
  className = ''
}: ExternalLinkButtonProps) => {
  const handleClick = () => {
    onClick?.(link.id);
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const sizeConfig = {
    sm: { button: 'h-8 px-2', icon: 14, text: 'text-xs' },
    md: { button: 'h-9 px-3', icon: 16, text: 'text-sm' },
    lg: { button: 'h-10 px-4', icon: 18, text: 'text-base' }
  };

  const config = sizeConfig[size];
  const icon = getIcon(link.icon, config.icon);

  if (variant === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClick}
              className={`${config.button} w-9 p-0 ${className}`}
              style={{ borderColor: `${link.color}20` }}
            >
              <div style={{ color: link.color }}>
                {icon}
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{link.name}</p>
            <p className="text-xs text-muted-foreground">{link.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      className={`${config.button} ${config.text} ${className}`}
      style={{ 
        borderColor: variant === 'outline' ? `${link.color}20` : undefined,
        backgroundColor: variant === 'default' ? `${link.color}10` : undefined
      }}
    >
      <div style={{ color: link.color }} className="mr-2">
        {icon}
      </div>
      {showLabel && (
        <span className="truncate">
          {link.name}
        </span>
      )}
      <ExternalLinkIcon size={12} className="ml-1 opacity-60" />
    </Button>
  );
};
