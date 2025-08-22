import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertTriangle, ShieldCheck, Zap, TrendingUp, Brain, Globe, ArrowDown, ExternalLink } from 'lucide-react';

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

// Progress indicator component
const ProgressIndicator = ({ progress }) => {
  return (
    <div className="fixed bottom-8 left-0 right-0 mx-auto w-64 h-2 bg-gray-800/30 backdrop-blur-md rounded-full z-50 border border-gray-700/50 overflow-hidden">
      <motion.div 
        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
        style={{
          width: `${progress * 100}%`,
          transition: "width 0.3s ease-out"
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          className="text-xs text-white font-medium mix-blend-difference"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {Math.round(progress * 100)}%
        </motion.span>
      </div>
    </div>
  );
};

// Content block component
const ContentBlock = ({ children, index = 0, direction = "left" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ 
        opacity: isInView ? 1 : 0, 
        y: isInView ? 0 : 30,
        scale: isInView ? 1 : 0.98
      }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      className="prose prose-lg max-w-none text-gray-300 relative z-10"
    >
      {children}
    </motion.div>
  );
};

// Info Card component
const InfoCard = ({ title, icon: Icon, description, color }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ 
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 30,
        transition: { duration: 0.6, ease: "easeOut" }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md p-6 rounded-xl border border-gray-700/50 overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{ 
          background: `radial-gradient(circle at top right, ${color}40, ${color}00 70%)`
        }}
      />
      
      <div className="flex items-start space-x-4">
        <div 
          className={`p-3 rounded-xl relative`}
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className={`h-6 w-6`} style={{ color }} />
        </div>
        
        <div>
          <h3 
            className="text-xl font-bold font-sora mb-2"
            style={{ color: "white" }}
          >
            {title}
          </h3>
          
          <p className="text-gray-400 text-sm">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const SyntheticMediaRevolution = () => {
  // Refs
  const sectionRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  
  const [sectionInView, setSectionInView] = useState(false);
  
  // For scroll progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.3], [0, 1, 1]);
  const opacity2 = useTransform(scrollYProgress, [0.3, 0.4, 0.5], [0, 1, 1]);
  const opacity3 = useTransform(scrollYProgress, [0.5, 0.6, 0.7], [0, 1, 1]);
  
  // Check if section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setSectionInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  // Fade out scroll indicator after scroll
  useEffect(() => {
    if (!scrollIndicatorRef.current) return;
    
    const handleScroll = () => {
      if (window.scrollY > 100) {
        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power2.out"
        });
      } else {
        gsap.to(scrollIndicatorRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Content data
  const infoCards = [
    {
      title: "Deceptive Media",
      icon: AlertTriangle,
      description: "Deepfakes and synthetic media pose unprecedented challenges to trust and authenticity online.",
      color: "#ef4444"
    },
    {
      title: "AI Protection",
      icon: ShieldCheck,
      description: "Our neural networks identify synthetic content with 99.2% accuracy across multiple modalities.",
      color: "#3b82f6"
    },
    {
      title: "Cultural Context",
      icon: Globe,
      description: "Content is analyzed within the cultural framework of 50+ regions to ensure appropriate moderation.",
      color: "#10b981"
    },
    {
      title: "Real-time Analysis",
      icon: Zap,
      description: "Process thousands of items per second with an average response time of just 127ms.",
      color: "#f59e0b"
    },
    {
      title: "Explainable AI",
      icon: Brain,
      description: "Transparent decision-making with detailed explanation of every moderation decision.",
      color: "#8b5cf6"
    },
    {
      title: "Adaptive Systems",
      icon: TrendingUp,
      description: "Our algorithms continuously evolve to counter emerging synthetic media techniques.",
      color: "#ec4899"
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 md:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden"
    >
      {/* Background effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-slate-900/10"></div>
        {/* Static background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" aria-labelledby="revolution-title">
        {/* Parallax hero section */}
        <div className="min-h-[70vh] flex flex-col justify-center items-center relative mb-24">
          <motion.h1
            id="revolution-title"
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-center font-sora mb-8 md:mb-12 leading-tight"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.3,
              ease: [0.25, 0.1, 0.25, 1.0]
            }}
          >
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent relative">
              The Synthetic Media
            </span>
            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Revolution
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-blue-200/90 max-w-3xl text-center mb-12 font-inter"
          >
            Navigating the future where artificial and authentic content converge
          </motion.p>
          
          {/* Scroll indicator with bounce animation */}
          <motion.div
            ref={scrollIndicatorRef}
            className="absolute bottom-12 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.div 
              className="flex flex-col items-center"
              animate={{ 
                y: [0, 10, 0],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut" 
              }}
            >
              <div className="text-cyan-400 text-sm font-medium mb-2 flex items-center gap-2">
                <span>Scroll to explore</span>
              </div>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path 
                  d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"/>
              </svg>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Content blocks that fade in on scroll */}
        <motion.div 
          className="space-y-24 mb-24 lg:ml-16"
          style={{ opacity: opacity1, y: y1 }}
        >
          <ContentBlock index={0} direction="left">
            <p className="text-lg sm:text-xl leading-relaxed">
              We're witnessing the most dramatic transformation in media creation since the invention of photography. In 2024 alone, synthetic media generation increased by <span className="font-bold text-cyan-300">847%</span>, with over <span className="font-bold text-cyan-300">14.7 billion</span> AI-generated videos created globally. This isn't just a technological shift—it's a fundamental reimagining of how content is born, shared, and trusted.
            </p>
          </ContentBlock>
          
          <ContentBlock index={1} direction="right">
            <p className="text-lg sm:text-xl leading-relaxed">
              The revolution brings extraordinary benefits: medical students now learn from AI-generated surgical scenarios too rare to film, entertainment studios create multilingual content instantly, and individuals with speech disabilities communicate through synthetic voices that sound authentically their own.
            </p>
          </ContentBlock>
        </motion.div>
        
        <motion.div 
          className="space-y-24 mb-24 lg:mr-16"
          style={{ opacity: opacity2, y: y2 }}
        >
          <ContentBlock index={2} direction="left">
            <p className="text-lg sm:text-xl leading-relaxed">
              Yet this same technology casts long shadows. Political deepfakes have influenced elections across <span className="font-bold text-red-300">23 countries</span> in the past year. Voice cloning scams have defrauded victims of over <span className="font-bold text-red-300">$2.8 billion</span> globally. Synthetic intimate imagery has traumatized millions, while coordinated disinformation campaigns exploit AI-generated content to destabilize communities and undermine institutional trust.
            </p>
          </ContentBlock>
          
          {/* Interactive info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {infoCards.slice(0, 3).map((card, index) => (
              <InfoCard 
                key={index} 
                title={card.title} 
                icon={card.icon} 
                description={card.description} 
                color={card.color} 
              />
            ))}
          </div>
          
          <ContentBlock index={3} direction="right">
            <h2 className="text-3xl md:text-4xl font-bold font-sora text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8" aria-label="A Digital Immune System for the Information Age">
              A Digital Immune System for the Information Age
            </h2>
            
            <p className="text-lg sm:text-xl">
              ModGuard AI functions as a digital immune system—an intelligent guardian that learns, adapts, and protects without stifling innovation. Our approach mirrors biological immunity: instead of blocking all synthetic content, we identify, analyze, and contextualize it.
            </p>
          </ContentBlock>
        </motion.div>
        
        <motion.div 
          className="space-y-24 lg:mx-16"
          style={{ opacity: opacity3 }}
        >
          <ContentBlock index={4} direction="left">
            <p className="text-lg sm:text-xl leading-relaxed">
              The system operates through three interconnected layers: real-time detection algorithms that flag synthetic elements in milliseconds, cultural context engines that understand how content impacts different regions and demographics, and explainable AI that provides clear reasoning for every decision.
            </p>
          </ContentBlock>
          
          {/* Quote with special animation */}
          <motion.div
            className="relative bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-md p-10 md:p-16 rounded-xl border border-cyan-500/20 my-16 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <blockquote className="relative z-10 text-2xl md:text-3xl lg:text-4xl font-sora text-center font-bold italic text-white leading-relaxed">
              <span className="text-cyan-300">"</span>We're not reacting to the future—we're architecting it.<span className="text-cyan-300">"</span>
            </blockquote>
          </motion.div>
          
          {/* Additional info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {infoCards.slice(3).map((card, index) => (
              <InfoCard 
                key={index+3}
                title={card.title} 
                icon={card.icon} 
                description={card.description} 
                color={card.color} 
              />
            ))}
          </div>
          
          <ContentBlock index={5} direction="up">
            <p className="text-lg sm:text-xl leading-relaxed">
              For content creators, this means <span className="font-bold text-cyan-300">protection without creative constraint</span>. For online communities, it means <span className="font-bold text-cyan-300">trust without paranoia</span>. For enterprises, it means <span className="font-bold text-cyan-300">compliance without complexity</span>. We're building an internet where synthetic content serves humanity's highest aspirations while safeguarding against its darkest impulses.
            </p>
            
            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white font-bold text-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all flex items-center gap-2"
              >
                <span>Learn More</span>
                <ExternalLink className="h-5 w-5" />
              </motion.button>
              
              <motion.a 
                href="#challenge" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white font-medium text-lg hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <span>Try Challenge</span>
                <ArrowDown className="h-5 w-5" />
              </motion.a>
            </motion.div>
          </ContentBlock>
        </motion.div>
      </div>
    </section>
  );
};