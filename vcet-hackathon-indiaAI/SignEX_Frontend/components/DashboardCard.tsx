'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  className?: string;
  img: string;
  title: string;
  description: string;
  handleClick?: () => void;
  gradient?: string;
  iconBg?: string;
}

const DashboardCard = ({ 
  className, 
  img, 
  title, 
  description, 
  handleClick,
  gradient = "from-blue-500 to-indigo-600",
  iconBg = "bg-blue-100"
}: DashboardCardProps) => {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl white-card-elevated card-hover cursor-pointer fade-in',
        className
      )}
      onClick={handleClick}
    >
      {/* Subtle hover overlay */}
      <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
      
      <div className="relative z-10 p-6">
        <div className={cn(
          'mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110',
          'bg-gradient-to-br shadow-md group-hover:shadow-lg',
          gradient.replace('from-blue-500 to-indigo-600', 'from-blue-600 to-indigo-600')
        )}>
          <Image 
            src={img} 
            alt={title} 
            width={24} 
            height={24}
            className="text-white transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
            {description}
          </p>
        </div>
        
        {/* Subtle bottom accent */}
        <div className={cn(
          'absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r transition-all duration-300 group-hover:w-full',
          gradient
        )}></div>
      </div>
    </div>
  );
};

export default DashboardCard;
