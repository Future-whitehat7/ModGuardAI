import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Zap, FileText, ArrowRight } from 'lucide-react';

interface WorkflowCardProps {
  icon: React.ReactNode;
  title: string;
  preview: string;
  details: string;
  index: number;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ icon, title, preview, details, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 255, 247, 0.15)" }}
      onClick={() => setIsExpanded(!isExpanded)}
      className="bg-white rounded-xl border border-slate-200 p-6 cursor-pointer transition-all hover:border-cyan-200 glow-on-hover"
    >
      <div className="flex items-start space-x-4">
        <div className="bg-gradient-to-br from-cyan-400/20 to-blue-400/20 p-3 rounded-lg">
          {icon}
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 font-sora mb-2">{title}</h3>
          <p className="text-gray-600">{preview}</p>
          
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0,
              marginTop: isExpanded ? 16 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-gray-600 border-t border-gray-100 pt-4">{details}</p>
            
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              animate={{ 
                x: isExpanded ? 0 : -10,
                opacity: isExpanded ? 1 : 0
              }}
              transition={{ delay: 0.1 }}
              className="flex items-center mt-3 text-blue-600"
            >
              <span className="text-sm font-medium">Learn more</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-400"
        >
          <ArrowRight className="h-5 w-5" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export const HowItWorks: React.FC = () => {
  const cards = [
    {
      icon: <Upload className="h-8 w-8 text-cyan-500" />,
      title: "Upload or Stream Content",
      preview: "Seamlessly integrate any content source",
      details: "Connect your platform via our API or upload files directly through our intuitive dashboard. ModGuard handles images, videos, audio, and text with equal precision."
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      title: "Real-Time Detection & XAI",
      preview: "127ms average processing time",
      details: "Our explainable AI (XAI) processes content in real-time, detecting threats while providing transparent reasoning behind every decision. No black box – just clear insights."
    },
    {
      icon: <FileText className="h-8 w-8 text-purple-500" />,
      title: "Export PDF or JSON Reports",
      preview: "Comprehensive, actionable insights",
      details: "Generate detailed reports with visual heatmaps, confidence scores, and regional compliance insights. Export in various formats for seamless integration with your workflows."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-sora">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              How ModGuard Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-inter">
            Enterprise-grade content moderation in three simple steps
          </p>
        </motion.div>

        <div className="relative">
          {/* Radar ping effect */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none opacity-20">
            <motion.div
              animate={{ 
                scale: [1, 2],
                opacity: [0.5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute inset-0 rounded-full border border-cyan-400"
            />
            <motion.div
              animate={{ 
                scale: [1, 3],
                opacity: [0.5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
                delay: 1
              }}
              className="absolute inset-0 rounded-full border border-cyan-400"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <WorkflowCard
                key={index}
                icon={card.icon}
                title={card.title}
                preview={card.preview}
                details={card.details}
                index={index}
              />
            ))}
          </div>
          
          {/* Live system indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center justify-center mt-12"
          >
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-200">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
              <span className="text-sm text-gray-600 font-medium">System Active | Processing 10.3M items/day</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};