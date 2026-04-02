import { INITIAL_BATCHS, INITIAL_STUDENTS, INITIAL_ATTENDANCE } from './mockData';

export const teacherService = {
  getMyBatches: async (teacherId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const batches = INITIAL_BATCHS.filter(b => b.teacherId === teacherId);
        resolve(batches);
      }, 500);
    });
  },

  getBatchStudents: async (batchId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const students = INITIAL_STUDENTS.filter(s => s.batchId === batchId);
        resolve(students);
      }, 400);
    });
  },

  submitAttendance: async (batchId, attendanceData) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 600);
    });
  },

  getQuizzes: async (batchId) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        { id: 'q1', title: 'Mathematics Basics', questions: 10, status: 'PUBLISHED', dueDate: '2026-04-10' },
        { id: 'q2', title: 'Algebra Quiz', questions: 15, status: 'DRAFT', dueDate: '2026-04-15' }
      ]), 500);
    });
  },

  createQuiz: async (batchId, quizData) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, id: Math.random().toString(36).substr(2, 9) }), 800);
    });
  },

  createBatch: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, id: 'b' + Date.now() }), 700);
    });
  },

  generateFees: async (batchId, data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 800);
    });
  },

  getAttendanceHistory: async (batchId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const history = INITIAL_ATTENDANCE.filter(a => a.batchId === batchId);
        resolve(history);
      }, 500);
    });
  },

  getTeacherDashboard: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          activeBatches: INITIAL_BATCHS.length,
          totalStudents: INITIAL_STUDENTS.length,
          pendingFees: INITIAL_FEES.filter(f => f.status === 'PENDING').length,
          upcomingQuizzes: 2
        });
      }, 600);
    });
  },

  getQuizDetails: async (batchId, quizId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: quizId,
          title: 'Mathematics Basics',
          description: 'Basic algebra and geometry',
          duration: 30,
          dueDate: '2026-04-10',
          questions: [
            { id: 'q1', text: 'What is 2+2?', options: ['3', '4', '5'], correct: '4' }
          ]
        });
      }, 400);
    });
  },

  updateQuiz: async (batchId, quizId, data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, quizId }), 600);
    });
  },

  toggleQuizPublish: async (batchId, quizId, isPublished) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, quizId, isPublished }), 400);
    });
  },

  deleteQuiz: async (batchId, quizId) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 500);
    });
  },

  addQuestion: async (batchId, quizId, questionData) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, id: Math.random().toString(36).substr(2, 9) }), 600);
    });
  },

  updateQuestion: async (batchId, quizId, questionId, data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, questionId }), 500);
    });
  },

  deleteQuestion: async (batchId, quizId, questionId) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 400);
    });
  },

  getQuizSubmissions: async (batchId, quizId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { studentId: 's1', studentName: 'Alice Johnson', score: 85, submittedAt: '2026-03-29' },
          { studentId: 's2', studentName: 'Bob Smith', score: 70, submittedAt: '2026-03-30' }
        ]);
      }, 700);
    });
  }
};
