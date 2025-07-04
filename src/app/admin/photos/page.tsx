'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import EditPhotoModal from '@/components/admin/EditPhotoModal';
import SortablePhotoGrid from '@/components/admin/SortablePhotoGrid';

interface Photo {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  public_url: string;
  thumbnail_url: string;
  is_featured: boolean;
  display_order: number;
  metadata?: Record<string, any>;
  category?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function PhotosManagementPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [hasReordered, setHasReordered] = useState(false);
  
  // Load photos and categories
  useEffect(() => {
    fetchPhotos();
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };
  
  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/photos?limit=100');
      const data = await response.json();
      setPhotos(data.photos || []);
    } catch (error) {
      toast.error('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/photos/${photoId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete');
      }
      
      toast.success('Photo deleted successfully');
      fetchPhotos();
    } catch (error) {
      toast.error('Failed to delete photo');
    }
  };
  
  const handleBulkDelete = async () => {
    if (selectedPhotos.size === 0) return;
    
    if (!confirm(`Delete ${selectedPhotos.size} selected photos?`)) {
      return;
    }
    
    let successCount = 0;
    for (const photoId of selectedPhotos) {
      try {
        const response = await fetch(`/api/admin/photos/${photoId}`, {
          method: 'DELETE'
        });
        if (response.ok) successCount++;
      } catch (error) {
        console.error(`Failed to delete photo ${photoId}`);
      }
    }
    
    toast.success(`Deleted ${successCount} photos`);
    setSelectedPhotos(new Set());
    setBulkMode(false);
    fetchPhotos();
  };
  
  const togglePhotoSelection = (photoId: string) => {
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(photoId)) {
      newSelection.delete(photoId);
    } else {
      newSelection.add(photoId);
    }
    setSelectedPhotos(newSelection);
  };
  
  const handlePhotosReorder = (reorderedPhotos: Photo[]) => {
    // Update display_order for each photo
    const updatedPhotos = reorderedPhotos.map((photo, index) => ({
      ...photo,
      display_order: index
    }));
    setPhotos(updatedPhotos);
    setHasReordered(true);
  };
  
  const saveReorder = async () => {
    try {
      const photoIds = photos.map(p => p.id);
      const response = await fetch('/api/admin/photos/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoIds })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save order');
      }
      
      toast.success('Photo order saved successfully');
      setHasReordered(false);
    } catch (error) {
      toast.error('Failed to save photo order');
    }
  };
  
  const toggleFeatured = async (photo: Photo) => {
    try {
      const response = await fetch(`/api/admin/photos/${photo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: !photo.is_featured })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update');
      }
      
      toast.success(`Photo ${photo.is_featured ? 'unfeatured' : 'featured'}`);
      fetchPhotos();
    } catch (error) {
      toast.error('Failed to update photo');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-mono">
          Manage Photos ({photos.length})
        </h1>
        <div className="flex items-center space-x-4">
          {hasReordered && (
            <button
              onClick={saveReorder}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
            >
              Save Order
            </button>
          )}
          {bulkMode && selectedPhotos.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Delete Selected ({selectedPhotos.size})
            </button>
          )}
          <button
            onClick={() => {
              console.log('Reorder button clicked, current state:', reorderMode);
              setReorderMode(!reorderMode);
              setBulkMode(false);
              setSelectedPhotos(new Set());
              console.log('New reorder state will be:', !reorderMode);
            }}
            className={`px-4 py-2 border rounded transition-colors ${
              reorderMode 
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                : 'border-green-800 hover:border-green-600'
            }`}
          >
            {reorderMode ? 'Done Reordering' : 'Reorder Photos'}
          </button>
          <button
            onClick={() => {
              setBulkMode(!bulkMode);
              setReorderMode(false);
              setSelectedPhotos(new Set());
            }}
            className={`px-4 py-2 border rounded transition-colors ${
              bulkMode 
                ? 'bg-yellow-600 text-white border-yellow-600 hover:bg-yellow-700' 
                : 'border-green-800 hover:border-green-600'
            }`}
          >
            {bulkMode ? 'Cancel Bulk' : 'Bulk Select'}
          </button>
          <Link
            href="/admin/photos/upload"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            Upload Photos
          </Link>
        </div>
      </div>
            
      {/* Photo Grid */}
      {console.log('Rendering photo grid, reorderMode:', reorderMode)}
      {reorderMode ? (
        <>
          {console.log('Rendering SortablePhotoGrid')}
          <div className="bg-blue-900/20 border border-blue-600 rounded p-3 text-sm">
            <span className="text-blue-400">📋 Reorder Mode:</span> Drag photos using the ≡ handle in the top-left corner of each photo. Click "Save Order" when done.
          </div>
          <SortablePhotoGrid
            photos={photos}
            selectedPhotos={selectedPhotos}
            onPhotosReorder={handlePhotosReorder}
            onToggleSelect={togglePhotoSelection}
            onToggleFeatured={toggleFeatured}
            onEdit={(photo) => {
              setSelectedPhoto(photo);
              setEditMode(true);
            }}
            onDelete={handleDelete}
          />
        </>
      ) : (
        <>
          {console.log('Rendering normal photo grid')}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {photos.map(photo => (
          <div
            key={photo.id}
            className={`bg-gray-900 border rounded-lg overflow-hidden group ${
              selectedPhotos.has(photo.id) 
                ? 'border-yellow-600' 
                : 'border-green-800'
            }`}
          >
            {/* Bulk Selection Checkbox */}
            {bulkMode && (
              <div className="absolute top-2 right-2 z-10">
                <input
                  type="checkbox"
                  checked={selectedPhotos.has(photo.id)}
                  onChange={() => togglePhotoSelection(photo.id)}
                  className="w-4 h-4 cursor-pointer"
                />
              </div>
            )}
            
            {/* Image */}
            <div className="aspect-video relative">
              <Image
                src={photo.thumbnail_url || photo.public_url}
                alt={photo.title}
                fill
                className="object-cover"
              />
              
              {/* Featured Badge */}
              {photo.is_featured && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                  FEATURED
                </div>
              )}
              
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button
                  onClick={() => toggleFeatured(photo)}
                  className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm"
                >
                  {photo.is_featured ? 'Unfeature' : 'Feature'}
                </button>
                <button
                  onClick={() => {
                    setSelectedPhoto(photo);
                    setEditMode(true);
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
            
            {/* Info */}
            <div className="p-3">
              <h3 className="font-semibold truncate">{photo.title}</h3>
              {photo.category && (
                <p className="text-xs text-gray-400">{photo.category.name}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Order: {photo.display_order}
              </p>
            </div>
          </div>
        ))}
        </div>
        </>
      )}
      
      {/* Empty State */}
      {photos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No photos uploaded yet</p>
          <Link
            href="/admin/photos/upload"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors inline-block"
          >
            Upload Your First Photo
          </Link>
        </div>
      )}
      
      {/* Edit Modal */}
      <EditPhotoModal
        photo={selectedPhoto}
        categories={categories}
        isOpen={editMode}
        onClose={() => {
          setEditMode(false);
          setSelectedPhoto(null);
        }}
        onUpdate={fetchPhotos}
      />
    </div>
  );
}
