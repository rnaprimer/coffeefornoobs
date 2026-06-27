import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  icon: Icon, 
  iconPosition = 'right', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  
  const baseClasses = "inline-flex items-center justify-center font-bold text-sm uppercase px-6 py-3 rounded-full brutal-border brutal-shadow hover:brutal-shadow-hover transition-all";
  
  const variantClasses = {
    primary: "bg-brand-lime text-brand-dark",
    secondary: "bg-brand-pink text-brand-dark",
    dark: "bg-brand-dark text-brand-lime",
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={16} className="mr-2" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={16} className="ml-2" />}
    </button>
  );
}
