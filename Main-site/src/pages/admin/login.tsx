import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (username === 'key' && password === '1223') {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com',
        password: 'admin123',
      });

      if (error) {
        toast.error('Failed to login');
        setIsLoading(false);
        return;
      }

      navigate('/admin/dashboard');
    } else {
      toast.error('Invalid credentials');
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block font-mono mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="w-full px-3 py-2 bg-black border border-green-900 rounded focus:outline-none focus:border-green-500 font-mono"
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-mono mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-3 py-2 bg-black border border-green-900 rounded focus:outline-none focus:border-green-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-900 text-green-500 py-2 rounded hover:bg-green-800 transition font-mono disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}