import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'default', size?: 'sm' | 'md' | 'lg' }> = ({ 
  className = '', 
  variant = 'primary', 
  size = 'md',
  children, 
  ...props 
}) => {
  const variants = {
    primary: "bg-nature-600 hover:bg-nature-700 text-white shadow-lg shadow-nature-600/30",
    default: "bg-nature-600 hover:bg-nature-700 text-white shadow-lg shadow-nature-600/30",
    secondary: "bg-earth-500 hover:bg-earth-600 text-white shadow-lg shadow-earth-500/30",
    outline: "border-2 border-nature-600 text-nature-700 hover:bg-nature-50",
    ghost: "bg-transparent hover:bg-black/5 text-slate-600"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={`${sizes[size]} rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string, icon?: React.ReactNode }> = ({ 
  label, 
  className = '', 
  icon,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">{label}</label>}
      <div className="relative">
        <input 
          className={`w-full bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-nature-500/50 focus:border-nature-500 transition-all placeholder:text-slate-400 ${icon ? 'pl-11' : ''} ${className}`}
          {...props}
        />
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`glass-card p-5 rounded-2xl transition-all ${onClick ? 'cursor-pointer hover:bg-white/90 hover:shadow-xl hover:-translate-y-1' : ''} ${className}`}
  >
    {children}
  </div>
);
