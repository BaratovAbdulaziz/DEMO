import { Outlet, useNavigate } from 'react-router-dom';
import { Code2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export function PublicLayout() {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    if (clickCount === 3) {
      navigate('/admin');
      setClickCount(0);
    }
  }, [clickCount, navigate]);

  const handleLogoClick = () => {
    const currentTime = Date.now();
    if (currentTime - lastClickTime > 500) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    setLastClickTime(currentTime);
  };

  return (
    <div className="min-h-screen bg-black text-green-500">
      <header className="border-b border-green-900">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2">
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2 focus:outline-none"
          >
            <Code2 className="h-6 w-6" />
            <span className="text-xl font-mono font-bold">Portfolio</span>
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}