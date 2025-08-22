import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface InteractiveTabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
  onChange?: (tabId: string) => void;
  animated?: boolean;
}

export const InteractiveTabs: React.FC<InteractiveTabsProps> = ({
  tabs,
  defaultTabId,
  orientation = 'horizontal',
  className = '',
  tabClassName = '',
  contentClassName = '',
  onChange,
  animated = true
}) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const updateIndicator = () => {
    if (!animated) return;
    
    const activeTab = tabRefs.current[activeTabId];
    if (!activeTab) return;

    if (orientation === 'horizontal') {
      setIndicatorStyle({
        left: `${activeTab.offsetLeft}px`,
        width: `${activeTab.offsetWidth}px`,
        height: '2px',
        bottom: '0',
        transition: 'all 0.3s ease'
      });
    } else {
      setIndicatorStyle({
        top: `${activeTab.offsetTop}px`,
        height: `${activeTab.offsetHeight}px`,
        width: '2px',
        left: '0',
        transition: 'all 0.3s ease'
      });
    }
  };

  useEffect(() => {
    updateIndicator();
    onChange?.(activeTabId);
  }, [activeTabId, orientation, onChange]);

  // Update indicator on window resize
  useEffect(() => {
    const handleResize = () => updateIndicator();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabClick = (tabId: string) => {
    if (tabs.find(tab => tab.id === tabId)?.disabled) return;
    setActiveTabId(tabId);
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className={`${className}`}>
      <div className={`relative ${orientation === 'horizontal' ? 'flex' : 'flex flex-col'}`}>
        {/* Tab List */}
        <div 
          className={`${
            orientation === 'horizontal' 
              ? 'flex space-x-1 border-b border-gray-200 w-full' 
              : 'flex flex-col space-y-1 border-r border-gray-200 pr-4'
          }`}
          role="tablist"
          aria-orientation={orientation}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              role="tab"
              aria-selected={activeTabId === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={activeTabId === tab.id ? 0 : -1}
              className={`${
                orientation === 'horizontal'
                  ? 'px-4 py-2 text-sm font-medium'
                  : 'px-4 py-2 text-sm font-medium text-left'
              } ${
                activeTabId === tab.id
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              } ${
                tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              } ${tabClassName}`}
              onClick={() => handleTabClick(tab.id)}
              disabled={tab.disabled}
            >
              <div className="flex items-center space-x-2">
                {tab.icon && <div>{tab.icon}</div>}
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
          
          {/* Active Tab Indicator */}
          {animated && (
            <motion.div
              className="absolute bg-blue-600"
              style={indicatorStyle}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </div>

        {/* Tab Content */}
        <div className={`${orientation === 'horizontal' ? 'pt-4' : 'pl-4'} ${contentClassName}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTabId}
              id={`panel-${activeTabId}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTabId}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab?.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};