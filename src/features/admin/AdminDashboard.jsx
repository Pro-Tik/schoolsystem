import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../api/admin';
import { Users, UserSquare2, BookOpen, Activity, TrendingUp, DollarSign } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getOverview
  });

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: adminService.getReports
  });

  if (statsLoading) return (
    <div className="animate-pulse space-y-8">
      <div className="h-10 bg-gray-200 rounded w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
          <p className="text-gray-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
          <Activity size={16} className="text-green-500" />
          <span>System: Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Teachers" 
          value={stats?.totalTeachers} 
          icon={UserSquare2} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Total Students" 
          value={stats?.totalStudents} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Batches" 
          value={stats?.totalBatches} 
          icon={BookOpen} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Active Users" 
          value={stats?.activeUsers} 
          icon={Activity} 
          color="bg-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-gray-900 flex items-center space-x-2">
              <DollarSign size={20} className="text-indigo-600" />
              <span>Revenue Trend</span>
            </h3>
            <select className="text-sm border-none bg-gray-50 rounded-lg px-2 py-1 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64 w-full">
            {reportsLoading ? (
              <div className="h-full w-full bg-gray-50 animate-pulse rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reports?.revenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-gray-900 flex items-center space-x-2">
              <TrendingUp size={20} className="text-indigo-600" />
              <span>Enrollment by Batch</span>
            </h3>
            <button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
          </div>
          <div className="h-64 w-full">
            {reportsLoading ? (
              <div className="h-full w-full bg-gray-50 animate-pulse rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reports?.enrollment}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="students" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40}>
                    {reports?.enrollment.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
