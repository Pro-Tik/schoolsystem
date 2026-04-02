import { INITIAL_FEES, INITIAL_ATTENDANCE } from './mockData';

export const studentService = {
  getDashboard: async (studentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const studentFees = INITIAL_FEES.filter(f => f.studentId === studentId);
        const attendance = INITIAL_ATTENDANCE.filter(a =>
          a.records.some(r => r.studentId === studentId)
        );

        resolve({
          fees: studentFees,
          attendanceSummary: {
            totalClasses: 10,
            present: 8,
            percentage: 80
          },
          upcomingQuizzes: [
            { id: 'q1', title: 'Math Quiz 1', dueDate: '2026-04-10' }
          ]
        });
      }, 500);
    });
  },

  payFee: async (feeId) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, feeId }), 800);
    });
  },

  getAssignedQuizzes: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        { id: 'q1', title: 'Mathematics Basics', batchName: 'Batch A', duration: 30, dueDate: '2026-04-10', status: 'PENDING' }
      ]), 500);
    });
  },

  submitQuiz: async (quizId, answers) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, score: 85 }), 1000);
    });
  },

  getAttendanceSummary: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ totalClasses: 10, present: 8, absent: 2, percentage: 80 }), 400);
    });
  },

  getFeeSummary: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ totalDue: 2000, paid: 4000, pending: 1 }), 400);
    });
  },

  getSubmissionHistory: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 's1', quizTitle: 'Chapter 1 Quiz', score: 85, date: '2026-03-29' },
          { id: 's2', quizTitle: 'Chapter 2 Quiz', score: 90, date: '2026-03-31' }
        ]);
      }, 500);
    });
  },

  getFeeHistory: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'h1', month: 'January', year: 2026, amount: 2000, status: 'PAID', date: '2026-01-05' },
          { id: 'h2', month: 'February', year: 2026, amount: 2000, status: 'PAID', date: '2026-02-04' }
        ]);
      }, 600);
    });
  },

  getMySubmission: async (batchId, quizId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          quizId,
          score: 85,
          totalPoints: 100,
          submittedAt: '2026-03-29',
          answers: [
            { questionId: 'q1', selected: 'B', correct: 'B', isCorrect: true }
          ]
        });
      }, 700);
    });
  }
};
