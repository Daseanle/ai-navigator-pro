'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

type SearchBarProps = {
  placeholder?: string;
  className?: string;
  initialQuery?: string;
  compact?: boolean;
};

export default function SearchBar({ 
  placeholder = '搜索AI工具...', 
  className = '',
  initialQuery = '',
  compact = false
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="relative">
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-neutral-900 border border-neutral-700 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white ${compact ? 'px-4 py-2 pl-10 text-sm' : 'px-5 py-3 pl-12'}`}
          />
          <div className="absolute inset-y-0 left-0 flex items-center justify-center pl-3">
            <Search className="text-neutral-400" size={compact ? 16 : 20} />
          </div>
        </div>
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors"
        >
          <Search size={compact ? 16 : 20} />
        </button>
      </div>
    </form>
  );
}