'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import { toast } from 'sonner';

interface Photo {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  is_featured: boolean;
  display_order: number;
}

interface Category {
  id: string;
  name: string;
}

interface EditPhotoModalProps {
  photo: Photo | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditPhotoModal({
  photo,
  categories,
  isOpen,
  onClose,
  onUpdate
}: EditPhotoModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    is_featured: false,
    display_order: 0
  });
  const [saving, setSaving] = useState(false);
  
  // Update form when photo changes
  useEffect(() => {
    if (photo) {
      setFormData({
        title: photo.title,
        description: photo.description || '',
        category_id: photo.category_id || '',
        is_featured: photo.is_featured,
        display_order: photo.display_order
      });
    }
  }, [photo]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) return;
    
    setSaving(true);
    
    try {
      const response = await fetch(`/api/admin/photos/${photo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update photo');
      }
      
      toast.success('Photo updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to update photo');
    } finally {
      setSaving(false);
    }
  };
  
  if (!photo) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Photo">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-green-400 mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-black border border-green-800 rounded text-green-400 focus:outline-none focus:border-green-600"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-green-400 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-black border border-green-800 rounded text-green-400 focus:outline-none focus:border-green-600"
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-green-400 mb-1">
            Category
          </label>
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            className="w-full px-3 py-2 bg-black border border-green-800 rounded text-green-400 focus:outline-none focus:border-green-600"
          >
            <option value="">No Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-green-400 mb-1">
            Display Order
          </label>
          <input
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 bg-black border border-green-800 rounded text-green-400 focus:outline-none focus:border-green-600"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_featured"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="is_featured" className="text-sm text-green-400">
            Featured Photo
          </label>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-green-800 hover:border-green-600 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
