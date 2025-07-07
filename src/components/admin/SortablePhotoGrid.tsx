'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';

interface Photo {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  public_url: string;
  thumbnail_url: string;
  is_featured: boolean;
  is_color: boolean;
  display_order: number;
  metadata?: Record<string, any>;
  category?: {
    name: string;
  };
}

interface SortablePhotoProps {
  photo: Photo;
  isSelected: boolean;
  onToggleSelect: () => void;
  onToggleFeatured: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

function SortablePhoto({ 
  photo, 
  isSelected, 
  onToggleSelect, 
  onToggleFeatured, 
  onEdit, 
  onDelete,
  isDragging 
}: SortablePhotoProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-900 border rounded-lg overflow-hidden group ${
        isSelected ? 'border-yellow-600' : 'border-green-800'
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-20 cursor-move bg-black/75 p-2 rounded border border-green-400 opacity-100 hover:bg-green-900/50 transition-all"
        title="Drag to reorder"
      >
        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>

      {/* Selection Checkbox */}
      <div className="absolute top-2 right-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-4 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      {/* Image */}
      <div className="aspect-video relative">
        <Image
          src={photo.thumbnail_url || photo.public_url}
          alt={photo.title}
          fill
          className="object-cover"
          draggable={false}
        />
        
        {/* Featured Badge */}
        {photo.is_featured && (
          <div className="absolute top-2 left-12 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
            FEATURED
          </div>
        )}
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          <button
            onClick={onToggleFeatured}
            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm"
          >
            {photo.is_featured ? 'Unfeature' : 'Feature'}
          </button>
          <button
            onClick={onEdit}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold truncate">{photo.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
          <span className={photo.is_color ? 'text-blue-400' : 'text-gray-300'}>
            {photo.is_color ? '🎨 Color' : '⚫ B&W'}
          </span>
          {photo.category && (
            <>
              <span>•</span>
              <span>{photo.category.name}</span>
            </>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Order: {photo.display_order}
        </p>
      </div>
    </div>
  );
}

interface SortablePhotoGridProps {
  photos: Photo[];
  selectedPhotos: Set<string>;
  onPhotosReorder: (photos: Photo[]) => void;
  onToggleSelect: (photoId: string) => void;
  onToggleFeatured: (photo: Photo) => void;
  onEdit: (photo: Photo) => void;
  onDelete: (photoId: string) => void;
}

export default function SortablePhotoGrid({
  photos,
  selectedPhotos,
  onPhotosReorder,
  onToggleSelect,
  onToggleFeatured,
  onEdit,
  onDelete,
}: SortablePhotoGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = photos.findIndex((p) => p.id === active.id);
      const newIndex = photos.findIndex((p) => p.id === over.id);
      
      const newPhotos = arrayMove(photos, oldIndex, newIndex);
      onPhotosReorder(newPhotos);
    }

    setActiveId(null);
  };

  const activePhoto = activeId ? photos.find((p) => p.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={photos.map(p => p.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <SortablePhoto
              key={photo.id}
              photo={photo}
              isSelected={selectedPhotos.has(photo.id)}
              onToggleSelect={() => onToggleSelect(photo.id)}
              onToggleFeatured={() => onToggleFeatured(photo)}
              onEdit={() => onEdit(photo)}
              onDelete={() => onDelete(photo.id)}
              isDragging={photo.id === activeId}
            />
          ))}
        </div>
      </SortableContext>
      
      <DragOverlay>
        {activePhoto ? (
          <div className="bg-gray-900 border border-green-400 rounded-lg overflow-hidden shadow-2xl opacity-90">
            <div className="aspect-video relative">
              <Image
                src={activePhoto.thumbnail_url || activePhoto.public_url}
                alt={activePhoto.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold truncate">{activePhoto.title}</h3>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
