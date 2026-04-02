import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { teacherService } from '../../api/teacher';
import { ChevronLeft, Check, X, Save, Calendar, BookOpen, CreditCard } from 'lucide-react';

export default function BatchDetails() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState({});

  const { data: students, isLoading } = useQuery({
    queryKey: ['batch-students', batchId],
    queryFn: () => teacherService.getBatchStudents(batchId)
  });

  const mutation = useMutation({
    mutationFn: (data) => teacherService.submitAttendance(batchId, data),
    onSuccess: () => {
      alert('Attendance submitted successfully!');
    }
  });

  const feeMutation = useMutation({
    mutationFn: (data) => teacherService.generateFees(batchId, data),
    onSuccess: () => {
      alert('Fees generated successfully for this batch!');
    }
  });

  const handleGenerateFees = () => {
    if (window.confirm('Generate fees for the current month for all students in this batch?')) {
      feeMutation.mutate({ month: 'April', year: 2026 });
    }
  };

  const toggleAttendance = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = () => {
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status
    }));
    mutation.mutate({ date: new Date().toISOString(), records });
  };

  if (isLoading) return <div className="animate-pulse space-y-4">
    <div className="h-10 bg-gray-200 rounded w-1/4" />
    <div className="h-64 bg-gray-200 rounded" />
  </div>;

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft size={20} />
        <span>Back to Batches</span>
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batch Roster & Attendance</h1>
          <p className="text-gray-500">Mark attendance for today: {new Date().toLocaleDateString()}</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={Object.keys(attendance).length === 0 || mutation.isPending}
          className="flex items-center justify-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-md"
        >
          <Save size={18} />
          <span>{mutation.isPending ? 'Saving...' : 'Save Attendance'}</span>
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <button 
          onClick={() => navigate(`/teacher/batches/${batchId}/quizzes`)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <BookOpen size={18} className="text-indigo-600" />
          <span className="font-medium">Manage Quizzes</span>
        </button>
        <button 
          onClick={handleGenerateFees}
          disabled={feeMutation.isPending}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <CreditCard size={18} className="text-green-600" />
          <span className="font-medium">{feeMutation.isPending ? 'Generating...' : 'Generate Fees'}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-center">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students?.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => toggleAttendance(student.id, 'PRESENT')}
                        className={`p-2 rounded-lg transition-colors ${
                          attendance[student.id] === 'PRESENT' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600'
                        }`}
                      >
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={() => toggleAttendance(student.id, 'ABSENT')}
                        className={`p-2 rounded-lg transition-colors ${
                          attendance[student.id] === 'ABSENT' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600'
                        }`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
