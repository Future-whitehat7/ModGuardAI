import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, RotateCcw, CheckCircle, XCircle, Eye, Brain, Trophy, 
  ArrowRight, Volume2, VolumeX, Zap, Clock, Target, Sparkles,
  AlertTriangle, Shield, Video, Camera, Lightbulb
} from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  isDeepfake: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  hints: string[];
  explanation: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  fallbackUrl: string;
  source: string;
}

// Using real video samples from various sources
const mockVideos: VideoData[] = [
  {
    id: '1',
    title: 'Celebrity Interview Analysis',
    isDeepfake: true,
    difficulty: 'medium',
    hints: ['Watch the lip sync carefully', 'Notice the lighting on the face', 'Check eye movements and blinking patterns'],
    explanation: 'This is a deepfake. The lip synchronization is slightly off, and the facial lighting doesn\'t match the environment. The blinking pattern is also unnatural.',
    thumbnail: '🎬',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    fallbackUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '0:30',
    source: 'Sample Media'
  },
  {
    id: '2',
    title: 'News Anchor Report',
    isDeepfake: false,
    difficulty: 'easy',
    hints: ['Look for natural micro-expressions', 'Check audio-visual sync', 'Observe background consistency'],
    explanation: 'This is real footage. The micro-expressions, natural eye movements, and perfect audio-visual synchronization indicate authenticity.',
    thumbnail: '📺',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    fallbackUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '0:45',
    source: 'Google Sample'
  },
  {
    id: '3',
    title: 'Political Speech Segment',
    isDeepfake: true,
    difficulty: 'hard',
    hints: ['Examine facial texture', 'Watch for temporal inconsistencies', 'Check reflection in eyes'],
    explanation: 'This is a sophisticated deepfake. The giveaway is the slight temporal inconsistency in facial expressions and unnatural eye reflections.',
    thumbnail: '🏛️',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    fallbackUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    duration: '1:15',
    source: 'Sample Media'
  },
  {
    id: '4',
    title: 'Social Media Clip',
    isDeepfake: false,
    difficulty: 'easy',
    hints: ['Natural lighting variations', 'Consistent skin texture', 'Authentic emotions'],
    explanation: 'This is genuine content. The natural lighting variations and consistent emotional expressions confirm its authenticity.',
    thumbnail: '📱',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    fallbackUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '0:25',
    source: 'Google Sample'
  },
  {
    id: '5',
    title: 'Corporate Message',
    isDeepfake: true,
    difficulty: 'medium',
    hints: ['Facial boundary artifacts', 'Inconsistent head movements', 'Audio quality mismatch'],
    explanation: 'This is a deepfake. Notice the subtle artifacts around the facial boundaries and the slight mismatch between head movements and audio.',
    thumbnail: '💼',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    fallbackUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration: '0:40',
    source: 'Sample Media'
  },
  {
    id: '6',
    title: 'Educational Content',
    isDeepfake: false,
    difficulty: 'medium',
    hints: ['Natural gesture coordination', 'Consistent voice patterns', 'Environmental audio match'],
    explanation: 'This is authentic content. The natural coordination between gestures and speech, along with consistent environmental audio, confirms its genuineness.',
    thumbnail: '🎓',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    fallbackUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '0:35',
    source: 'Google Sample'
  }
];

