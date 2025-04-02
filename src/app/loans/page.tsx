import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { LoanStatus } from "@/types/loan";

interface Loan {
  id: string;
  borrower: string;
  amount: number;
  interestRate: number;
  term: number;
  status: LoanStatus;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  description?: string | null;
}

export default async function LoansPage() {
  const loans: Loan[] = await prisma.loan.findMany({
    orderBy: { createdAt: "desc" },
  });

  const getStatusClass = (status: LoanStatus) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Loan Management</h1>
        <Link href="/loans/create">
          <Button>Create New Loan</Button>
        </Link>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Borrower</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Term</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan: Loan) => (
              <TableRow key={loan.id}>
                <TableCell>{loan.borrower}</TableCell>
                <TableCell>${loan.amount.toFixed(2)}</TableCell>
                <TableCell>{loan.interestRate.toFixed(2)}%</TableCell>
                <TableCell>{loan.term} months</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(loan.status)}`}>
                    {loan.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Link href={`/loans/${loan.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}