import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium ${
        variant === 'default'
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      } ${className || ''}`}
      {...props}
    />
  );
}
