import { useEffect, useState } from 'react';
import { Terminal } from 'lucide-react';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowContent(false), 200);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!showContent) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="w-64 space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Terminal className="h-8 w-8 text-green-500 animate-pulse" />
          <span className="text-2xl font-mono font-bold text-green-500">
            Loading...
          </span>
        </div>
        <div className="h-2 bg-green-900/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="font-mono text-green-500 text-center">
          {progress}%
        </div>
      </div>
    </div>
  );
}