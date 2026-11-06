import React, { useState } from 'react';
import { Department, EmploymentStatus } from '../../types';

interface AvatarProps {
  src?: string;
  firstName: string;
  lastName: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  department?: Department;
  status?: EmploymentStatus;
  className?: string;
}

const DEPARTMENT_COLORS: Record<Department, string> = {
  Executive: 'bg-gradient-to-br from-violet-600 to-indigo-800 text-white shadow-sm shadow-violet-500/20',
  Engineering: 'bg-gradient-to-br from-blue-600 to-cyan-700 text-white shadow-sm shadow-blue-500/20',
  'Product & Design': 'bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-sm shadow-emerald-500/20',
  'People & Culture': 'bg-gradient-to-br from-amber-500 to-rose-700 text-white shadow-sm shadow-amber-500/20',
  'Finance & Legal': 'bg-gradient-to-br from-indigo-700 to-slate-900 text-white shadow-sm shadow-indigo-500/20',
  'Sales & Growth': 'bg-gradient-to-br from-rose-600 to-pink-800 text-white shadow-sm shadow-rose-500/20',
  Operations: 'bg-gradient-to-br from-teal-600 to-sky-800 text-white shadow-sm shadow-teal-500/20'
};

const DEPARTMENT_RINGS: Record<Department, string> = {
  Executive: 'ring-2 ring-violet-500/60 dark:ring-violet-400/60',
  Engineering: 'ring-2 ring-blue-500/60 dark:ring-blue-400/60',
  'Product & Design': 'ring-2 ring-emerald-500/60 dark:ring-emerald-400/60',
  'People & Culture': 'ring-2 ring-amber-500/60 dark:ring-amber-400/60',
  'Finance & Legal': 'ring-2 ring-indigo-500/60 dark:ring-indigo-400/60',
  'Sales & Growth': 'ring-2 ring-rose-500/60 dark:ring-rose-400/60',
  Operations: 'ring-2 ring-teal-500/60 dark:ring-teal-400/60'
};

const SIZE_CLASSES = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-base font-semibold',
  xl: 'w-20 h-20 text-xl font-bold',
  '2xl': 'w-28 h-28 text-3xl font-extrabold'
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  firstName,
  lastName,
  size = 'md',
  department = 'Engineering',
  status,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const colorClass = DEPARTMENT_COLORS[department] || 'bg-gradient-to-br from-slate-700 to-slate-900 text-white';
  const ringClass = DEPARTMENT_RINGS[department] || 'ring-2 ring-slate-400/40';

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={`${firstName} ${lastName}`}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className={`${SIZE_CLASSES[size]} rounded-xl object-cover ${ringClass} shadow-xs transition-transform group-hover:scale-102`}
        />
      ) : (
        <div
          className={`${SIZE_CLASSES[size]} ${colorClass} rounded-xl flex items-center justify-center font-display tracking-wider ${ringClass} select-none shadow-xs`}
        >
          {initials}
        </div>
      )}

      {status && (
        <span
          title={`Status: ${status}`}
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
            status === 'Active'
              ? 'bg-emerald-500'
              : status === 'On Leave'
              ? 'bg-amber-500'
              : 'bg-slate-400'
          }`}
        />
      )}
    </div>
  );
};
