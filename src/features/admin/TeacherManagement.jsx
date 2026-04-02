import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/admin';
import { Search, UserPlus, MoreVertical, ShieldCheck, ShieldAlert, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const teacherSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(2, 'Subject is required'),
  phone: z.string().min(10, 'Invalid phone number'),
});

export default function TeacherManagement() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: adminService.getTeachers
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(teacherSchema)
  });

  const createMutation = useMutation({
    mutationFn: (data) => adminService.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['teachers']);
      setShowModal(false);
      reset();
      alert('Teacher created successfully!');
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => adminService.updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['teachers']);
    }
  });

  const toggleStatus = (teacher) => {
    const newStatus = teacher.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    statusMutation.mutate({ id: teacher.id, status: newStatus });
  };

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-500">Manage all teachers and their account status.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UserPlus size={18} />
          <span>Add Teacher</span>
        </button>
      </div>

      {/* Add Teacher Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-6">Add New Teacher</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  {...register('name')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="e.g. John Smith"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  {...register('email')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  {...register('subject')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="e.g. Mathematics"
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  {...register('phone')}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="017XXXXXXXX"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
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
                  {createMutation.isPending ? 'Adding...' : 'Add Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search teachers..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-4 h-16 bg-gray-50/50"></td>
                  </tr>
                ))
              ) : (
                teachers?.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {teacher.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{teacher.name}</p>
                          <p className="text-xs text-gray-500">{teacher.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{teacher.subject}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(teacher)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          teacher.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {teacher.status === 'ACTIVE' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                        <span>{teacher.status}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{teacher.phone}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                        <MoreVertical size={18} />
                      </button>
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
