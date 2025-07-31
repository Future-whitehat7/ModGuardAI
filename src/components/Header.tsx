import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Menu, 
  X, 
  ChevronDown,
  ExternalLink,
  Play
} from 'lucide-react';

interface DropdownItem {
  name: string;
  href: string;
  action?: () => void;
}

interface NavigationSection {
  name: string;
  items: DropdownItem[];
}

interface HeaderProps {
  onWatchDemo?: () => void;
  onOpenEnterpriseModal?: () => void;
  onOpenFellowshipModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onWatchDemo, 
  onOpenEnterpriseModal, 
  onOpenFellowshipModal 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout>();

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationStructure: NavigationSection[] = [
    {
      name: 'Features',
      items: [
        { name: 'Deepfake Detection', href: '/features/deepfake-detection' },
        { name: 'Cultural Context AI', href: '/features/cultural-context' },
        { name: 'Real-time Processing', href: '/features/real-time-processing' },
        { name: 'Threat Intelligence', href: '/features/threat-intelligence' },
        { name: 'Compliance & Ethics', href: '/features/compliance-ethics' },
        { name: 'Team Collaboration', href: '/features/team-collaboration' },
        { name: 'All Features', href: '/features' }
      ]
    },
    {
      name: 'Solutions',
      items: [
        { name: 'For Creators', href: '/solutions/creators' },
        { name: 'For Brands & Enterprises', href: '/solutions/brands' },
        { name: 'For Government', href: '/solutions/government' },
        { name: 'For Education', href: '/solutions/education' },
        { name: 'All Solutions', href: '/solutions' }
      ]
    },
    {
      name: 'AI Fellowship',
      items: [
        { name: 'Program Overview', href: '/student-portal' },
        { name: 'Student Portal', href: '/student-portal' },
        { name: 'Apply to Join', href: '/student-portal', action: onOpenFellowshipModal }
      ]
    },
    {
      name: 'Deepfake Challenge',
      items: [
        { name: 'Challenge Brief', href: '/#challenge' },
        { name: 'Leaderboard', href: '/leaderboard' },
        { name: 'Submit Entry', href: '/leaderboard' }
      ]
    },
    {
      name: 'Media & Press',
      items: [
        { name: 'Blog', href: '/media' },
        { name: 'Case Studies', href: '/case-studies' },
        { name: 'Press Kit', href: '/media#press-kit' },
        { name: 'Submit Story', href: '/media#submit-story' }
      ]
    },
    {
      name: 'Transparency Dashboard',
      items: [
        { name: 'Live KPIs', href: '/transparency' },
        { name: 'Global Threat Map', href: '/threat-map' },
        { name: 'Ethics Audits', href: '/transparency' },
        { name: 'Compliance Reports', href: '/transparency' }
      ]
    }
  ];

  const handleMouseEnter = (sectionName: string) => {
    if (!isMobile) {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
      setActiveDropdown(sectionName);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      dropdownTimeoutRef.current = setTimeout(() => {
        setActiveDropdown(null);
      }, 200);
    }
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
  };

  const handleDropdownMouseLeave = () => {
    if (!isMobile) {
      dropdownTimeoutRef.current = setTimeout(() => {
        setActiveDropdown(null);
      }, 200);
    }
  };

  const toggleMobileDropdown = (sectionName: string) => {
    if (isMobile) {
      setActiveDropdown(activeDropdown === sectionName ? null : sectionName);
    }
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveDropdown(null);
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.action) {
      item.action();
    }
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-3">
          {/* Logo - Left aligned with proper spacing */}
          <motion.div 
            className="flex items-center flex-shrink-0 mr-8"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Shield className="h-8 w-8 text-cyan-400" />
            <span className="ml-3 text-xl font-bold text-white font-['Space_Grotesk']">
              ModGuard AI
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 flex-1">
            {navigationStructure.map((section) => (
              <div 
                key={section.name} 
                className="relative"
                onMouseEnter={() => handleMouseEnter(section.name)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center font-['Inter'] font-medium py-2">
                  <span>{section.name}</span>
                  <ChevronDown 
                    className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                      activeDropdown === section.name ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === section.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-0 mt-1 w-64 bg-slate-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-slate-700/50 py-2 z-50"
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                    >
                      {section.items.map((item, index) => (
                        <motion.a
                          key={item.name}
                          href={item.href}
                          onClick={(e) => {
                            if (item.action) {
                              e.preventDefault();
                              handleItemClick(item);
                            }
                          }}
                          className="block px-4 py-3 text-sm text-gray-300 hover:bg-slate-700/50 hover:text-white transition-colors duration-150 font-['Inter']"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          {item.name}
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Desktop Right Side - API Access, Dashboard, Watch Demo */}
          <div className="hidden lg:flex items-center space-x-6 ml-8">
            <a 
              href="/api" 
              className="text-gray-300 hover:text-white transition-colors duration-200 font-['Inter'] font-medium"
            >
              API Access
            </a>
            
            <a 
              href="/enterprise-dashboard" 
              className="text-gray-300 hover:text-white transition-colors duration-200 font-['Inter'] font-medium"
            >
              Dashboard
            </a>
            
            {/* Watch Demo CTA Button */}
            <motion.button
              onClick={onWatchDemo}
              className="relative px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg font-['Inter'] overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative z-10 flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Watch Demo</span>
              </div>
              
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              
              {/* Pulse border effect */}
              <motion.div
                className="absolute inset-0 rounded-lg border-2 border-cyan-400/50"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <motion.button
              onClick={toggleMobileMenu}
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white p-2"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-slate-900/98 backdrop-blur-lg border-t border-slate-800/50"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 max-h-[calc(100vh-80px)] overflow-y-auto">
              {navigationStructure.map((section, sectionIndex) => (
                <div key={section.name}>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sectionIndex * 0.05 }}
                    onClick={() => toggleMobileDropdown(section.name)}
                    className="w-full text-left px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 flex items-center justify-between font-['Inter']"
                  >
                    <span>{section.name}</span>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === section.name ? 'rotate-180' : ''
                      }`} 
                    />
                  </motion.button>
                  
                  <AnimatePresence>
                    {activeDropdown === section.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-6 space-y-1 overflow-hidden"
                      >
                        {section.items.map((item, itemIndex) => (
                          <motion.a
                            key={item.name}
                            href={item.href}
                            onClick={(e) => {
                              if (item.action) {
                                e.preventDefault();
                                handleItemClick(item);
                              } else {
                                setIsMenuOpen(false);
                              }
                            }}
                            className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-slate-800/30 rounded-md transition-all duration-150 font-['Inter']"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemIndex * 0.03 }}
                          >
                            {item.name}
                          </motion.a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              
              {/* Mobile API Access and Dashboard Links */}
              <motion.a
                href="/api"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 font-['Inter']"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navigationStructure.length * 0.05 }}
              >
                API Access
              </motion.a>
              
              <motion.a
                href="/enterprise-dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 font-['Inter']"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navigationStructure.length + 1) * 0.05 }}
              >
                Dashboard
              </motion.a>
              
              {/* Mobile Watch Demo Button */}
              <motion.div
                className="pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navigationStructure.length + 2) * 0.05 }}
              >
                <button
                  onClick={() => {
                    onWatchDemo?.();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25 font-['Inter'] flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Watch Demo</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};