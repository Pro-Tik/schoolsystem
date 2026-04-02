import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './features/admin/AdminDashboard';
import TeacherManagement from './features/admin/TeacherManagement';
import StudentManagement from './features/admin/StudentManagement';
import BatchManagement from './features/admin/BatchManagement';
import TeacherDashboard from './features/teacher/TeacherDashboard';
import BatchDetails from './features/teacher/BatchDetails';
import AttendanceOverview from './features/teacher/AttendanceOverview';
import QuizManagement from './features/teacher/QuizManagement';
import StudentDashboard from './features/student/StudentDashboard';
import MyQuizzes from './features/student/MyQuizzes';
import FeeManagement from './features/student/FeeManagement';
import { ProtectedRoute, RoleGuard } from './components/Guards';

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
      <p className="text-gray-600">You do not have permission to access this page.</p>
      <button 
        onClick={() => window.history.back()}
        className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Go Back
      </button>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['ADMIN']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'teachers', element: <TeacherManagement /> },
      { path: 'students', element: <StudentManagement /> },
      { path: 'batches', element: <BatchManagement /> },
    ]
  },
  {
    path: '/teacher',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['TEACHER']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <TeacherDashboard /> },
      { path: 'batches', element: <TeacherDashboard /> },
      { path: 'batches/:batchId', element: <BatchDetails /> },
      { path: 'batches/:batchId/quizzes', element: <QuizManagement /> },
      { path: 'attendance', element: <AttendanceOverview /> },
    ]
  },
  {
    path: '/student',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['STUDENT']}>
          <DashboardLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <StudentDashboard /> },
      { path: 'quizzes', element: <MyQuizzes /> },
      { path: 'fees', element: <FeeManagement /> },
    ]
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
