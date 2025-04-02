"use client"
import { notFound, redirect } from "next/navigation";
import  prisma  from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { assessLoanRisk } from "@/lib/ai-services";
import { confirmLoan, declineLoan } from "@/actions/loan-actions";
import { toast } from "sonner";
import { LoanStatus } from "@/types/loan";

export default async function LoanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const loan = await prisma.loan.findUnique({
    where: { id: await params.id },
  });
  if (!loan) {
    notFound();
  }


   const handleAssessRisk = async () => {
      try {
        const assessment = await assessLoanRisk(loan);

        toast.success("AI Risk Assessment",{
          description: assessment,
          action: loan.status === "PENDING" ? (
            <div className="flex gap-2">
              <form action={handleConfirm}>
                <Button variant="default" size="sm">Confirm</Button>
              </form>
              <form action={handleDecline}>
                <Button variant="destructive" size="sm">Decline</Button>
              </form>
            </div>
          ) : undefined});
      } catch (error) {
        toast.info( "Assessment Failed",{
          description: "Could not complete risk assessment",
        });
        console.error("Error:", error);
      }
    };

    

    async function handleConfirm() {
      await confirmLoan(loan.id);

    };

    async function handleDecline() {
      await declineLoan(loan.id);

    }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Loan Details</h1>
        <div className="flex gap-2">
          {loan.status === "PENDING" && (
            <form action={handleAssessRisk}>
              <Button variant="outline">Assess Risk</Button>
            </form>
          )}
          <Link href={`/loans/${loan.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <Link href="/loans">
            <Button>Back to List</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan #{loan.id.slice(0, 8)}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Borrower</h3>
            <p>{loan.borrower}</p>
          </div>
          <div>
            <h3 className="font-medium">Amount</h3>
            <p>${loan.amount.toString()}</p>
          </div>
          <div>
            <h3 className="font-medium">Interest Rate</h3>
            <p>{loan.interestRate.toString()}%</p>
          </div>
          <div>
            <h3 className="font-medium">Term</h3>
            <p>{loan.term} months</p>
          </div>
          <div>
            <h3 className="font-medium">Status</h3>
            <p>{loan.status}</p>
          </div>
          <div>
            <h3 className="font-medium">Start Date</h3>
            <p>{loan.startDate.toLocaleDateString()}</p>
          </div>
          {loan.description && (
            <div className="md:col-span-2">
              <h3 className="font-medium">Description</h3>
              <p>{loan.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}