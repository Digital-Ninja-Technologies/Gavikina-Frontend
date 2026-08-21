import { createFileRoute } from '@tanstack/react-router';
import ProjectsManager from '../components/ProjectsManager';

export const Route = createFileRoute('/projects')({ component: ProjectsManager });
