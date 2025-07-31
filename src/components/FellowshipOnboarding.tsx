import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Upload,
  Brain,
  Target,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Lightbulb,
  Globe,
  Code,
  Palette,
  Users,
  Award,
  Sparkles,
  Heart,
  Zap,
  Mic,
  Play,
  Pause,
  Download,
  Send,
  Star
} from 'lucide-react';

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

interface FormData {
  resume?: File;
  name: string;
  email: string;
  university: string;
  skills: string[];
  scenarioText: string;
  audioResponse?: Blob;
  selectedTracks: string[];
  missionRole?: {
    title: string;
    description: string;
    code: string;
    badge: string;
  };
}

export const FellowshipOnboarding: React.FC<OnboardingProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    university: '',
    skills: [],
    scenarioText: '',
    selectedTracks: []
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = 5;

  const missionTracks = [
    {
      id: 'ai-ethics',
      title: 'AI Ethics & Alignment',
      description: 'Shape the moral compass of AI systems',
      icon: Shield,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'ux-design',
      title: 'UX for Good / Product Design',
      description: 'Design interfaces that protect and empower',
      icon: Palette,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity & Threat Modeling',
      description: 'Build digital fortresses against deception',
      icon: Shield,
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'storytelling',
      title: 'Storytelling & Narrative Defense',
      description: 'Combat misinformation with compelling truth',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'cultural-insight',
      title: 'Culture & Regional Insight',
      description: 'Bridge global understanding and context',
      icon: Globe,
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'data-science',
      title: 'Data Science & NLP',
      description: 'Decode patterns in the noise of information',
      icon: Brain,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'engineering',
      title: 'Engineering & DevOps',
      description: 'Build the infrastructure of truth',
      icon: Code,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'prompt-engineering',
      title: 'AI Prompt Engineering',
      description: 'Craft the language that guides AI behavior',
      icon: Zap,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'osint',
      title: 'Open Source Intelligence (OSINT)',
      description: 'Uncover truth through digital investigation',
      icon: Target,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'policy-governance',
      title: 'Policy & Trust Governance',
      description: 'Shape the rules that govern digital truth',
      icon: Users,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'social-impact',
      title: 'GenAI & Social Impact Startups',
      description: 'Launch ventures that change the world',
      icon: Sparkles,
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 'creative-ai',
      title: 'Creative AI & Memetics',
      description: 'Harness creativity to spread truth',
      icon: Heart,
      color: 'from-red-500 to-pink-500'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, resume: file }));
      setIsProcessing(true);
      
      // Simulate AI processing
      setTimeout(() => {
        const mockSkills = [
          'Python', 'Machine Learning', 'React', 'Data Analysis', 
          'Social Impact', 'Research', 'Communication', 'Problem Solving',
          'Leadership', 'Creative Thinking'
        ];
        setFormData(prev => ({ 
          ...prev, 
          skills: mockSkills.slice(0, 6 + Math.floor(Math.random() * 4))
        }));
        setIsProcessing(false);
      }, 3000);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setFormData(prev => ({ ...prev, audioResponse: blob }));
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleTrack = (trackId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTracks: prev.selectedTracks.includes(trackId)
        ? prev.selectedTracks.filter(t => t !== trackId)
        : prev.selectedTracks.length < 3
          ? [...prev.selectedTracks, trackId]
          : prev.selectedTracks
    }));
  };

  const generateMissionRole = () => {
    const roles = [
      {
        title: 'Cultural Signal Mapper',
        description: 'You\'ll help our systems understand how global memes shape real-world impact.',
        code: 'CSM-2025-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        badge: '🌍'
      },
      {
        title: 'Truth Architecture Engineer',
        description: 'Build the technical foundations that make authentic content verification possible.',
        code: 'TAE-2025-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        badge: '🏗️'
      },
      {
        title: 'Narrative Defense Specialist',
        description: 'Craft compelling stories that make truth more powerful than deception.',
        code: 'NDS-2025-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        badge: '🛡️'
      },
      {
        title: 'AI Ethics Guardian',
        description: 'Ensure our AI systems make decisions that align with human values and dignity.',
        code: 'AEG-2025-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        badge: '⚖️'
      },
      {
        title: 'Digital Reality Researcher',
        description: 'Investigate emerging threats and develop new methods to detect synthetic media.',
        code: 'DRR-2025-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        badge: '🔬'
      }
    ];
    
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    setFormData(prev => ({ ...prev, missionRole: randomRole }));
  };

  const nextStep = () => {
    if (currentStep === 4) {
      generateMissionRole();
    }
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete(formData);
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-8 flex items-center justify-center">
              <Upload className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sora">
              Share Your Journey
            </h2>
            <p className="text-xl text-gray-600 mb-8 font-inter">
              Upload your resume or connect your LinkedIn to help us understand your unique potential
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@university.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">University/School</label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your educational institution"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Upload Resume (PDF)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-50"
                >
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    {formData.resume ? formData.resume.name : 'Click to upload your resume'}
                  </p>
                  <p className="text-gray-500 text-sm">PDF files accepted</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {isProcessing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-blue-800">AI is analyzing your resume...</span>
                  </div>
                  <div className="mt-2 text-sm text-blue-600">
                    Extracting skills, experience, and potential...
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-8 flex items-center justify-center">
                <Brain className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sora">
                Your Skill Profile
              </h2>
              <p className="text-xl text-gray-600 mb-8 font-inter">
                We've identified your strengths. Confirm or edit your skills below.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Skill Profile Strength</h3>
                <span className="text-2xl font-bold text-blue-600">{Math.min(formData.skills.length * 12, 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(formData.skills.length * 12, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    'Python', 'JavaScript', 'React', 'Machine Learning', 'Data Analysis',
                    'UI/UX Design', 'Research', 'Communication', 'Leadership', 'Problem Solving',
                    'Creative Thinking', 'Social Impact', 'Project Management', 'Writing',
                    'Public Speaking', 'Team Collaboration', 'Critical Thinking', 'Innovation'
                  ].map((skill) => (
                    <motion.button
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.skills.includes(skill)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {skill}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-900">How Skills Align with ModGuard's Mission</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      Your technical skills help build detection systems, while your communication abilities 
                      help bridge the gap between AI and human understanding. Every skill contributes to 
                      protecting digital truth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mx-auto mb-8 flex items-center justify-center">
                <Lightbulb className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sora">
                Your Vision for Truth
              </h2>
              <p className="text-xl text-gray-600 mb-8 font-inter">
                Share your ideas and passion for protecting digital authenticity
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Challenge</h3>
                <p className="text-gray-700 mb-4">
                  "If you could design one tool to protect truth on the internet, what would it be?"
                </p>
                
                <textarea
                  rows={6}
                  value={formData.scenarioText}
                  onChange={(e) => setFormData(prev => ({ ...prev, scenarioText: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your vision for protecting truth online..."
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Response (Optional)</h3>
                <p className="text-gray-700 mb-4">
                  Record a 60-second audio response to add a personal touch to your application
                </p>
                
                <div className="flex items-center space-x-4">
                  {!isRecording && !formData.audioResponse && (
                    <button
                      onClick={startRecording}
                      className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Mic className="h-5 w-5" />
                      <span>Start Recording</span>
                    </button>
                  )}
                  
                  {isRecording && (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={stopRecording}
                        className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <div className="w-3 h-3 bg-white rounded-sm"></div>
                        <span>Stop Recording</span>
                      </button>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-700">{recordingTime}s / 60s</span>
                      </div>
                    </div>
                  )}
                  
                  {formData.audioResponse && (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>Recording saved</span>
                      </div>
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, audioResponse: undefined }))}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Re-record
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-8 flex items-center justify-center">
                <Target className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sora">
                Choose Your Mission Tracks
              </h2>
              <p className="text-xl text-gray-600 mb-8 font-inter">
                Select up to 3 tracks that inspire you most. These will shape your fellowship experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {missionTracks.map((track) => (
                <motion.div
                  key={track.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => toggleTrack(track.id)}
                  className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
                    formData.selectedTracks.includes(track.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  } ${formData.selectedTracks.length >= 3 && !formData.selectedTracks.includes(track.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${track.color} mb-4`}>
                    <track.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{track.title}</h3>
                  <p className="text-gray-600 text-sm">{track.description}</p>
                  
                  {formData.selectedTracks.includes(track.id) && (
                    <div className="mt-4 flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      <span className="text-blue-600 text-sm font-medium">Selected</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Selected: {formData.selectedTracks.length} / 3 tracks
              </p>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-8 flex items-center justify-center">
              <Award className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-sora">
              Welcome to the Fellowship!
            </h2>

            {formData.missionRole && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
                <div className="text-6xl mb-4">{formData.missionRole.badge}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-sora">
                  Mission Role: {formData.missionRole.title}
                </h3>
                <p className="text-lg text-gray-700 mb-6 font-inter">
                  {formData.missionRole.description}
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-600 mb-2">Your Mission Code:</div>
                  <div className="text-xl font-mono font-bold text-blue-600">
                    {formData.missionRole.code}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="h-5 w-5" />
                    <span>Download Badge</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                    <Send className="h-5 w-5" />
                    <span>Join Slack</span>
                  </button>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h4>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Access to Fellowship Dashboard</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Weekly mission assignments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Mentorship opportunities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Community events and workshops</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all"
            >
              Enter Fellowship Dashboard
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-sora">ModGuard AI Fellowship</h1>
                <p className="text-gray-600 text-sm">Step {currentStep} of {totalSteps}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-6">
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>

            {currentStep < totalSteps && (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && (!formData.name || !formData.email)) ||
                  (currentStep === 2 && formData.skills.length === 0) ||
                  (currentStep === 3 && !formData.scenarioText) ||
                  (currentStep === 4 && formData.selectedTracks.length === 0)
                }
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};