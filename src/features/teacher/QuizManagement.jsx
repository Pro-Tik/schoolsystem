import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherService } from '../../api/teacher';
import { Plus, BookOpen, Clock, Calendar, ChevronLeft, Send } from 'lucide-react';

export default function QuizManagement() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['batch-quizzes', batchId],
    queryFn: () => teacherService.getQuizzes(batchId)
  });

  const createMutation = useMutation({
    mutationFn: (data) => teacherService.createQuiz(batchId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['batch-quizzes', batchId]);
      setShowCreate(false);
      alert('Quiz created successfully!');
    }
  });

  if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-64 bg-gray-200 rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft size={20} />
        <span>Back to Batch</span>
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quiz Management</h1>
          <p className="text-gray-500">Create and manage quizzes for this batch.</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          <span>New Quiz</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes?.map((quiz) => (
          <div key={quiz.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <BookOpen size={20} />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                quiz.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {quiz.status}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">{quiz.title}</h3>
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <Clock size={16} />
                <span>{quiz.questions} Questions</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <Calendar size={16} />
                <span>Due: {quiz.dueDate}</span>
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Edit
              </button>
              <button className="flex-1 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium">
                Results
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Create New Quiz</h2>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate({ title: 'New Quiz', questions: 10 });
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Algebra Basics" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
              <div className="flex space-x-3 mt-6">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create Quiz</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
