import { Outlet } from 'react-router-dom';
import { Terminal } from 'lucide-react';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-black text-green-500">
      <header className="border-b border-green-900">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <Terminal className="h-6 w-6" />
          <span className="text-xl font-mono font-bold">Admin Panel</span>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}