'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    display_order: 0
  });
  const [isCreating, setIsCreating] = useState(false);
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreate = async () => {
    if (!formData.name) {
      toast.error('Name is required');
      return;
    }
    
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create');
      }
      
      toast.success('Category created successfully');
      setFormData({ name: '', description: '', display_order: 0 });
      setIsCreating(false);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to create category');
    }
  };
  
  const handleUpdate = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update');
      }
      
      toast.success('Category updated successfully');
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to update category');
    }
  };
  
  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete');
      }
      
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete category');
    }
  };
  
  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || '',
      display_order: category.display_order
    });
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
          Manage Categories ({categories.length})
        </h1>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
        >
          Add Category
        </button>
      </div>
            
      {/* Create New Category Form */}
      {isCreating && (
        <div className="bg-gray-900 border border-green-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-green-800 rounded text-green-400 focus:outline-none focus:border-green-600"
                placeholder="e.g., Landscape"
              />
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-green-400 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-black border border-green-800 rounded text-green-400 focus:outline-none focus:border-green-600"
                rows={2}
                placeholder="Optional description"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => {
                setIsCreating(false);
                setFormData({ name: '', description: '', display_order: 0 });
              }}
              className="px-4 py-2 border border-green-800 hover:border-green-600 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
            >
              Create Category
            </button>
          </div>
        </div>
      )}
      
      {/* Categories List */}
      <div className="space-y-4">
        {categories.map(category => (
          <div
            key={category.id}
            className="bg-gray-900 border border-green-800 rounded-lg p-4"
          >
            {editingId === category.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-3 py-2 bg-black border border-green-800 rounded text-green-400 focus:outline-none focus:border-green-600"
                  />
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="px-3 py-2 bg-black border border-green-800 rounded text-green-400 focus:outline-none focus:border-green-600"
                    placeholder="Display Order"
                  />
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-green-800 rounded text-green-400 focus:outline-none focus:border-green-600"
                  rows={2}
                  placeholder="Description"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 border border-green-800 hover:border-green-600 rounded text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdate(category.id)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-400">Slug: {category.slug}</p>
                  {category.description && (
                    <p className="text-sm text-gray-300 mt-1">{category.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Order: {category.display_order}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEdit(category)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {categories.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No categories created yet</p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            Create Your First Category
          </button>
        </div>
      )}
    </div>
  );
}
