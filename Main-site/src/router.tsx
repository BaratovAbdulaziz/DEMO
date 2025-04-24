import { createBrowserRouter } from 'react-router-dom';
import { ProjectsPage } from './pages/projects';
import { AdminLoginPage } from './pages/admin/login';
import { AdminDashboardPage } from './pages/admin/dashboard';
import { AdminLayout } from './components/admin-layout';
import { PublicLayout } from './components/public-layout';
import { ProtectedRoute } from './components/protected-route';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <ProjectsPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminLoginPage />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);