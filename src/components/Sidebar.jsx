import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  BookOpen, 
  LogOut, 
  Menu, 
  X,
  CreditCard,
  ClipboardCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

const SidebarItem = ({ to, icon: Icon, label, onClick, end }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
        isActive 
          ? "bg-indigo-600 text-white" 
          : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
      )
    }
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default function Sidebar({ isOpen, toggleSidebar }) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/admin/teachers', icon: UserSquare2, label: 'Teachers' },
    { to: '/admin/students', icon: Users, label: 'Students' },
    { to: '/admin/batches', icon: BookOpen, label: 'Batches' },
  ];

  const teacherLinks = [
    { to: '/teacher', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/teacher/batches', icon: BookOpen, label: 'My Batches' },
    { to: '/teacher/attendance', icon: ClipboardCheck, label: 'Attendance' },
  ];

  const studentLinks = [
    { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/student/quizzes', icon: BookOpen, label: 'My Quizzes' },
    { to: '/student/fees', icon: CreditCard, label: 'Fees' },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : user?.role === 'TEACHER' ? teacherLinks : studentLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-indigo-600">Class Pilot</h1>
            <button onClick={toggleSidebar} className="lg:hidden text-gray-500">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {links.map((link) => (
              <SidebarItem key={link.to} {...link} onClick={() => isOpen && toggleSidebar()} />
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 px-4 py-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{user?.role.toLowerCase()}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
