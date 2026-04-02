import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { teacherService } from '../../api/teacher';
import { useAuthStore } from '../../store/useAuthStore';
import { BookOpen, Users, ArrowRight, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AttendanceOverview() {
  const user = useAuthStore((state) => state.user);
  const { data: batches, isLoading } = useQuery({
    queryKey: ['teacher-batches', user?.id],
    queryFn: () => teacherService.getMyBatches(user?.id)
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Tracking</h1>
        <p className="text-gray-500">Select a batch to mark or view attendance records.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2].map(i => <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {batches?.map((batch) => (
            <Link 
              to={`/teacher/batches/${batch.id}`}
              key={batch.id} 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-300 transition-all hover:shadow-md group flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <ClipboardCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{batch.name}</h4>
                  <p className="text-sm text-gray-500">{batch.schedule}</p>
                </div>
              </div>
              <div className="flex items-center text-indigo-600 font-medium">
                <span>Mark</span>
                <ArrowRight size={16} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
