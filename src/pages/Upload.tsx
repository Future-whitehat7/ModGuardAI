import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload as UploadIcon,
  File,
  Image,
  Video,
  CheckCircle,
  AlertTriangle,
  X,
  Eye,
  Globe,
  Shield,
  Loader,
  Download
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'analyzing' | 'completed' | 'flagged';
  results?: {
    deepfakeScore: number;
    contentScore: number;
    culturalFlags: string[];
    violations: string[];
    confidence: number;
  };
}

export const Upload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'analyzing'
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate analysis
    newFiles.forEach(file => {
      setTimeout(() => {
        const isViolation = Math.random() > 0.7;
        const results = {
          deepfakeScore: Math.random() * 100,
          contentScore: Math.random() * 100,
          culturalFlags: isViolation ? ['Inappropriate Content', 'Regional Restriction'] : [],
          violations: isViolation ? ['Adult Content', 'Violence'] : [],
          confidence: 85 + Math.random() * 15
        };

        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: isViolation ? 'flagged' : 'completed', results }
            : f
        ));
      }, 2000 + Math.random() * 3000);
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Content Analysis</h1>
        <p className="mt-2 text-gray-600">
          Upload multimedia content for AI-powered moderation and deepfake detection
        </p>
      </div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center">
            <div className="p-4 bg-blue-100 rounded-full mb-4">
              <UploadIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload your content
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop files here, or click to select files
            </p>
            <div className="text-sm text-gray-500">
              Supports: Images (JPG, PNG, GIF) and Videos (MP4, MOV, AVI)
            </div>
          </div>
        </div>
      </motion.div>

      {/* Files List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Analysis Results ({files.length} files)
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.type);
                
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FileIcon className="h-6 w-6 text-gray-600" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{file.name}</h3>
                          <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                          
                          {/* Status */}
                          <div className="flex items-center space-x-2 mt-2">
                            {file.status === 'analyzing' && (
                              <>
                                <Loader className="h-4 w-4 text-blue-600 animate-spin" />
                                <span className="text-sm text-blue-600">Analyzing...</span>
                              </>
                            )}
                            {file.status === 'completed' && (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-600">Clean - No violations</span>
                              </>
                            )}
                            {file.status === 'flagged' && (
                              <>
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                <span className="text-sm text-red-600">Flagged - Violations detected</span>
                              </>
                            )}
                          </div>

                          {/* Results */}
                          {file.results && (
                            <div className="mt-4 space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <Shield className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium">Deepfake Score</span>
                                  </div>
                                  <p className="text-lg font-bold text-gray-900">
                                    {file.results.deepfakeScore.toFixed(1)}%
                                  </p>
                                </div>
                                
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <Eye className="h-4 w-4 text-purple-600" />
                                    <span className="text-sm font-medium">Content Score</span>
                                  </div>
                                  <p className="text-lg font-bold text-gray-900">
                                    {file.results.contentScore.toFixed(1)}%
                                  </p>
                                </div>
                                
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <Globe className="h-4 w-4 text-orange-600" />
                                    <span className="text-sm font-medium">Confidence</span>
                                  </div>
                                  <p className="text-lg font-bold text-gray-900">
                                    {file.results.confidence.toFixed(1)}%
                                  </p>
                                </div>
                              </div>

                              {/* Violations */}
                              {file.results.violations.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                  <h4 className="text-sm font-medium text-red-800 mb-2">
                                    Violations Detected:
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {file.results.violations.map((violation, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                      >
                                        {violation}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Cultural Flags */}
                              {file.results.culturalFlags.length > 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                  <h4 className="text-sm font-medium text-yellow-800 mb-2">
                                    Cultural Context Flags:
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {file.results.culturalFlags.map((flag, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                                      >
                                        {flag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {file.results && (
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Download className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};