import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, Image, Video, CheckCircle, AlertTriangle, Loader } from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  preview?: string;
  error?: string;
}

interface DragDropUploadProps {
  onFilesUploaded: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  maxFiles?: number;
  className?: string;
  multiple?: boolean;
  showPreviews?: boolean;
}

export const DragDropUpload: React.FC<DragDropUploadProps> = ({
  onFilesUploaded,
  acceptedTypes = ['image/*', 'video/*', 'application/pdf'],
  maxFileSize = 10,
  maxFiles = 5,
  className = '',
  multiple = true,
  showPreviews = true
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const createPreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const simulateUpload = (fileId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f
        ));

        if (progress >= 100) {
          clearInterval(interval);
          
          // Simulate random success/failure
          if (Math.random() > 0.2) {
            setUploadedFiles(prev => prev.map(f => 
              f.id === fileId ? { ...f, status: 'completed', progress: 100 } : f
            ));
            resolve();
          } else {
            setUploadedFiles(prev => prev.map(f => 
              f.id === fileId ? { ...f, status: 'error', error: 'Upload failed' } : f
            ));
            reject(new Error('Upload failed'));
          }
        }
      }, 200);
    });
  };

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // Check max files limit
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles: File[] = [];
    const newUploadedFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        alert(`${file.name}: ${error}`);
        continue;
      }

      const id = Math.random().toString(36).substr(2, 9);
      const preview = await createPreview(file);
      
      validFiles.push(file);
      newUploadedFiles.push({
        id,
        file,
        status: 'uploading',
        progress: 0,
        preview
      });
    }

    if (validFiles.length === 0) return;

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
    onFilesUploaded(validFiles);

    // Simulate upload for each file
    for (const uploadedFile of newUploadedFiles) {
      simulateUpload(uploadedFile.id).catch(() => {
        // Error handling is done in simulateUpload
      });
    }
  }, [uploadedFiles, maxFiles, onFilesUploaded, maxFileSize, acceptedTypes]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    }
  }, [processFiles]);

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const retryUpload = (id: string) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === id ? { ...f, status: 'uploading', progress: 0, error: undefined } : f
    ));
    simulateUpload(id).catch(() => {
      // Error handling is done in simulateUpload
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    return FileText;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Drop Zone */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />

        <motion.div
          animate={{ 
            scale: isDragActive ? 1.1 : 1,
            y: isDragActive ? -5 : 0
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="p-3 bg-blue-100 rounded-full inline-flex mb-4">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </h3>
          
          <p className="text-sm text-gray-500 mb-2">
            or <span className="text-blue-600 font-medium">browse</span> to upload
          </p>
          
          <p className="text-xs text-gray-400">
            Accepted formats: {acceptedTypes.join(', ')} (Max: {maxFileSize}MB)
          </p>
        </motion.div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                Uploaded Files ({uploadedFiles.length}/{maxFiles})
              </h3>
              {uploadedFiles.length > 0 && (
                <button
                  onClick={() => setUploadedFiles([])}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-3">
              {uploadedFiles.map((uploadedFile) => {
                const FileIcon = getFileIcon(uploadedFile.file);
                
                return (
                  <motion.div
                    key={uploadedFile.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-lg border border-gray-200 p-3 flex items-center space-x-3"
                  >
                    {/* Preview or Icon */}
                    {showPreviews && uploadedFile.preview ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={uploadedFile.preview}
                          alt={uploadedFile.file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                    
                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {uploadedFile.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(uploadedFile.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <motion.div
                          className={`h-1.5 rounded-full ${
                            uploadedFile.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${uploadedFile.progress}%` }}
                          initial={{ width: '0%' }}
                          animate={{ width: `${uploadedFile.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      
                      {/* Status */}
                      <div className="flex items-center mt-1">
                        {uploadedFile.status === 'uploading' && (
                          <div className="flex items-center text-blue-600 text-xs">
                            <Loader className="h-3 w-3 animate-spin mr-1" />
                            <span>Uploading... {Math.round(uploadedFile.progress)}%</span>
                          </div>
                        )}
                        
                        {uploadedFile.status === 'completed' && (
                          <div className="flex items-center text-green-600 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            <span>Upload complete</span>
                          </div>
                        )}
                        
                        {uploadedFile.status === 'error' && (
                          <div className="flex items-center text-red-600 text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            <span>{uploadedFile.error || 'Upload failed'}</span>
                            <button
                              onClick={() => retryUpload(uploadedFile.id)}
                              className="ml-2 underline"
                            >
                              Retry
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(uploadedFile.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
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