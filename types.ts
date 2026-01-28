
export type Language = 'en' | 'bn';

export type UserRole = 'ADMIN' | 'MEMBER' | 'EXECUTIVE' | 'AUDITOR' | 'PRESIDENT';

export interface User {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  idNumber: string;
  idType: 'NID' | 'Passport' | 'Birth Certificate';
  mobile: string;
  nomineeId: string;
  nomineeIdType: 'NID' | 'Passport' | 'Birth Certificate';
  profilePic?: string;
  occupation: 'Expatriate' | 'Businessman' | 'Student' | 'Job Holder';
  shares: number;
  address: {
    village: string;
    road: string;
    thana: string;
    district: string;
    division: string;
  };
  role: UserRole;
  status: 'PENDING' | 'APPROVED';
  createdAt: string;
}

// Added Income interface used in constants.ts
export interface Income {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  type: string;
  description: string;
}

export interface Contribution {
  id: string;
  invoiceNo: string;
  memberId: string;
  memberName: string;
  amount: number;
  month: string;
  year: string;
  purpose: string[]; // Monthly, Yearly, Penalty, Service Fee
  date: string;
  generatedBy: string; // User ID
}

export type InvestType = 'Land' | 'Business Invest' | 'Own Business' | 'Personal Invest' | 'Gold' | 'Purchase' | 'Others';
export type InvestNature = 'Temporary' | 'Permanent' | 'Flexible';

export interface Investment {
  id: string;
  investNo: string;
  type: InvestType;
  amount: number;
  responsibleMemberId: string;
  responsibleMemberName: string;
  nature: InvestNature;
  date: string;
  status: 'ACTIVE' | 'COMPLETED';
  description: string;
  images?: string[];
}

export interface Profit {
  id: string;
  investId: string;
  investNo: string;
  amount: number;
  date: string;
  responsibleMemberName: string;
}

export interface Expense {
  id: string;
  name: 'Stationary' | 'Food' | 'Documentary' | 'Traveling' | 'Broker' | 'Others';
  amount: number;
  responsibleMemberIds: string[];
  responsibleMemberNames: string[];
  date: string;
  description: string;
  images?: string[];
}

export interface Notice {
  id: string;
  title: { en: string; bn: string };
  content: { en: string; bn: string };
  date: string;
  author: string;
}
