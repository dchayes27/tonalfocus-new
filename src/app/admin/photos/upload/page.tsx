'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UploadFile extends File {
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

export default function PhotoUploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Load categories on mount
  useState(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []));
  });
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      uploadProgress: 0,
      uploadStatus: 'pending' as const
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });
  
  const uploadFile = async (file: UploadFile, index: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.split('.')[0]); // Use filename as title
    
    // Update status
    setFiles(prev => prev.map((f, i) => 
      i === index ? { ...f, uploadStatus: 'uploading' as const } : f
    ));
    
    try {
      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      // Update status to success
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, uploadStatus: 'success' as const, uploadProgress: 100 } : f
      ));
      
      toast.success(`${file.name} uploaded successfully!`);
      
    } catch (error) {
      // Update status to error
      setFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          uploadStatus: 'error' as const, 
          errorMessage: error instanceof Error ? error.message : 'Upload failed' 
        } : f
      ));
      
      toast.error(`Failed to upload ${file.name}`);
    }
  };
  
  const handleUploadAll = async () => {
    setUploading(true);
    
    // Upload files sequentially
    for (let i = 0; i < files.length; i++) {
      if (files[i].uploadStatus !== 'success') {
        await uploadFile(files[i], i);
      }
    }
    
    setUploading(false);
    
    // Check if all successful
    const allSuccess = files.every(f => f.uploadStatus === 'success');
    if (allSuccess && files.length > 0) {
      setTimeout(() => {
        router.push('/admin/photos');
      }, 1500);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-mono">Upload Photos</h1>
        <button
          onClick={() => router.push('/admin/photos')}
          className="px-4 py-2 border border-green-800 hover:border-green-600 rounded transition-colors"
        >
          Back to Photos
        </button>
      </div>
      
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-colors
          ${isDragActive 
            ? 'border-green-400 bg-green-900/20' 
            : 'border-green-800 hover:border-green-600'}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="text-5xl">📸</div>
          <p className="text-xl">
            {isDragActive 
              ? 'Drop the files here...' 
              : 'Drag & drop photos here, or click to select'}
          </p>
          <p className="text-sm text-gray-400">
            Supports JPEG, PNG, WebP (max 10MB)
          </p>
        </div>
      </div>
            
      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Files to Upload ({files.length})
            </h2>
            <button
              onClick={handleUploadAll}
              disabled={uploading || files.length === 0}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded transition-colors"
            >
              {uploading ? 'Uploading...' : 'Upload All'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div 
                key={index}
                className="relative bg-gray-900 border border-green-800 rounded-lg overflow-hidden"
              >
                {/* Preview */}
                <div className="aspect-video relative">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status Overlay */}
                  {file.uploadStatus === 'uploading' && (
                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-2"></div>
                        <p className="text-sm">Uploading...</p>
                      </div>
                    </div>
                  )}
                  
                  {file.uploadStatus === 'success' && (
                    <div className="absolute inset-0 bg-green-900/50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">✅</div>
                        <p className="text-sm">Uploaded!</p>
                      </div>
                    </div>
                  )}
                  
                  {file.uploadStatus === 'error' && (
                    <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
                      <div className="text-center px-4">
                        <div className="text-4xl mb-2">❌</div>
                        <p className="text-sm">{file.errorMessage || 'Upload failed'}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* File Info */}
                <div className="p-4">
                  <p className="text-sm font-mono truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {file.uploadStatus === 'pending' && (
                    <button
                      onClick={() => removeFile(index)}
                      className="mt-2 text-xs text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
