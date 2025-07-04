import React, { useState, useEffect } from "react";

interface TabsProps<T extends string> {
  onValueChange: (value: T) => void;
  children?: React.ReactNode;
  className?: string;
  defaultValue: T;
}

interface TabsListProps {
  className?: string;
  children?: React.ReactNode;
}

interface TabsTriggerProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
  currentValue?: T;
  children?: React.ReactNode;
}

interface TabsContentProps<T extends string> {
  value: T;
  className?: string;
  currentValue?: T;
  children?: React.ReactNode;
}

export function Tabs<T extends string>({ onValueChange, children, defaultValue }: TabsProps<T>) {
  const [currentValue, setCurrentValue] = useState<T>(defaultValue);

  const handleTriggerClick = (value: T) => {
    setCurrentValue(value);
    onValueChange(value);
  };
  return (
    <div className="space-y-4">
      <TabsList>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === TabsTrigger) {
            const childProps = child.props as TabsTriggerProps<T>;
            return React.cloneElement(child as React.ReactElement<TabsTriggerProps<T>>, {
              ...childProps,
              value: childProps.value,
              onValueChange: handleTriggerClick,
              currentValue,
            });
          }
          return child;
        })}
      </TabsList>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsContent) {
          const childProps = child.props as TabsContentProps<T>;
          if (childProps.value === currentValue) {
            return React.cloneElement(child as React.ReactElement<TabsContentProps<T>>, {
              ...childProps,
              value: childProps.value,
              currentValue,
            });
          }
        }
        return null;
      })}
    </div>
  );
}

export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div className={`flex space-x-2 border-b border-gray-700 ${className || ''}`} {...props} />
  );
}

export function TabsTrigger<T extends string>({ value, onValueChange, className, currentValue, children, ...props }: TabsTriggerProps<T>) {
  if (currentValue === undefined) {
    throw new Error('TabsTrigger must receive a currentValue prop');
  }
  return (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-t-md ${
        currentValue === value
          ? 'bg-blue-600 text-white border-b-2 border-blue-600'
          : 'text-gray-400 hover:text-gray-300'
      } ${className || ''}`}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent<T extends string>({ className, currentValue, children, ...props }: TabsContentProps<T>) {
  if (currentValue === undefined) {
    throw new Error('TabsContent must receive a currentValue prop');
  }
  return (
    <div className={`pt-4 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}
