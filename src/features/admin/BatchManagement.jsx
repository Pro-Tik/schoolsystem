import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../api/admin';
import { BookOpen, Users, Calendar, Search } from 'lucide-react';

export default function BatchManagement() {
  const { data: batches, isLoading } = useQuery({
    queryKey: ['admin-batches'],
    queryFn: adminService.getBatches
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batch Management</h1>
          <p className="text-gray-500">Overview of all active and upcoming batches.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search batches..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Batch Name</th>
                <th className="px-6 py-4">Teacher ID</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-2/3" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/4" /></td>
                  </tr>
                ))
              ) : (
                batches?.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                          <BookOpen size={18} />
                        </div>
                        <span className="font-medium text-gray-900">{batch.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{batch.teacherId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{batch.schedule}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Users size={14} />
                        <span>{batch.studentCount}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
