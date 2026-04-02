/**
 * Expanded Mock Data for Class Pilot
 */

export const INITIAL_TEACHERS = [
  { id: 't1', name: 'John Smith', email: 'john@example.com', subject: 'Mathematics', status: 'ACTIVE', phone: '01712345678' },
  { id: 't2', name: 'Sarah Wilson', email: 'sarah@example.com', subject: 'Physics', status: 'ACTIVE', phone: '01712345679' },
  { id: 't3', name: 'Michael Brown', email: 'michael@example.com', subject: 'Chemistry', status: 'INACTIVE', phone: '01712345680' },
];

export const INITIAL_STUDENTS = [
  { id: 's1', name: 'Alice Johnson', email: 'alice@example.com', batchId: 'b1', status: 'ACTIVE', phone: '01812345671' },
  { id: 's2', name: 'Bob Smith', email: 'bob@example.com', batchId: 'b1', status: 'ACTIVE', phone: '01812345672' },
  { id: 's3', name: 'Charlie Davis', email: 'charlie@example.com', batchId: 'b2', status: 'ACTIVE', phone: '01812345673' },
  { id: 's4', name: 'Diana Prince', email: 'diana@example.com', batchId: 'b2', status: 'INACTIVE', phone: '01812345674' },
];

export const INITIAL_BATCHS = [
  { id: 'b1', name: 'Batch A - Class 9', teacherId: 't1', schedule: 'Sun-Tue-Thu 10:00 AM', studentCount: 2 },
  { id: 'b2', name: 'Batch B - Class 10', teacherId: 't2', schedule: 'Mon-Wed 04:00 PM', studentCount: 2 },
];

export const INITIAL_ATTENDANCE = [
  { id: 'a1', batchId: 'b1', date: '2026-03-28', records: [{ studentId: 's1', status: 'PRESENT' }, { studentId: 's2', status: 'ABSENT' }] },
];

export const INITIAL_FEES = [
  { id: 'f1', studentId: 's1', month: 'March', year: 2026, amount: 2000, status: 'PAID' },
  { id: 'f2', studentId: 's2', month: 'March', year: 2026, amount: 2000, status: 'PENDING' },
];
