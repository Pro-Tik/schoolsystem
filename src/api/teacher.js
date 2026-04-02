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
  }
};
