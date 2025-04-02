"use client"; 
import { LoanForm, LoanFormValues } from "@/components/loan-form";
import { createLoan } from "@/actions/loan-actions";
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CreateLoanPage() {
  const router = useRouter();

  const handleCreateLoan = async (values: LoanFormValues) => {
    try {
      await createLoan(values); 
      toast.success("Loan created successfully!");
      router.push("/loans");
    } catch (error) {
      toast.error("Failed to create loan");
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Loan</h1>
        <Link href="/loans">
          <Button variant="outline">Back to List</Button>
        </Link>
      </div>
      <div className="max-w-2xl mx-auto">
        <LoanForm action={handleCreateLoan} />
      </div>
    </div>
  );
}
