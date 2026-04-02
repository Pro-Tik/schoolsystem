import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../../api/student';
import { BookOpen, Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export default function MyQuizzes() {
  const queryClient = useQueryClient();
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['assigned-quizzes'],
    queryFn: studentService.getAssignedQuizzes
  });

  const submitMutation = useMutation({
    mutationFn: (quizId) => studentService.submitQuiz(quizId, []),
    onSuccess: () => {
      queryClient.invalidateQueries(['assigned-quizzes']);
      alert('Quiz submitted successfully!');
    }
  });

  if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-64 bg-gray-200 rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Quizzes</h1>
        <p className="text-gray-500">View and complete your assigned quizzes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes?.map((quiz) => (
          <div key={quiz.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <BookOpen size={20} />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                quiz.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {quiz.status}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">{quiz.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{quiz.batchName}</p>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <Clock size={16} />
                <span>{quiz.duration} mins</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <Calendar size={16} />
                <span>Due: {quiz.dueDate}</span>
              </div>
            </div>

            <button 
              onClick={() => submitMutation.mutate(quiz.id)}
              disabled={quiz.status === 'COMPLETED' || submitMutation.isPending}
              className="mt-6 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
            >
              {quiz.status === 'COMPLETED' ? 'Completed' : submitMutation.isPending ? 'Submitting...' : 'Start Quiz'}
            </button>
          </div>
        ))}

        {quizzes?.length === 0 && (
          <div className="col-span-full bg-gray-50 p-12 rounded-xl text-center border-2 border-dashed border-gray-200">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900">No quizzes assigned</h3>
            <p className="text-gray-500">You're all caught up! Check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
