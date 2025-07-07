'use client';

export function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    window.location.href = '/auth/admin';
  };
  
  return (
    <button
      onClick={handleLogout}
      className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
    >
      Logout
    </button>
  );
}
