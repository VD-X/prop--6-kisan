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

export const OTPInput: React.FC<{
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
}> = ({ length = 6, onComplete, disabled }) => {
  const [otp, setOtp] = React.useState<string[]>(new Array(length).fill(""));
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    // Allow pasting
    if (val.length > 1) {
      const pastedData = val.slice(0, length).split("");
      for (let i = 0; i < length; i++) {
        newOtp[i] = pastedData[i] || "";
      }
      setOtp(newOtp);
      if (newOtp.every(digit => digit !== "")) {
        onComplete(newOtp.join(""));
      }
      inputRefs.current[Math.min(val.length, length - 1)]?.focus();
      return;
    }

    newOtp[index] = val;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          maxLength={length}
          value={digit}
          disabled={disabled}
          onChange={e => handleChange(e, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-nature-600 focus:ring-4 focus:ring-nature-600/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white"
        />
      ))}
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
