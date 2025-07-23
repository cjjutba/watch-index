import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { Person } from '../../types/person';
import tmdbApi from '../../services/tmdbApi';

interface PersonCardProps {
  person: Person;
  size?: 'small' | 'medium' | 'large';
  showKnownFor?: boolean;
  className?: string;
}

export const PersonCard = ({ 
  person, 
  size = 'medium', 
  showKnownFor = true,
  className = '' 
}: PersonCardProps) => {
  const sizeClasses = {
    small: 'w-32',
    medium: 'w-48',
    large: 'w-64'
  };

  const imageSizeClasses = {
    small: 'h-40',
    medium: 'h-60',
    large: 'h-80'
  };

  const profileUrl = person.profile_path 
    ? tmdbApi.getImageURL(person.profile_path, 'w300')
    : null;

  return (
    <Link 
      to={`/person/${person.id}`}
      className={`${sizeClasses[size]} ${className} group block`}
    >
      <div className="bg-card rounded-lg cinema-shadow overflow-hidden hover:scale-105 cinema-transition">
        {/* Profile Image */}
        <div className={`${imageSizeClasses[size]} bg-muted flex items-center justify-center relative overflow-hidden`}>
          {profileUrl ? (
            <img
              src={profileUrl}
              alt={person.name}
              className="w-full h-full object-cover group-hover:scale-110 cinema-transition"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`${profileUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
            <User className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>

        {/* Person Info */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary cinema-transition">
            {person.name}
          </h3>
          
          {person.known_for_department && (
            <p className="text-sm text-muted-foreground mt-1">
              {person.known_for_department}
            </p>
          )}

          {/* Known For */}
          {showKnownFor && person.known_for && person.known_for.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Known for:</p>
              <p className="text-xs text-foreground line-clamp-2">
                {person.known_for
                  .slice(0, 3)
                  .map(item => item.title || item.name)
                  .join(', ')}
              </p>
            </div>
          )}

          {/* Popularity Score (for debugging/admin) */}
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-muted-foreground mt-2">
              Popularity: {person.popularity.toFixed(1)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
