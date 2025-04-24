import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ProjectForm } from '../../components/project-form';
import { ProjectCard } from '../../components/project-card';
import type { Database } from '../../lib/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

export function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('position');

    if (error) {
      toast.error('Failed to fetch projects');
      return;
    }

    setProjects(data);
    setIsLoading(false);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);

      const newProjects = arrayMove(projects, oldIndex, newIndex);
      setProjects(newProjects);

      const updates = newProjects.map((project, index) => ({
        id: project.id,
        position: index,
      }));

      const { error } = await supabase.from('projects').upsert(updates);

      if (error) {
        toast.error('Failed to update project positions');
        fetchProjects();
      }
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete project');
      return;
    }

    setProjects(projects.filter((p) => p.id !== id));
    toast.success('Project deleted');
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-green-900/20 rounded-lg border border-green-900"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-mono font-bold">Projects</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-900 text-green-500 px-4 py-2 rounded hover:bg-green-800 transition font-mono"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onClose={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingProject(null);
            fetchProjects();
          }}
        />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => {
                  setEditingProject(project);
                  setShowForm(true);
                }}
                onDelete={() => handleDelete(project.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}