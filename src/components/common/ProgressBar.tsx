import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'indigo' | 'amber' | 'red';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  className = '',
  showLabel = true,
  size = 'md',
  color = 'emerald',
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const getColorClass = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-amber-500';
    if (percentage >= 50) return 'bg-amber-400';
    return `bg-${color}-500`;
  };
  
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-4';
      default: return 'h-2.5';
    }
  };
  
  return (
    <div className={className}>
      <div className="w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${getColorClass()} ${getSizeClass()} transition-all duration-500 ease-in-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-gray-600 flex justify-between">
          <span>{value.toFixed(0)}</span>
          <span>{percentage}%</span>
          <span>{max.toFixed(0)}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;