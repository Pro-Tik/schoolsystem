import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../../api/student';
import { teacherService } from '../../api/teacher';
import { BookOpen, Clock, Calendar, CheckCircle, AlertCircle, X, ChevronRight, ChevronLeft } from 'lucide-react';

export default function MyQuizzes() {
  const queryClient = useQueryClient();
  const [activeQuiz, setActiveQuiz] = React.useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState({});

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['assigned-quizzes'],
    queryFn: studentService.getAssignedQuizzes
  });

  const { data: quizDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ['quiz-details', activeQuiz?.id],
    queryFn: () => teacherService.getQuizDetails('any-batch', activeQuiz.id),
    enabled: !!activeQuiz
  });

  const submitMutation = useMutation({
    mutationFn: (quizId) => studentService.submitQuiz(quizId, Object.entries(answers).map(([id, choice]) => ({ questionId: id, selectedAnswer: choice }))),
    onSuccess: () => {
      queryClient.invalidateQueries(['assigned-quizzes']);
      setActiveQuiz(null);
      setAnswers({});
      setCurrentQuestionIndex(0);
      alert('Quiz submitted successfully!');
    }
  });

  const handleAnswerSelect = (questionId, choice) => {
    setAnswers(prev => ({ ...prev, [questionId]: choice }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizDetails.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

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
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${quiz.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
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
              onClick={() => setActiveQuiz(quiz)}
              disabled={quiz.status === 'COMPLETED' || submitMutation.isPending}
              className="mt-6 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
            >
              {quiz.status === 'COMPLETED' ? 'Completed' : 'Start Quiz'}
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

      {/* Take Quiz Modal */}
      {activeQuiz && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl relative min-h-[400px] flex flex-col">
            <button onClick={() => setActiveQuiz(null)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>

            {loadingDetails ? <div className="flex-1 flex items-center justify-center">Loading Questions...</div> : (
              <>
                <div className="mb-8">
                  <h2 className="text-xl font-bold">{activeQuiz.title}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {quizDetails.questions.length}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / quizDetails.questions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-lg font-medium mb-6">{quizDetails.questions[currentQuestionIndex].text}</p>
                  <div className="space-y-3">
                    {quizDetails.questions[currentQuestionIndex].options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswerSelect(quizDetails.questions[currentQuestionIndex].id, option)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[quizDetails.questions[currentQuestionIndex].id] === option
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-100 hover:border-indigo-200'
                          }`}
                      >
                        <span className="font-bold mr-4">{String.fromCharCode(65 + i)}.</span>
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                  <button
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center space-x-2 text-gray-600 disabled:opacity-30"
                  >
                    <ChevronLeft size={20} />
                    <span>Previous</span>
                  </button>

                  {currentQuestionIndex === quizDetails.questions.length - 1 ? (
                    <button
                      onClick={() => submitMutation.mutate(activeQuiz.id)}
                      disabled={submitMutation.isPending || !answers[quizDetails.questions[currentQuestionIndex].id]}
                      className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg disabled:opacity-50"
                    >
                      {submitMutation.isPending ? 'Submitting...' : 'Complete & Submit'}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      disabled={!answers[quizDetails.questions[currentQuestionIndex].id]}
                      className="flex items-center space-x-2 text-indigo-600 font-bold disabled:opacity-30"
                    >
                      <span>Next Question</span>
                      <ChevronRight size={20} />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
