import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, Bell } from 'lucide-react';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md"
          >
            <Menu size={24} />
          </button>

          <div className="flex-1" />

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
