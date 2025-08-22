import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, Shield, CheckCircle } from 'lucide-react';

interface CountdownProps {
  deadline: Date;
  onExpired?: () => void;
  onSignup?: () => void;
}

export const EnterpriseCohortCountdown: React.FC<CountdownProps> = ({
  deadline = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // Default: 6 days from now
  onExpired,
  onSignup
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = deadline.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        onExpired?.();
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false
      });
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [deadline, onExpired]);
  
  // Play a faint click sound - in a real implementation this would require a sound file
  const playTickSound = () => {
    // This would normally play a sound effect
    // const audio = new Audio('/tick.mp3');
    // audio.volume = 0.2;
    // audio.play();
  };

  useEffect(() => {
    if (!timeLeft.isExpired && timeLeft.seconds % 10 === 0) {
      playTickSound();
    }
  }, [timeLeft.seconds]);

  const isNearlyExpired = timeLeft.days === 0 && timeLeft.hours < 24;

  return (
    <section className="relative py-24 bg-gradient-to-r from-gray-50 to-gray-100 overflow-hidden">
      {/* Background Elements */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
        style={{
          backgroundImage: 'radial-gradient(circle at center, #00FFF7 8%, transparent 10%)',
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Floating Element */}
      <motion.div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-r from-cyan-300/10 to-blue-300/10 blur-3xl"
        animate={{ 
          x: [-10, 10, -10],
          y: [-10, 10, -10],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-sora">
              Your Window to the Future Is Closing
            </h2>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl font-bold text-blue-600 mb-8"
            >
              New Enterprise Beta Cohort Opens in:
            </motion.div>
            
            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-4 gap-4 mb-10"
            >
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Minutes' },
                { value: timeLeft.seconds, label: 'Seconds' }
              ].map((timeUnit, index) => (
                <motion.div
                  key={timeUnit.label}
                  animate={{ 
                    scale: timeUnit.value === 0 && index !== 0 ? [1, 1.05, 1] : 1,
                    y: timeUnit.value === 0 && index !== 0 ? [0, -2, 0] : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <motion.div 
                    className={`text-4xl md:text-6xl font-bold font-mono p-4 rounded-xl shadow-lg ${
                      isNearlyExpired ? 'text-red-600 bg-red-50' : 'text-gray-900 bg-white'
                    }`}
                    animate={{ 
                      y: timeUnit.value !== timeLeft[timeUnit.label.toLowerCase() as keyof typeof timeLeft] ? [0, -5, 0] : 0 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {String(timeUnit.value).padStart(2, '0')}
                  </motion.div>
                  <div className="mt-2 text-sm md:text-base text-gray-600">{timeUnit.label}</div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* CTA Button */}
            <motion.div 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(0, 255, 247, 0.5)"
                }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() => onSignup?.()}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all glow-on-hover"
              >
                <motion.span 
                  animate={{ 
                    x: isHovering ? [-2, 5, 0] : 0 
                  }}
                  transition={{ duration: 0.5 }}
                >
                  Secure Access Now
                </motion.span>
                <motion.div
                  animate={{ 
                    x: isHovering ? [0, 10, 5] : 0,
                    opacity: isHovering ? 1 : 0.7
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.div>
              </motion.button>
            </motion.div>
            
            {/* Compliance Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center items-center gap-6"
            >
              {[
                { label: 'SOC2 Type II', abbr: 'SOC2' },
                { label: 'GDPR Compliant', abbr: 'GDPR' },
                { label: 'EU AI Act', abbr: 'AI ACT' },
                { label: 'ISO 27001', abbr: 'ISO' }
              ].map((cert) => (
                <div key={cert.abbr} className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{cert.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};