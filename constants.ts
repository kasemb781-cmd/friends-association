
import { User, Income, Expense, Investment, Notice } from './types';

export const ADMIN_EMAIL = 'friendsassociationfeni2025@gmail.com';
export const ADMIN_PASSWORD = 'Fa@2025';

export const INITIAL_MEMBERS: User[] = [
  {
    id: 'admin-1',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    fullName: 'Association Admin',
    idNumber: '1234567890',
    idType: 'NID',
    mobile: '01700000000',
    nomineeId: '0987654321',
    nomineeIdType: 'NID',
    occupation: 'Businessman',
    address: {
      village: 'Feni Town',
      road: 'Main Road',
      thana: 'Feni Sadar',
      district: 'Feni',
      division: 'Chattogram'
    },
    role: 'ADMIN',
    status: 'APPROVED',
    shares: 0,
    createdAt: '2025-01-01'
  }
];

export const INITIAL_INCOMES: Income[] = [
  { id: 'inc-1', memberId: 'm-1', memberName: 'John Doe', amount: 5000, date: '2025-01-15', type: 'Monthly', description: 'January Contribution' },
  { id: 'inc-2', memberId: 'm-2', memberName: 'Jane Smith', amount: 5000, date: '2025-01-16', type: 'Monthly', description: 'January Contribution' },
];

export const INITIAL_EXPENSES: Expense[] = [
  { 
    id: 'exp-1', 
    name: 'Stationary', 
    amount: 200, 
    date: '2025-01-10', 
    description: 'Bought notebooks for records',
    responsibleMemberIds: ['admin-1'],
    responsibleMemberNames: ['Association Admin']
  },
];

export const INITIAL_INVESTMENTS: Investment[] = [
  { 
    id: 'inv-1', 
    investNo: 'INV-001',
    type: 'Land', 
    amount: 500000, 
    responsibleMemberId: 'admin-1',
    responsibleMemberName: 'Association Admin',
    nature: 'Permanent',
    date: '2025-01-05', 
    status: 'ACTIVE', 
    description: 'Investment in Feni commercial land' 
  },
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: { en: 'Annual General Meeting', bn: 'বার্ষিক সাধারণ সভা' },
    content: { en: 'The AGM for 2025 will be held on February 10th.', bn: '২০২৫ সালের বার্ষিক সাধারণ সভা ১০ ফেব্রুয়ারি অনুষ্ঠিত হবে।' },
    date: '2025-01-20',
    author: 'Admin'
  }
];
