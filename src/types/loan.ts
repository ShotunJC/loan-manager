//import { LoanStatus as PrismaLoanStatus } from '@prisma/client';

export type Loan = {
  id: string;
  amount: number;
  interestRate: number;
  term: number;
  status: LoanStatus;
  borrower: string;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  description?: string;
};

export const LoanStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ACTIVE: 'ACTIVE',
  PAID: 'PAID',
  DEFAULTED: 'DEFAULTED',
} as const;

export type LoanStatus = typeof LoanStatus[keyof typeof LoanStatus];