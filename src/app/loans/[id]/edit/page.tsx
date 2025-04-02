"use client";
import { notFound } from "next/navigation";
import  prisma  from "@/lib/prisma";
import { LoanForm, LoanFormValues } from "@/components/loan-form";
import { updateLoan } from "@/actions/loan-actions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 

export default function EditLoanPage({params,}: {params: { id: string };}) {
   const [loan, setLoan] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const router = useRouter();
   
   
   useEffect(() => {
     const fetchLoan = async () => {
       try {
         const response = await fetch(`/api/loans/${params.id}`);
         if (!response.ok) throw new Error("Failed to fetch loan");
         const data = await response.json();
         setLoan(data);
       } catch (error) {
         console.error("Error fetching loan:", error);
       } finally {
         setLoading(false);
       }
     };
     fetchLoan();
   }, [params.id]);
   
 
   if (loading) return <p>Loading...</p>;
   if (!loan) return <p>Loan not found</p>;
 
  async function handleUpdateLoan (values: LoanFormValues){
    try {
      if(loan != null){

        updateLoan(loan.id ,values); 
        toast.success("Success");
        router.push("/loans/"+loan.id);
      }
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
