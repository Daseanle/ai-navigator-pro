import React from 'react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  value: string;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

export function Select({ value, onValueChange, children, className }: SelectProps) {
  return (
    <div className={`relative ${className || ''}`}>
      <SelectContext.Provider value={{ value, onValueChange }}>
        <div className="relative">
          <SelectTrigger>
            <SelectValue value={value} />
          </SelectTrigger>
          <SelectContent>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.type === SelectItem) {
                return React.cloneElement(child as React.ReactElement<SelectItemProps>, {
                  value,
                });
              }
              return child;
            })}
          </SelectContent>
        </div>
      </SelectContext.Provider>
    </div>
  );
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
  return (
    <div className={`py-1 ${className || ''}`}>
      {children}
    </div>
  );
}

export function SelectValue({ value, className }: SelectValueProps) {
  return (
    <div className={`py-1 ${className || ''}`}>
      {value}
    </div>
  );
}

export function SelectContent({ children, className }: SelectContentProps) {
  return (
    <div className={`absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-md border border-gray-700 ${className || ''}`}>
      {children}
    </div>
  );
}

export function SelectItem({ value, children }: SelectItemProps) {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error('SelectItem must be used within a Select');
  }

  const { onValueChange } = context;

  return (
    <div
      className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
      onClick={() => onValueChange(value)}
    >
      {children}
    </div>
  );
}
