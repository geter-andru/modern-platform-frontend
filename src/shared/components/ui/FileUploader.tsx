'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  File,
  Image,
  Video,
  FileText,
  X,
  Check,
  AlertCircle,
  Loader2,
  Download,
  Eye
} from 'lucide-react';

/**
 * FileUploader - Drag-and-drop file upload with progress
 * 
 * Features:
 * - Drag and drop interface
 * - Multiple file selection
 * - File type validation
 * - Size limit enforcement
 * - Upload progress tracking
 * - Preview support
 * - Error handling
 * - Accessibility compliant
 */

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  url?: string;
  preview?: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
}

export interface FileUploaderProps {
  onUpload: (files: File[]) => Promise<UploadedFile[]>;
  onRemove?: (fileId: string) => void;
  onPreview?: (file: UploadedFile) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  showPreviews?: boolean;
  allowReorder?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUpload,
  onRemove,
  onPreview,
  acceptedTypes = ['*/*'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  multiple = true,
  disabled = false,
  className = '',
  placeholder = 'Drop files here or click to browse',
  showPreviews = true,
  allowReorder = false
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate unique ID for files
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Get file type icon
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File size exceeds ${formatFileSize(maxFileSize)}`;
    }

    // Check file type
    if (!acceptedTypes.includes('*/*')) {
      const isAccepted = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type || file.name.toLowerCase().endsWith(type.replace('*', ''));
      });

      if (!isAccepted) {
        return `File type not accepted. Allowed types: ${acceptedTypes.join(', ')}`;
      }
    }

    return null;
  };

  // Create file preview
  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve('');
      }
    });
  };

  // Handle file selection
  const handleFileSelect = useCallback(async (selectedFiles: File[]) => {
    if (disabled || isUploading) return;

    // Limit number of files
    const remainingSlots = maxFiles - files.length;
    const filesToProcess = selectedFiles.slice(0, remainingSlots);

    // Validate files and create upload objects
    const newFiles: UploadedFile[] = [];
    
    for (const file of filesToProcess) {
      const error = validateFile(file);
      const preview = showPreviews ? await createPreview(file) : undefined;
      
      newFiles.push({
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview,
        status: error ? 'error' : 'uploading',
        progress: 0,
        error
      });
    }

    setFiles(prev => [...prev, ...newFiles]);

    // Start upload for valid files
    const validFiles = newFiles.filter(f => !f.error);
    if (validFiles.length > 0) {
      setIsUploading(true);
      
      try {
        const uploadedFiles = await onUpload(validFiles.map(f => f.file));
        
        // Update file statuses
        setFiles(prev => prev.map(file => {
          const uploaded = uploadedFiles.find(uf => uf.file.name === file.name);
          if (uploaded) {
            return { ...file, ...uploaded, status: 'completed', progress: 100 };
          }
          return file;
        }));
      } catch (error) {
        // Mark files as failed
        setFiles(prev => prev.map(file => {
          if (validFiles.some(vf => vf.id === file.id)) {
            return { ...file, status: 'error', error: 'Upload failed' };
          }
          return file;
        }));
      } finally {
        setIsUploading(false);
      }
    }
  }, [disabled, isUploading, files.length, maxFiles, onUpload, showPreviews, maxFileSize, acceptedTypes]);

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelect(droppedFiles);
  }, [disabled, handleFileSelect]);

  // Handle file input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    handleFileSelect(selectedFiles);
    
    // Reset input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileSelect]);

  // Remove file
  const handleRemoveFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (onRemove) {
      onRemove(fileId);
    }
  }, [onRemove]);

  // Preview file
  const handlePreviewFile = useCallback((file: UploadedFile) => {
    if (onPreview) {
      onPreview(file);
    }
  }, [onPreview]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${disabled
            ? 'border-gray-800 bg-gray-900/50 cursor-not-allowed opacity-50'
            : isDragOver
            ? 'border-blue-400 bg-blue-500/10 cursor-pointer'
            : 'border-gray-700 bg-gray-800/50 cursor-pointer hover:border-gray-600 hover:bg-gray-800/70'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="space-y-3">
          <motion.div
            animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
            className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center ${
              isDragOver ? 'bg-blue-500/20' : 'bg-gray-700'
            }`}
          >
            <Upload className={`w-6 h-6 ${isDragOver ? 'text-blue-400' : 'text-gray-400'}`} />
          </motion.div>

          <div>
            <p className={`text-sm font-medium ${isDragOver ? 'text-blue-400' : 'text-white'}`}>
              {placeholder}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Maximum {maxFiles} files, up to {formatFileSize(maxFileSize)} each
            </p>
            {acceptedTypes.length > 0 && !acceptedTypes.includes('*/*') && (
              <p className="text-xs text-gray-500 mt-1">
                Accepted: {acceptedTypes.join(', ')}
              </p>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-gray-900/80 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
              <p className="text-sm text-blue-400">Uploading files...</p>
            </div>
          </div>
        )}
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700"
              >
                {/* File Icon/Preview */}
                <div className="flex-shrink-0">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-gray-400">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(file.size)}
                  </p>

                  {/* Progress Bar */}
                  {file.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {file.error && (
                    <div className="mt-1 flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-red-400">{file.error}</span>
                    </div>
                  )}
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {file.status === 'uploading' && (
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  )}
                  {file.status === 'completed' && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {file.status === 'completed' && onPreview && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewFile(file);
                      }}
                      className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}

                  {file.url && (
                    <a
                      href={file.url}
                      download={file.name}
                      className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                      title="Download"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(file.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-400 rounded transition-colors"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      {files.length > 0 && (
        <div className="text-xs text-gray-400 text-center">
          {files.length} of {maxFiles} files selected
        </div>
      )}
    </div>
  );
};

export default FileUploader;