interface VideoPlayerProps {
  video: VideoData;
  onGuess: (isDeepfake: boolean) => void;
  showResult: boolean;
  userGuess: boolean | null;
  isActive: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onGuess, showResult, userGuess, isActive }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Handle video loading errors
    const handleError = () => {
      console.error("Video loading error, trying fallback");
      video.src = video.fallbackUrl;
      video.load();
    };

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      videoRef.current.pause();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0.7, 
        scale: isActive ? 1 : 0.95,
        y: isActive ? 0 : 10
      }}
      transition={{ duration: 0.3 }}
      className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
        isActive ? 'border-cyan-400 shadow-lg shadow-cyan-400/25' : 'border-slate-700'
      }`}
    >
      {/* Video Container */}
      <div className="relative aspect-video">
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-0">
          {/* Video Loading Placeholder */}
          <div className="text-cyan-400 animate-pulse flex flex-col items-center">
            <Video className="h-10 w-10 mb-2" />
            <span className="text-xs">Loading video...</span>
          </div>
        </div>
        
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-cover z-10 relative"
          muted={isMuted}
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
          {/* Top Info Bar */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(video.difficulty)}`}>
                {video.difficulty.toUpperCase()}
              </span>
              <span className="text-white/80 text-xs bg-black/50 px-2 py-1 rounded">
                {video.source}
              </span>
            </div>
            
            <button
              onClick={toggleMute}
              className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </motion.button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-1 mb-4">
              <div 
                className="bg-cyan-400 h-1 rounded-full transition-all duration-100"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>

            {/* Time and Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-white text-sm">
                <Clock className="h-4 w-4" />
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
              
              <button
                onClick={resetVideo}
                className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Hints Panel */}
            <div className="mb-4">
              <button
                onClick={() => setShowHints(!showHints)}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-yellow-500/80 to-orange-500/80 rounded-full text-white text-sm font-medium hover:from-yellow-500 hover:to-orange-500 transition-colors shadow-md"
              >
                <Lightbulb className="h-4 w-4" />
                <span>{showHints ? "Hide Hints" : "Show Detection Hints"}</span>
              </button>
              
              <AnimatePresence>
                {showHints && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: 10, height: 0 }}
                    className="mt-3 bg-black/80 backdrop-blur-md rounded-lg p-4 border border-yellow-500/20"
                  >
                    <h4 className="text-white font-medium mb-2 flex items-center">
                      <Brain className="h-4 w-4 mr-2 text-yellow-400" />
                      <span className="text-yellow-300">Detection Hints:</span>
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {video.hints.map((hint, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          • {hint}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Guess Buttons */}
            {!showResult && (
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onGuess(false)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5 mr-1" />
                  <span>Real Content</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onGuess(true)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <XCircle className="h-5 w-5 mr-1" />
                  <span>Deepfake</span>
                </motion.button>
              </div>
            )}

            {/* Result Display */}
            {showResult && userGuess !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-xl backdrop-blur-md shadow-lg ${
                  (userGuess === video.isDeepfake) 
                    ? 'bg-green-500/90 border border-green-400/30' 
                    : 'bg-red-500/90 border border-red-400/30'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {(userGuess === video.isDeepfake) ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : (
                    <XCircle className="h-5 w-5 text-white" />
                  )}
                  <span className="text-white font-medium">
                    {(userGuess === video.isDeepfake) ? 'Correct Analysis!' : 'Incorrect Analysis'}
                  </span>
                </div>
                <p className="text-white text-sm mb-3 leading-relaxed">{video.explanation}</p>
                <div className="flex items-center space-x-2 text-xs text-white/90 bg-black/20 p-2 rounded-lg">
                  <Shield className="h-3 w-3 flex-shrink-0" />
                  <span><strong>Ground Truth:</strong> {video.isDeepfake ? 'AI Generated (Deepfake)' : 'Authentic Content'}</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold mb-2">{video.title}</h3>
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Duration: {video.duration}</span>
          <span className={getDifficultyColor(video.difficulty).split(' ')[0]}>
            {video.difficulty} level
          </span>
        </div>
      </div>
    </motion.div>
  );
};

interface VideoQueueItemProps {
  video: VideoData;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  userGuess: boolean | null;
  onClick: () => void;
}

const VideoQueueItem: React.FC<VideoQueueItemProps> = ({ 
  video, 
  index, 
  isActive, 
  isCompleted, 
  userGuess, 
  onClick 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, x: 5 }}
      onClick={onClick}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
        isActive 
          ? 'bg-cyan-500/20 border border-cyan-500/30' 
          : isCompleted
            ? 'bg-slate-700/30 hover:bg-slate-700/50'
            : 'bg-slate-700/30 hover:bg-slate-700/50'
      }`}
    >
      <div className="relative">
        <div className="text-2xl">{video.thumbnail}</div>
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1"
          >
            {userGuess === video.isDeepfake ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <XCircle className="h-4 w-4 text-red-400" />
            )}
          </motion.div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{video.title}</p>
        <div className="flex items-center space-x-2 text-xs">
          <span className={getDifficultyColor(video.difficulty)}>
            {video.difficulty}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-400">{video.duration}</span>
        </div>
      </div>
      
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
        />
      )}
    </motion.div>
  );
};

export const DeepfakeChallenge: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [userGuesses, setUserGuesses] = useState<(boolean | null)[]>(new Array(mockVideos.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [introCompleted, setIntroCompleted] = useState(false);

  const currentVideo = mockVideos[currentVideoIndex];

  const handleGuess = (isDeepfake: boolean) => {
    const newGuesses = [...userGuesses];
    newGuesses[currentVideoIndex] = isDeepfake;
    setUserGuesses(newGuesses);
    setShowResult(true);

    if (isDeepfake === currentVideo.isDeepfake) {
      setScore(prev => prev + 1);
    }

    // Auto-advance after 4 seconds
    setTimeout(() => {
      if (currentVideoIndex < mockVideos.length - 1) {
        setCurrentVideoIndex(prev => prev + 1);
        setShowResult(false);
      } else {
        setGameCompleted(true);
      }
    }, 4000);
  };

  const selectVideo = (index: number) => {
    if (!showResult) {
      setCurrentVideoIndex(index);
    }
  };

  const resetGame = () => {
    setCurrentVideoIndex(0);
    setUserGuesses(new Array(mockVideos.length).fill(null));
    setShowResult(false);
    setScore(0);
    setGameCompleted(false);
  };

  const getScoreColor = () => {
    const percentage = (score / mockVideos.length) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!introCompleted) {
    return (
      <section id="challenge" className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4 font-sora">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Deepfake Detection Challenge
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 font-inter">
              Test your skills with real video samples! Can you distinguish authentic content from AI-generated deepfakes?
            </p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-slate-800/50 backdrop-blur-md rounded-xl p-8 border border-slate-700/50 max-w-3xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-red-500/20 to-red-500/10 rounded-full flex items-center justify-center mb-4 p-6">
                    <AlertTriangle className="h-12 w-12 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">The Challenge</h3>
                  <p className="text-center text-slate-300">
                    Can you tell what's real and what's AI-generated? Synthetic media is becoming increasingly difficult to detect with the naked eye.
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 rounded-full flex items-center justify-center mb-4 p-6">
                    <Camera className="h-12 w-12 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Your Mission</h3>
                  <p className="text-center text-slate-300">
                    Analyze 6 videos and determine which ones are authentic and which are deepfakes. Learn the telltale signs of manipulation.
                  </p>
                </div>
              </div>
              
              {/* Challenge Tips */}
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <div className="flex items-center space-x-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-yellow-400" />
                  <h3 className="text-sm font-semibold text-white">Detection Tips:</h3>
                </div>
                <ul className="text-xs text-slate-400 space-y-2">
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full mt-1.5"></div>
                    <span>Watch for unnatural blinking patterns</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full mt-1.5"></div>
                    <span>Check if lighting on face matches the environment</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-cyan-400 rounded-full mt-1.5"></div>
                    <span>Look for artifacts around hair and facial boundaries</span>
                  </li>
                </ul>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIntroCompleted(true)}
                className="mx-auto block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                Start the Challenge
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }
  return (
    <section id="challenge" className="py-20 bg-slate-800/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4 font-sora">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Deepfake Detection Challenge
            </span>
          </h2>
          <p className="text-xl text-slate-300 mb-8 font-inter">
            Test your skills with real video samples! Can you distinguish authentic content from AI-generated deepfakes?
          </p>
        </motion.div>

        {!gameCompleted ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Video Player */}
            <div className="xl:col-span-2">
              <VideoPlayer
                video={currentVideo}
                onGuess={handleGuess}
                showResult={showResult}
                userGuess={userGuesses[currentVideoIndex]}
                isActive={true}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white font-sora">Challenge Progress</h3>
                  <span className="text-cyan-400 font-medium">
                    {currentVideoIndex + 1} / {mockVideos.length}
                  </span>
                </div>
                
                <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
                  <motion.div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((currentVideoIndex + 1) / mockVideos.length) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400 font-sora">{score}</div>
                    <div className="text-slate-400 text-sm font-inter">Correct</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-300 font-sora">
                      {currentVideoIndex + (showResult ? 1 : 0) - score}
                    </div>
                    <div className="text-slate-400 text-sm font-inter">Incorrect</div>
                  </div>
                </div>
              </motion.div>

              {/* Video Queue */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50"
              >
                <h3 className="text-lg font-semibold text-white mb-4 font-sora flex items-center">
                  <Target className="h-5 w-5 mr-2 text-cyan-400" />
                  Video Queue
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {mockVideos.map((video, index) => (
                    <VideoQueueItem
                      key={video.id}
                      video={video}
                      index={index}
                      isActive={index === currentVideoIndex}
                      isCompleted={index < currentVideoIndex || (index === currentVideoIndex && showResult)}
                      userGuess={userGuesses[index]}
                      onClick={() => selectVideo(index)}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50"
              >
                <h3 className="text-lg font-semibold text-white mb-4 font-sora flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  How to Play
                </h3>
                <ul className="space-y-2 text-slate-300 text-sm font-inter">
                  <li>• Watch each video carefully</li>
                  <li>• Use detection hints if needed</li>
                  <li>• Analyze visual and audio cues</li>
                  <li>• Make your best judgment</li>
                  <li>• Learn from explanations</li>
                </ul>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Game Completed */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="mb-6"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-500/30 to-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="h-14 w-14 text-yellow-400" />
                </div>
              </motion.div>
              
              <h3 className="text-4xl font-bold text-white mb-4 font-sora">
                Challenge Complete!
              </h3>
              
              <div className="text-7xl font-bold mb-6 font-sora">
                <span className={getScoreColor()}>
                  {score}/{mockVideos.length}
                </span>
              </div>
              
              <p className="text-xl text-slate-300 mb-8 font-inter">
                {score === mockVideos.length 
                    ? "Perfect! You've mastered the art of deepfake detection!" 
                  : score >= mockVideos.length * 0.8 
                      ? "Excellent! Your detection skills are impressive!" 
                    : score >= mockVideos.length * 0.6 
                        ? "Good job! With more practice, you'll become an expert!" 
                        : "Deepfake detection is challenging! Keep learning the subtle cues."}
              </p>

              <div className="max-w-xl mx-auto mb-8 p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-500/20">
                <h4 className="text-xl font-semibold text-cyan-300 mb-2">What You've Learned:</h4>
                <ul className="text-left text-slate-300 space-y-2">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>How to identify inconsistencies in facial movements and expressions</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>The importance of checking audio-visual synchronization</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>How to spot artifacts in lighting, reflections, and boundaries</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-xl hover:shadow-cyan-500/25 transition-all inline-flex items-center space-x-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Try Again</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/earlyaccess'}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-xl hover:shadow-purple-500/25 transition-all inline-flex items-center space-x-2"
                >
                  <Rocket className="h-5 w-5" />
                  <span>Join Beta Waitlist</span>
                </motion.button>

                {/* Post-Challenge Waitlist CTA */}
              {/* Post-Challenge Beta Waitlist */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-xl border border-blue-500/30">
                <h4 className="text-2xl font-bold text-white mb-4">Ready to Protect Your Organization?</h4>
                <p className="text-slate-300 mb-6 text-lg">
                  Experience enterprise-grade deepfake detection that's 100x more accurate than what you just tested. 
                  Join our beta program and be among the first to access ModGuard AI's full platform.
                </p>
                
                <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-cyan-400 mb-1">99.7%</div>
                      <div className="text-slate-400 text-sm">Enterprise Accuracy</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400 mb-1">&lt;127ms</div>
                      <div className="text-slate-400 text-sm">Response Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400 mb-1">24/7</div>
                      <div className="text-slate-400 text-sm">Live Protection</div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/earlyaccess'}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                >
                  Join Beta Program - Priority Access
                </motion.button>
                <p className="text-slate-400 text-sm mt-3">
                  Join 12,000+ professionals already on the waitlist
                </p>
              </div>
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-xl border border-blue-500/30">
                  <h4 className="text-xl font-bold text-white mb-3">Impressed by the challenge?</h4>
                  <p className="text-slate-300 mb-4">
                    Get early access to our enterprise-grade detection tools and be part of the digital truth revolution.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/earlyaccess'}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    Get Early Access Now
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Floating Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 font-sora">Protect Your Organization</h3>
              <p className="text-slate-300">
                ModGuard AI's deepfake detection technology operates with 99.2% accuracy and can be integrated into your content workflow.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg shadow-cyan-500/25 transition-all flex-shrink-0 flex items-center space-x-2"
            >
              <Shield className="h-5 w-5" />
              <span>Enterprise Solutions</span>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};