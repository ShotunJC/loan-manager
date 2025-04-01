"use client";
import { notFound } from "next/navigation";
import  prisma  from "@/lib/prisma";
import { LoanForm, LoanFormValues } from "@/components/loan-form";
import { updateLoan } from "@/actions/loan-actions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default async function EditLoanPage({
  params,
}: {
  params: { id: string };
}) {
  const loan = await prisma.loan.findUnique({
    where: { id: params.id },
  });

  if (!loan) {
    notFound();
  }
  async function handleUpdateLoan (values: LoanFormValues){
    try {
       updateLoan(loan.id ,values); 
      toast.success("Success");
      redirect(`/loans/${loan.id}`);
    } catch (error) {
        toast.error("Error");
        console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Loan</h1>
        <Link href={`/loans/${loan.id}`}>
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      <div className="max-w-2xl mx-auto">
        <LoanForm loan={loan} action={handleUpdateLoan} />
      </div>
    </div>
  );
}
