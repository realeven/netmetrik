import React from 'react';

export interface ModernSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  accentColor?: string;
}

export const ModernSlider: React.FC<ModernSliderProps> = ({
  accentColor = 'var(--color-accent, #00F0FF)',
  min = 0,
  max = 100,
  value = 50,
  style,
  className = '',
  ...props
}) => {
  const numMin = typeof min === 'number' ? min : parseFloat(String(min)) || 0;
  const numMax = typeof max === 'number' ? max : parseFloat(String(max)) || 100;
  const numVal = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
  
  const percentage = Math.max(0, Math.min(100, ((numVal - numMin) / (numMax - numMin || 1)) * 100));

  const trackGradient = `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${percentage}%, rgba(255, 255, 255, 0.14) ${percentage}%, rgba(255, 255, 255, 0.14) 100%)`;

  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      className={`modern-range-slider ${className}`}
      style={{
        background: trackGradient,
        ['--slider-accent' as any]: accentColor,
        ...style
      }}
      {...props}
    />
  );
};

export default ModernSlider;
