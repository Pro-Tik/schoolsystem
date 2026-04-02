import { INITIAL_TEACHERS, INITIAL_STUDENTS, INITIAL_BATCHS } from './mockData';

export const adminService = {
  getOverview: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalTeachers: INITIAL_TEACHERS.length,
          totalStudents: INITIAL_STUDENTS.length,
          totalBatches: INITIAL_BATCHS.length,
          activeUsers: INITIAL_TEACHERS.filter(t => t.status === 'ACTIVE').length + 
                       INITIAL_STUDENTS.filter(s => s.status === 'ACTIVE').length
        });
      }, 500);
    });
  },

  getTeachers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(INITIAL_TEACHERS), 400);
    });
  },

  getStudents: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(INITIAL_STUDENTS), 400);
    });
  },

  getBatches: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(INITIAL_BATCHS), 400);
    });
  },

  updateUserStatus: async (userId, status) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, userId, status }), 300);
    });
  },

  createTeacher: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, id: 't' + Date.now() }), 600);
    });
  },

  createStudent: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, id: 's' + Date.now() }), 600);
    });
  },

  getReports: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        revenue: [
          { name: 'Jan', amount: 4000 },
          { name: 'Feb', amount: 3000 },
          { name: 'Mar', amount: 5000 },
          { name: 'Apr', amount: 4500 },
        ],
        enrollment: [
          { name: 'Batch A', students: 45 },
          { name: 'Batch B', students: 32 },
          { name: 'Batch C', students: 28 },
        ]
      }), 800);
    });
  }
};
