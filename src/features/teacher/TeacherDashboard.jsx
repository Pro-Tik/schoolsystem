import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherService } from '../../api/teacher';
import { useAuthStore } from '../../store/useAuthStore';
import { BookOpen, Users, Calendar, ArrowRight, TrendingUp, ClipboardCheck, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const batchSchema = z.object({
  name: z.string().min(2, 'Batch name is required'),
  schedule: z.string().min(5, 'Schedule is required'),
  description: z.string().optional(),
});

export default function TeacherDashboard() {
  const [showModal, setShowModal] = useState(false);
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: batches, isLoading } = useQuery({
    queryKey: ['teacher-batches', user?.id],
    queryFn: () => teacherService.getMyBatches(user?.id)
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(batchSchema)
  });

  const createMutation = useMutation({
    mutationFn: (data) => teacherService.createBatch({ ...data, teacherId: user?.id }),
    onSuccess: () => {
      queryClient.invalidateQueries(['teacher-batches', user?.id]);
      setShowModal(false);
      reset();
      alert('Batch created successfully!');
    }
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  const performanceData = [
    { name: 'Batch A', avgScore: 78 },
    { name: 'Batch B', avgScore: 85 },
    { name: 'Batch C', avgScore: 72 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-500">Manage your batches and track student progress.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          <span>Create Batch</span>
        </button>
      </div>

      {/* Create Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-6">Create New Batch</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
                <input 
                  {...register('name')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="e.g. Class 9 - Math"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <input 
                  {...register('schedule')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="e.g. Sun-Tue-Thu 10:00 AM"
                />
                {errors.schedule && <p className="text-red-500 text-xs mt-1">{errors.schedule.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea 
                  {...register('description')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  rows="3"
                  placeholder="Batch details..."
                />
              </div>
              <div className="flex space-x-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center space-x-2">
              <TrendingUp size={20} className="text-indigo-600" />
              <span>Batch Performance (Avg. Quiz Score)</span>
            </h3>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="avgScore" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-indigo-600 p-6 rounded-xl text-white shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium opacity-90">Quick Stats</h3>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-80">Active Batches</span>
                <span className="text-xl font-bold">{batches?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-80">Total Students</span>
                <span className="text-xl font-bold">
                  {batches?.reduce((acc, b) => acc + b.studentCount, 0) || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-80">Avg. Attendance</span>
                <span className="text-xl font-bold">88%</span>
              </div>
            </div>
          </div>
          <button className="mt-6 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-2">
            <ClipboardCheck size={18} />
            <span>Mark Today's Attendance</span>
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900">My Batches</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2].map(i => <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches?.map((batch) => (
            <Link 
              to={`/teacher/batches/${batch.id}`}
              key={batch.id} 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-300 transition-all hover:shadow-md group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <BookOpen size={20} />
                </div>
                <span className="text-xs font-medium text-gray-500">{batch.schedule}</span>
              </div>
              <h4 className="font-bold text-gray-900">{batch.name}</h4>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>{batch.studentCount} Students</span>
                </div>
                <div className="flex items-center text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Details</span>
                  <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
