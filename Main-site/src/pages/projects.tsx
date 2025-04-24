import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { LoadingScreen } from '../components/loading-screen';

type Project = Database['public']['Tables']['projects']['Row'];

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  useEffect(() => {
    const subscription = supabase
      .channel('projects_realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects'
      }, () => {
        fetchProjects();
      })
      .subscribe();

    fetchProjects();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('position');

    if (error) {
      console.error('Error fetching projects:', error);
      return;
    }

    setProjects(data);
    setIsLoading(false);
  }

  const technologies = Array.from(
    new Set(projects.flatMap((p) => p.technologies))
  ).sort();

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesTech =
      !selectedTech || project.technologies.includes(selectedTech);
    return matchesSearch && matchesTech;
  });

  if (showLoadingScreen) {
    return <LoadingScreen />;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-green-900/20 rounded-lg aspect-video"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500/50" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black border border-green-900 rounded focus:outline-none focus:border-green-500 font-mono transition-colors duration-200"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTech(null)}
            className={`px-3 py-1 rounded font-mono text-sm transition-all duration-200 ${
              !selectedTech
                ? 'bg-green-500 text-black scale-105'
                : 'bg-green-900/50 hover:bg-green-900 hover:scale-105'
            }`}
          >
            All
          </button>
          {technologies.map((tech) => (
            <button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              className={`px-3 py-1 rounded font-mono text-sm transition-all duration-200 ${
                selectedTech === tech
                  ? 'bg-green-500 text-black scale-105'
                  : 'bg-green-900/50 hover:bg-green-900 hover:scale-105'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
            className="group relative bg-green-900/20 rounded-lg overflow-hidden border border-green-900 hover:border-green-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 animate-slide-up"
          >
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-all duration-300 p-4 flex flex-col backdrop-blur-sm">
              <h3 className="text-lg font-bold font-mono mb-2 animate-fade-down">
                {project.title}
              </h3>
              <p className="text-sm text-green-500/80 mb-4 flex-grow animate-fade-down">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4 animate-fade-up">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-green-900/50 rounded text-xs font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 animate-fade-up">
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-green-900 hover:bg-green-800 text-green-500 py-2 rounded text-sm font-mono transition-colors duration-200"
                >
                  GitHub
                </a>
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-green-900 hover:bg-green-800 text-green-500 py-2 rounded text-sm font-mono transition-colors duration-200"
                  >
                    Demo
                  </a>
                )}
              </div>
            </div>
            {project.featured && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-black rounded text-xs font-mono animate-pulse">
                Featured
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}