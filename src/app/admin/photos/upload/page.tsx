'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { detectImageColorMode } from '@/lib/image-analysis';

interface UploadFile extends File {
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
  metadata?: {
    title: string;
    description: string;
    category_id: string;
    is_featured: boolean;
    is_black_white?: boolean;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function PhotoUploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  // Load categories on mount
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []));
  }, []);
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const loadingToast = toast.loading(`Analyzing ${acceptedFiles.length} photo(s)...`);
    
    const newFiles = await Promise.all(acceptedFiles.map(async (file) => {
      // Generate title from filename
      const titleFromFilename = file.name
        .split('.')[0]
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      // Detect if image is color or B&W
      const isColor = await detectImageColorMode(file);
      const isBlackWhite = !isColor;
      
      // Create proper File object with all properties
      const uploadFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
        uploadProgress: 0,
        uploadStatus: 'pending' as const,
        metadata: {
          title: titleFromFilename,
          description: '',
          category_id: '',
          is_featured: false,
          is_black_white: isBlackWhite
        }
      }) as UploadFile;
      
      // Log file info for debugging
      console.log('File info:', {
        name: file.name,
        size: file.size,
        type: file.type,
        sizeMB: (file.size / 1024 / 1024).toFixed(2),
        colorMode: isBlackWhite ? 'Black & White' : 'Color'
      });
        
      return uploadFile;
    }));
    
    toast.dismiss(loadingToast);
    const bwCount = newFiles.filter(f => f.metadata?.is_black_white).length;
    const colorCount = newFiles.length - bwCount;
    toast.success(`Detected ${colorCount} color and ${bwCount} B&W photos`);
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });
  
  const updateFileMetadata = (index: number, metadata: any) => {
    setFiles(prev => prev.map((f, i) => 
      i === index ? { ...f, metadata: { ...f.metadata, ...metadata } } : f
    ));
  };
  
  const uploadFile = async (file: UploadFile, index: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.metadata?.title || file.name);
    formData.append('description', file.metadata?.description || '');
    formData.append('category_id', file.metadata?.category_id || '');
    formData.append('is_featured', String(file.metadata?.is_featured || false));
    formData.append('is_black_white', String(file.metadata?.is_black_white === true));
    
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
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      // Update status to success
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, uploadStatus: 'success' as const, uploadProgress: 100 } : f
      ));
      
      toast.success(`${file.metadata?.title || file.name} uploaded successfully!`);
      
    } catch (error) {
      // Update status to error
      setFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          uploadStatus: 'error' as const, 
          errorMessage: error instanceof Error ? error.message : 'Upload failed' 
        } : f
      ));
      
      toast.error(`Failed to upload ${file.metadata?.title || file.name}`);
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
            Supports JPEG, PNG, WebP (max 50MB)
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
          
          <div className="space-y-4">
            {files.map((file, index) => (
              <div 
                key={index}
                className="bg-gray-900 border border-green-800 rounded-lg overflow-hidden"
              >
                <div className="flex">
                  {/* Preview */}
                  <div className="w-48 h-32 relative flex-shrink-0">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status Overlay */}
                    {file.uploadStatus === 'uploading' && (
                      <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
                      </div>
                    )}
                    
                    {file.uploadStatus === 'success' && (
                      <div className="absolute inset-0 bg-green-900/50 flex items-center justify-center">
                        <div className="text-3xl">✅</div>
                      </div>
                    )}
                    
                    {file.uploadStatus === 'error' && (
                      <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
                        <div className="text-3xl">❌</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Metadata Form */}
                  <div className="flex-1 p-4">
                    {editingIndex === index ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={file.metadata?.title || ''}
                            onChange={(e) => updateFileMetadata(index, { title: e.target.value })}
                            placeholder="Title"
                            className="px-2 py-1 bg-black border border-green-800 rounded text-sm"
                          />
                          <select
                            value={file.metadata?.category_id || ''}
                            onChange={(e) => updateFileMetadata(index, { category_id: e.target.value })}
                            className="px-2 py-1 bg-black border border-green-800 rounded text-sm"
                          >
                            <option value="">No Category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <textarea
                          value={file.metadata?.description || ''}
                          onChange={(e) => updateFileMetadata(index, { description: e.target.value })}
                          placeholder="Description (optional)"
                          className="w-full px-2 py-1 bg-black border border-green-800 rounded text-sm"
                          rows={2}
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center text-sm">
                              <input
                                type="checkbox"
                                checked={file.metadata?.is_featured || false}
                                onChange={(e) => updateFileMetadata(index, { is_featured: e.target.checked })}
                                className="mr-2"
                              />
                              Featured
                            </label>
                            <label className="flex items-center text-sm">
                              <input
                                type="checkbox"
                                checked={file.metadata?.is_black_white === true}
                                onChange={(e) => updateFileMetadata(index, { is_black_white: e.target.checked })}
                                className="mr-2"
                              />
                              Black &amp; White
                            </label>
                          </div>
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="text-sm text-green-400 hover:text-green-300"
                          >
                            Done Editing
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="space-y-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">{file.metadata?.title || file.name}</h3>
                            <p className="text-xs text-gray-400">
                              {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Size unknown'}
                              <span className="ml-2">• {file.metadata?.is_black_white ? 'B&W' : 'Color'}</span>
                              {file.metadata?.category_id && categories.find(c => c.id === file.metadata?.category_id) && (
                                <span className="ml-2">• {categories.find(c => c.id === file.metadata?.category_id)?.name}</span>
                              )}
                              {file.metadata?.is_featured && (
                                <span className="ml-2 text-yellow-400">• Featured</span>
                              )}
                            </p>
                            {file.metadata?.description && (
                              <p className="text-sm text-gray-300 mt-1">{file.metadata.description}</p>
                            )}
                            {file.errorMessage && (
                              <p className="text-sm text-red-400 mt-1">{file.errorMessage}</p>
                            )}
                          </div>
                          
                          {file.uploadStatus === 'pending' && (
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => setEditingIndex(index)}
                                className="text-sm text-blue-400 hover:text-blue-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeFile(index)}
                                className="text-sm text-red-400 hover:text-red-300"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
