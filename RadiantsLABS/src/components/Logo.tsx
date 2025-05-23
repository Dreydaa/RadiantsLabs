import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

function Logo({ size = 'medium', className = '' }: LogoProps) {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl',
  };

  return (
    <Link to="/" className={`inline-flex items-center ${className}`}>
      <Sparkles className="text-cream-100 mr-2" />
      <span className={`font-serif italic ${sizeClasses[size]} text-cream-50`}>
        Radiants Labs
      </span>
    </Link>
  );
}

export default Logo;