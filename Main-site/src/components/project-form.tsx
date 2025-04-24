import { useState } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectFormProps {
  project?: Project | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProjectForm({ project, onClose, onSuccess }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image_url: formData.get('image_url') as string,
      technologies: (formData.get('technologies') as string).split(',').map((t) => t.trim()),
      github_url: formData.get('github_url') as string,
      demo_url: formData.get('demo_url') as string || null,
      featured: formData.get('featured') === 'on',
      position: project?.position ?? 0,
    };

    const { error } = project
      ? await supabase.from('projects').update(data).eq('id', project.id)
      : await supabase.from('projects').insert(data);

    if (error) {
      toast.error('Failed to save project');
      setIsLoading(false);
      return;
    }

    toast.success(`Project ${project ? 'updated' : 'created'} successfully`);
    onSuccess();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-black border border-green-900 rounded-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b border-green-900">
          <h2 className="text-xl font-mono font-bold">
            {project ? 'Edit Project' : 'Add Project'}
          </h2>
          <button
            onClick={onClose}
            className="text-green-500/50 hover:text-green-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="title" className="block font-mono mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={project?.title}
              required
              className="w-full px-3 py-2 bg-black border border-green-900 rounded focus:outline-none focus:border-green-500 font-mono"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-mono mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={project?.description}
              required
              rows={3}
              className="w-full px-3 py-2 bg-black border border-green-900 rounded focus:outline-none focus:border-green-500 font-mono"
            />
          </div>

          <div>
            <label htmlFor="image_url" className="block font-mono mb-1">
              Image URL
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              defaultValue={project?.image_url}
              required
              className="w-full px-3 py-2 bg-black border border-green-900 rounded focus:outline-none focus:border-green-500 font-mono"
            />
          </div>

          <div>
            <label htmlFor="technologies" className="block font-mono mb-1">
              Technologies (comma-separated)
            </label>
            <input
              type="text"
              id="technologies"
              name="technologies"
              defaultValue={project?.technologies.join(', ')}
              required
              className="w-full px-3 py-2 bg-black border border-green-900 rounded focus:outline-none focus:border-green-500 font-mono"
            />
          </div>

          <div>
            <label htmlFor="github_url" className="block font-mono mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              id="github_url"
              name="github_url"
              defaultValue={project?.github_url}
              required
              className="w-full px-3 py-2 bg-black border border-green-900 rounded focus:outline-none focus:border-green-500 font-mono"
            />
          </div>

          <div>
            <label htmlFor="demo_url" className="block font-mono mb-1">
              Demo URL (optional)
            </label>
            <input
              type="url"
              id="demo_url"
              name="demo_url"
              defaultValue={project?.demo_url ?? ''}
              className="w-full px-3 py-2 bg-black border border-green-900 rounded focus:outline-none focus:border-green-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              defaultChecked={project?.featured}
              className="rounded border-green-900 bg-black text-green-500 focus:ring-0 focus:ring-offset-0"
            />
            <label htmlFor="featured" className="font-mono">
              Featured Project
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-green-900 rounded hover:bg-green-900/50 transition font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-green-900 text-green-500 rounded hover:bg-green-800 transition font-mono disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}