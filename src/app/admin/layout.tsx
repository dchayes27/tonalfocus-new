import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth/admin';
import { LogoutButton } from './LogoutButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication server-side
  const isAuthenticated = isAdminAuthenticated();
  
  if (!isAuthenticated) {
    redirect('/auth/admin');
  }
  
  return (
    <div className="min-h-screen bg-black text-green-400">
      <header className="border-b border-green-800 bg-black/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold font-mono">
              TonalFocus Admin
            </h1>
            <nav className="flex items-center space-x-4">
              <a 
                href="/admin" 
                className="hover:text-green-300 transition-colors"
              >
                Dashboard
              </a>
              <a 
                href="/admin/photos" 
                className="hover:text-green-300 transition-colors"
              >
                Photos
              </a>
              <a 
                href="/admin/categories" 
                className="hover:text-green-300 transition-colors"
              >
                Categories
              </a>
              <LogoutButton />
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
