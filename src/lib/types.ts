// Database Types for TonalFocus Photography Portfolio

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  filename: string;
  file_size: number;
  width: number;
  height: number;
  cloudinary_url: string;
  thumbnail_url: string;
  display_order: number;
  is_featured: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Joined data
  category?: Category;
}

export interface PhotoWithCategory extends Photo {
  category: Category | null;
}

// Form types for creating/updating
export interface CreatePhotoInput {
  title: string;
  description?: string;
  category_id?: string;
  filename: string;
  file_size: number;
  width: number;
  height: number;
  cloudinary_url: string;
  thumbnail_url: string;
  display_order?: number;
  is_featured?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdatePhotoInput {
  title?: string;
  description?: string;
  category_id?: string;
  display_order?: number;
  is_featured?: boolean;
  metadata?: Record<string, any>;
}
