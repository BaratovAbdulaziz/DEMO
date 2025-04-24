import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 bg-green-900/20 p-4 rounded-lg border border-green-900"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-green-500/50 hover:text-green-500"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex-grow">
        <h3 className="font-mono font-bold">{project.title}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-green-900/50 rounded text-xs font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="p-2 text-green-500/50 hover:text-green-500"
        >
          <Pencil className="h-5 w-5" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-green-500/50 hover:text-green-500"
        >
          <Trash className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}