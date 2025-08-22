import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, TrendingDown, Filter, Download, Eye, EyeOff } from 'lucide-react';

interface DataPoint {
  id: string;
  label: string;
  value: number;
  color: string;
  trend?: number;
  category?: string;
  metadata?: Record<string, any>;
}

interface InteractiveChartProps {
  data: DataPoint[];
  type: 'bar' | 'pie' | 'line' | 'area';
  title: string;
  height?: number;
  animated?: boolean;
  interactive?: boolean;
  showLegend?: boolean;
  showFilters?: boolean;
  onDataPointClick?: (dataPoint: DataPoint) => void;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  type,
  title,
  height = 300,
  animated = true,
  interactive = true,
  showLegend = true,
  showFilters = false,
  onDataPointClick
}) => {
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [filteredData, setFilteredData] = useState(data);
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(new Set());
  const [animationProgress, setAnimationProgress] = useState(0);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(data.map(d => d.category).filter(Boolean)));
    return cats;
  }, [data]);

  useEffect(() => {
    if (categories.length > 0) {
      setVisibleCategories(new Set(categories));
    }
  }, [categories]);

  useEffect(() => {
    const filtered = data.filter(d => 
      !d.category || visibleCategories.has(d.category)
    );
    setFilteredData(filtered);
  }, [data, visibleCategories]);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimationProgress(1);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [animated, data]);

  const maxValue = Math.max(...filteredData.map(d => d.value));

  const handleCategoryToggle = (category: string) => {
    setVisibleCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const renderBarChart = () => {
    return (
      <div className="flex items-end space-x-2 h-full">
        {filteredData.map((point, index) => (
          <motion.div
            key={point.id}
            className="flex-1 flex flex-col items-center group cursor-pointer"
            initial={{ height: 0 }}
            animate={{ height: animated ? (point.value / maxValue) * (height - 60) : (point.value / maxValue) * (height - 60) }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
            onClick={() => {
              setSelectedPoint(point);
              onDataPointClick?.(point);
            }}
          >
            <div className="relative w-full">
              <div
                className="w-full rounded-t-lg transition-all duration-200 group-hover:opacity-80"
                style={{ 
                  backgroundColor: point.color,
                  height: (point.value / maxValue) * (height - 60)
                }}
              />
              
              {/* Value Label */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {point.value}
                {point.trend && (
                  <div className="flex items-center space-x-1 mt-1">
                    {point.trend > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    )}
                    <span className={point.trend > 0 ? 'text-green-400' : 'text-red-400'}>
                      {Math.abs(point.trend)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-600 text-center truncate w-full">
              {point.label}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderPieChart = () => {
    const total = filteredData.reduce((sum, point) => sum + point.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width={height} height={height} className="transform -rotate-90">
            {filteredData.map((point, index) => {
              const percentage = (point.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -cumulativePercentage;
              
              const result = (
                <motion.circle
                  key={point.id}
                  cx={height / 2}
                  cy={height / 2}
                  r={height / 2 - 20}
                  fill="none"
                  stroke={point.color}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  initial={{ strokeDasharray: "0 100" }}
                  animate={{ strokeDasharray: animated ? strokeDasharray : strokeDasharray }}
                  transition={{ delay: index * 0.2, duration: 0.8, ease: "easeOut" }}
                  onClick={() => {
                    setSelectedPoint(point);
                    onDataPointClick?.(point);
                  }}
                />
              );
              
              cumulativePercentage += percentage;
              return result;
            })}
          </svg>
          
          {/* Center Label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          {showFilters && categories.length > 0 && (
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    visibleCategories.has(category)
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height }}>
        {type === 'bar' && renderBarChart()}
        {type === 'pie' && renderPieChart()}
      </div>

      {/* Legend */}
      {showLegend && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex flex-wrap gap-4"
        >
          {filteredData.map((point, index) => (
            <motion.div
              key={point.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                setSelectedPoint(point);
                onDataPointClick?.(point);
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: point.color }}
              />
              <span className="text-sm text-gray-700">{point.label}</span>
              <span className="text-sm font-medium text-gray-900">{point.value}</span>
              {point.trend && (
                <div className="flex items-center space-x-1">
                  {point.trend > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs ${point.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(point.trend)}%
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Selected Point Details */}
      <AnimatePresence>
        {selectedPoint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{selectedPoint.label}</h4>
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <EyeOff className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Value:</span>
                <span className="ml-2 font-medium">{selectedPoint.value}</span>
              </div>
              {selectedPoint.trend && (
                <div>
                  <span className="text-gray-600">Trend:</span>
                  <span className={`ml-2 font-medium flex items-center space-x-1 ${
                    selectedPoint.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedPoint.trend > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{Math.abs(selectedPoint.trend)}%</span>
                  </span>
                </div>
              )}
              {selectedPoint.category && (
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-medium">{selectedPoint.category}</span>
                </div>
              )}
            </div>
            {selectedPoint.metadata && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-gray-600 text-sm">Additional Info:</span>
                <div className="mt-1 text-sm text-gray-700">
                  {Object.entries(selectedPoint.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span>{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Real-time chart component
export const RealTimeChart: React.FC<{
  title: string;
  dataGenerator: () => DataPoint[];
  updateInterval?: number;
  maxDataPoints?: number;
}> = ({
  title,
  dataGenerator,
  updateInterval = 2000,
  maxDataPoints = 20
}) => {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData, ...dataGenerator()];
        return newData.slice(-maxDataPoints);
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [dataGenerator, updateInterval, maxDataPoints]);

  return (
    <InteractiveChart
      data={data}
      type="line"
      title={title}
      animated={true}
      interactive={true}
      showLegend={true}
    />
  );
};