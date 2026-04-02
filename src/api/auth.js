/**
 * Mock Authentication Service
 * Simulates network latency and returns hardcoded user data based on Postman collection.
 */

const MOCK_USERS = [
  {
    id: 'a1',
    email: 'admin@classpilot.com',
    password: 'Admin12345',
    role: 'ADMIN',
    name: 'System Admin',
  },
  {
    id: 't1',
    email: 'john@example.com',
    password: 'Teacher123',
    role: 'TEACHER',
    name: 'John Smith',
  },
  {
    id: 's1',
    email: 'alice@example.com',
    password: 'NewPass@1234',
    role: 'STUDENT',
    name: 'Alice Johnson',
  },
];

export const authService = {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          // Destructure to remove password from returned object
          const { password: _, ...userWithoutPassword } = user;
          resolve({
            user: userWithoutPassword,
            accessToken: `mock-jwt-token-${user.id}`,
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 800);
    });
  },

  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
  },

  getMe: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_USERS[0]), 400);
    });
  },

  refreshToken: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ accessToken: 'new-mock-token' }), 400);
    });
  },

  changePassword: async (currentPassword, newPassword) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 600);
    });
  },

  forgotPassword: async (email) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 600);
    });
  },

  resetPassword: async (email, otp, newPassword) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 600);
    });
  },

  verifyEmail: async (email, otp) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 600);
    });
  }
};
