import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Menu, 
  X, 
  ChevronDown,
  ExternalLink,
  Play,
  Upload
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
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationLinks = [
    { name: 'Technology', href: '/features' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Community', href: '/student-portal' },
    { name: 'Resources', href: '/blog' },
    { name: 'Developers', href: '/api' }
  ];

  const mobileNavigationSections: NavigationSection[] = [
    {
      name: 'Solutions',
      items: [
        { name: 'For Creators', href: '/solutions/creators' },
        { name: 'For Enterprises', href: '/solutions/brands' },
        { name: 'For Policy Makers', href: '/solutions/government' },
        { name: 'For Journalists', href: '/solutions/education' }
      ]
    },
    {
      name: 'Community',
      items: [
        { name: 'AI Fellowship', href: '/student-portal' },
        { name: 'Deepfake Challenges', href: '/leaderboard' },
        { name: 'Events & Webinars', href: '/events' },
        { name: 'Research Network', href: '/threat-map' }
      ]
    },
    {
      name: 'Resources',
      items: [
        { name: 'Research & Insights', href: '/blog' },
        { name: 'Case Studies', href: '/case-studies' },
        { name: 'Best Practices', href: '/resources' },
        { name: 'Transparency Dashboard', href: '/dashboard' }
      ]
    },
    {
      name: 'Developers',
      items: [
        { name: 'API Documentation', href: '/api' },
        { name: 'SDKs & Libraries', href: '/api#sdks' },
        { name: 'Integration Guides', href: '/resources' },
        { name: 'Sandbox', href: '/demo' }
      ]
    }
  ];

  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveMobileDropdown(null);
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.action) {
      item.action();
    }
    setIsMenuOpen(false);
    setActiveMobileDropdown(null);
  };

  const toggleMobileDropdown = (sectionName: string) => {
    if (isMobile) {
      setActiveMobileDropdown(activeMobileDropdown === sectionName ? null : sectionName);
    }
  };

  return (
    <header 
      id="header"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-4' 
          : 'py-5'
      }`}
      style={{
        background: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}
    >
      <nav className="container max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            className="flex items-center flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link 
              to="/" 
              className="logo"
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#1a1a2e',
                textDecoration: 'none',
                letterSpacing: '-0.5px'
              }}
            >
              ModGuardAI
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center nav-links" style={{ gap: '40px' }}>
            {navigationLinks.map((link) => (
              <li key={link.name} className="nav-item">
                <Link
                  to={link.href}
                  className="nav-link"
                  style={{
                    textDecoration: 'none',
                    color: '#1a1a2e',
                    fontWeight: 600,
                    fontSize: '16px',
                    transition: 'all 0.3s',
                    padding: '10px 0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#16d9e3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1a1a2e';
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center">
            <motion.button
              whileHover={{
                scale: 1.02,
                y: -2,
                boxShadow: "0 12px 35px rgba(22, 217, 227, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // Simple auth simulation
                const email = prompt('Enter email:');
                const password = prompt('Enter password:');
                
                if (email && password) {
                  // Simulate login process
                  alert('Login successful! Redirecting to dashboard...');
                  window.location.href = '/dashboard';
                } else {
                  alert('Please enter both email and password');
                }
              }}
              className="cta-button"
              style={{
                background: 'linear-gradient(135deg, #16d9e3, #1a1a2e)',
                color: 'white',
                padding: '14px 28px',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                transition: 'all 0.3s',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Login/Dashboard
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <motion.button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none p-2"
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
      </nav>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden"
            style={{
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            <div className="px-4 pt-2 pb-6 space-y-1 max-h-[calc(100vh-80px)] overflow-y-auto">
              {mobileNavigationSections.map((section, sectionIndex) => (
                <div key={section.name}>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sectionIndex * 0.05 }}
                    onClick={() => toggleMobileDropdown(section.name)}
                    className="w-full text-left px-3 py-3 rounded-lg text-base font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 flex items-center justify-between"
                  >
                    <span>{section.name}</span>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        activeMobileDropdown === section.name ? 'rotate-180' : ''
                      }`} 
                    />
                  </motion.button>
                  
                  <AnimatePresence>
                    {activeMobileDropdown === section.name && (
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
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all duration-150"
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
              
              {/* Mobile Technology Link */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  to="/features"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-base font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                >
                  Technology
                </Link>
              </motion.div>
              
              {/* Mobile Dashboard Link */}
              <motion.button
                onClick={() => {
                  setIsMenuOpen(false);
                  const email = prompt('Enter email:');
                  const password = prompt('Enter password:');
                  
                  if (email && password) {
                    alert('Login successful! Redirecting to dashboard...');
                    window.location.href = '/dashboard';
                  } else {
                    alert('Please enter both email and password');
                  }
                }}
                className="block px-3 py-3 rounded-lg text-base font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (mobileNavigationSections.length + 2) * 0.05 }}
              >
                Login/Dashboard
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};