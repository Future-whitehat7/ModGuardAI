import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, Star } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  type: 'feature' | 'page' | 'help' | 'demo';
  description: string;
  icon: string;
  trending?: boolean;
  recent?: boolean;
}

interface SearchAutocompleteProps {
  onSelect: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  onSelect,
  placeholder = "Search features, demos, help...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Deepfake Detection',
      type: 'feature',
      description: 'AI-powered synthetic media detection',
      icon: '🎭',
      trending: true
    },
    {
      id: '2',
      title: 'Cultural Context Filtering',
      type: 'feature',
      description: 'Regional content moderation',
      icon: '🌍'
    },
    {
      id: '3',
      title: 'Enterprise Dashboard',
      type: 'page',
      description: 'Full analytics and monitoring',
      icon: '📊',
      recent: true
    },
    {
      id: '4',
      title: 'Live Threat Map',
      type: 'demo',
      description: 'Real-time global threat visualization',
      icon: '🗺️',
      trending: true
    },
    {
      id: '5',
      title: 'API Documentation',
      type: 'help',
      description: 'Integration guides and examples',
      icon: '📚'
    },
    {
      id: '6',
      title: 'Explainable AI',
      type: 'feature',
      description: 'Transparent decision making',
      icon: '🧠'
    }
  ];

  useEffect(() => {
    const filtered = mockResults.filter(result =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase())
    );
    setResults(query ? filtered : []);
    setSelectedIndex(-1);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (result: SearchResult) => {
    setQuery(result.title);
    setIsOpen(false);
    onSelect(result);
    
    // Add to recent searches
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.id !== result.id);
      return [result, ...filtered].slice(0, 3);
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature': return 'bg-blue-100 text-blue-700';
      case 'page': return 'bg-green-100 text-green-700';
      case 'demo': return 'bg-purple-100 text-purple-700';
      case 'help': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"
          >
            {query === '' && recentSearches.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent Searches
                </h4>
                <div className="space-y-2">
                  {recentSearches.map((item, index) => (
                    <button
                      key={`recent-${item.id}`}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center space-x-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm text-gray-700">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results.length > 0 ? (
              <div className="p-2">
                {results.map((result, index) => (
                  <motion.button
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelect(result)}
                    className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-all ${
                      selectedIndex === index
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{result.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 truncate">
                          {result.title}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(result.type)}`}>
                          {result.type}
                        </span>
                        {result.trending && (
                          <div className="flex items-center space-x-1 text-xs text-red-500">
                            <TrendingUp className="h-3 w-3" />
                            <span>Trending</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {result.description}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : query && (
              <div className="p-6 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-1">Try different keywords or browse our features</p>
              </div>
            )}

            {!query && recentSearches.length === 0 && (
              <div className="p-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  Popular Searches
                </h4>
                <div className="space-y-2">
                  {mockResults.filter(r => r.trending).map((item) => (
                    <button
                      key={`popular-${item.id}`}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center space-x-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <div className="flex-1">
                        <span className="text-sm text-gray-700">{item.title}</span>
                        <div className="flex items-center space-x-1 text-xs text-red-500 mt-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>Trending</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};