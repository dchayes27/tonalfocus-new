import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

async function getStats() {
  const supabase = createClient();
  
  // Get photo count
  const { count: photoCount } = await supabase
    .from('photos')
    .select('*', { count: 'exact', head: true });
    
  // Get category count  
  const { count: categoryCount } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });
    
  // Get featured photos count
  const { count: featuredCount } = await supabase
    .from('photos')
    .select('*', { count: 'exact', head: true })
    .eq('is_featured', true);
    
  return {
    photoCount: photoCount || 0,
    categoryCount: categoryCount || 0,
    featuredCount: featuredCount || 0
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-mono">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Total Photos</h3>
          <p className="text-3xl font-bold text-green-400">{stats.photoCount}</p>
        </div>
        
        <div className="bg-gray-900 border border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Categories</h3>
          <p className="text-3xl font-bold text-green-400">{stats.categoryCount}</p>
        </div>
        
        <div className="bg-gray-900 border border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Featured Photos</h3>
          <p className="text-3xl font-bold text-green-400">{stats.featuredCount}</p>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/photos/upload"
            className="block p-6 bg-gray-900 border border-green-800 rounded-lg hover:border-green-600 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">📸 Upload Photos</h3>
            <p className="text-gray-400">Add new photos to your portfolio</p>
          </Link>
          
          <Link
            href="/admin/photos"
            className="block p-6 bg-gray-900 border border-green-800 rounded-lg hover:border-green-600 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">🖼️ Manage Photos</h3>
            <p className="text-gray-400">Edit, delete, or reorder existing photos</p>
          </Link>
          
          <Link
            href="/admin/categories"
            className="block p-6 bg-gray-900 border border-green-800 rounded-lg hover:border-green-600 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">📁 Manage Categories</h3>
            <p className="text-gray-400">Organize your photo categories</p>
          </Link>
          
          <Link
            href="/"
            target="_blank"
            className="block p-6 bg-gray-900 border border-green-800 rounded-lg hover:border-green-600 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">🌐 View Site</h3>
            <p className="text-gray-400">See your portfolio live</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
