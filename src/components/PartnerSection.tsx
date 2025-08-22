import React from 'react';
import { motion } from 'framer-motion';
import {
  Newspaper,
  TrendingUp,
  Puzzle,
  ArrowRight,
  Calendar,
  Download,
  ExternalLink
} from 'lucide-react';

interface PartnerCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaText: string;
  ctaIcon: React.ReactNode;
  onClick: () => void;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ icon, title, description, ctaText, ctaIcon, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -10, boxShadow: "0 0 30px rgba(0, 255, 247, 0.2)" }}
      transition={{ duration: 0.3 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 flex flex-col h-full relative overflow-hidden group"
    >
      {/* Gradient overlay effect on hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="bg-white/10 backdrop-blur-lg w-12 h-12 rounded-lg flex items-center justify-center mb-6">
          {icon}
        </div>
        
        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-4 font-sora">
          {title}
        </h3>
        <p className="text-slate-300 mb-6 flex-grow">
          {description}
        </p>
        
        {/* CTA Button */}
        <motion.button
          whileHover={{ 
            x: 5, 
            boxShadow: "0 0 20px rgba(0, 255, 247, 0.4)",
            backgroundColor: "rgba(255, 255, 255, 0.15)"
          }}
          whileTap={{ scale: 0.98 }}
          onClick={onClick}
          className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white font-medium transition-all"
        >
          <span>{ctaText}</span>
          {ctaIcon}
        </motion.button>
      </div>
    </motion.div>
  );
};

export const PartnerSection: React.FC = () => {
  const handleGetBriefing = () => {
    // In a real app, this would open a form or calendar
    console.log('Get media briefing');
  };

  const handleDownloadDeck = () => {
    // In a real app, this would trigger a download
    console.log('Download investor deck');
  };

  const handleBookDemo = () => {
    // In a real app, this would open a calendar booking
    console.log('Book ecosystem demo');
  };

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00FFF7" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-sora">
            Partner with ModGuard
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-inter">
            Join our mission to create a safer digital landscape through strategic partnerships
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Media Partners */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <PartnerCard
              icon={<Newspaper className="h-6 w-6 text-cyan-400" />}
              title="Media Partners"
              description="Get exclusive access to AI safety news and research insights. Be at the forefront of digital reality defense."
              ctaText="Get Briefing"
              ctaIcon={<Calendar className="h-5 w-5" />}
              onClick={handleGetBriefing}
            />
          </motion.div>

          {/* Investors */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <PartnerCard
              icon={<TrendingUp className="h-6 w-6 text-cyan-400" />}
              title="Investors"
              description="Join our mission to build a more trustworthy digital world. Invest in the future of content authenticity at scale."
              ctaText="Download Deck"
              ctaIcon={<Download className="h-5 w-5" />}
              onClick={handleDownloadDeck}
            />
          </motion.div>

          {/* Ecosystem Partners */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <PartnerCard
              icon={<Puzzle className="h-6 w-6 text-cyan-400" />}
              title="Ecosystem"
              description="Integrate cutting-edge content moderation into your platform. Build trust with your users through verified content."
              ctaText="Book Demo"
              ctaIcon={<ExternalLink className="h-5 w-5" />}
              onClick={handleBookDemo}
            />
          </motion.div>
        </div>

        {/* Certification badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-6 mt-16"
        >
          {['GDPR Compliant', 'ISO 27001', 'SOC2 Type II'].map((cert, i) => (
            <div key={i} className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-sm text-slate-300">{cert}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};