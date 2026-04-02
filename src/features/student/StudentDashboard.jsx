import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentService } from '../../api/student';
import { useAuthStore } from '../../store/useAuthStore';
import { BookOpen, Calendar, CreditCard, TrendingUp, CheckCircle, GraduationCap } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

export default function StudentDashboard() {
  const user = useAuthStore((state) => state.user);
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['student-dashboard', user?.id],
    queryFn: () => studentService.getDashboard(user?.id)
  });

  const quizPerformance = [
    { name: 'Quiz 1', score: 85 },
    { name: 'Quiz 2', score: 70 },
    { name: 'Quiz 3', score: 92 },
    { name: 'Quiz 4', score: 88 },
  ];

  const attendanceData = [
    { name: 'Present', value: dashboard?.attendanceSummary?.present || 0 },
    { name: 'Absent', value: (dashboard?.attendanceSummary?.totalClasses || 0) - (dashboard?.attendanceSummary?.present || 0) },
  ];

  const COLORS = ['#4f46e5', '#e5e7eb'];

  if (isLoading) return (
    <div className="animate-pulse space-y-8">
      <div className="h-10 bg-gray-200 rounded w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-500">Track your learning progress and upcoming tasks.</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-100">
          <CheckCircle size={18} />
          <span className="text-sm font-medium">All fees paid for March</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle size={20} />
            </div>
            <h3 className="font-bold">Attendance</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{dashboard?.attendanceSummary?.percentage}%</p>
          <p className="text-sm text-gray-500 mt-1">{dashboard?.attendanceSummary?.present} of {dashboard?.attendanceSummary?.totalClasses} classes</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <GraduationCap size={20} />
            </div>
            <h3 className="font-bold">Quizzes</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{dashboard?.upcomingQuizzes?.length || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Upcoming this week</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <CreditCard size={20} />
            </div>
            <h3 className="font-bold">Fees</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {dashboard?.fees?.filter(f => f.status === 'PENDING').length || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Pending payments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Attendance Mix</h3>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-indigo-600 rounded-full" />
              <span className="text-xs text-gray-500">Present</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-200 rounded-full" />
              <span className="text-xs text-gray-500">Absent</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center space-x-2">
              <TrendingUp size={20} className="text-indigo-600" />
              <span>Quiz Performance</span>
            </h3>
            <button className="text-sm text-indigo-600 font-medium hover:underline">View History</button>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quizPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center space-x-2">
              <Calendar size={20} className="text-indigo-600" />
              <span>Upcoming Quizzes</span>
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {dashboard?.upcomingQuizzes?.map((quiz) => (
              <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{quiz.title}</p>
                    <p className="text-xs text-gray-500">Due: {quiz.dueDate}</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  Prepare
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center space-x-2">
              <CreditCard size={20} className="text-indigo-600" />
              <span>Recent Payments</span>
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {dashboard?.fees?.slice(0, 2).map((fee) => (
              <div key={fee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white rounded-lg text-green-600 shadow-sm">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{fee.month} {fee.year}</p>
                    <p className="text-xs text-gray-500">৳{fee.amount}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {fee.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
