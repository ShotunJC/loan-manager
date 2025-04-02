"use client";

import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { assessLoanRisk } from "@/lib/ai-services";
import { confirmLoan, declineLoan } from "@/actions/loan-actions";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useRouter } from "next/navigation"; 

export default function LoanDetailPage({ params }: { params: { id: string } }) {
  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState("");
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

  const handleAssessRisk = async () => {
    try {
      const assessment = await assessLoanRisk(loan);
      setAssessmentResult(assessment);
      setShowModal(true);
    } catch (error) {
      console.error("Error:", error);
      setAssessmentResult("Could not complete risk assessment");
      setShowModal(true);
    }
  };

  async function handleConfirm() {
    if (loan) {
      await confirmLoan(loan.id);
      setShowModal(false);
      router.push("/loans/"+loan.id);

    }
  }

  async function handleDecline() {
    if (loan) {
      await declineLoan(loan.id);
      setShowModal(false);
      router.push("/loans/"+loan.id);

    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Loan Details</h1>
        <div className="flex gap-2">
          {loan.status === "PENDING" && (
            <Button onClick={handleAssessRisk} variant="outline">Assess Risk</Button>
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
            <p>{new Date(loan.startDate).toLocaleDateString()}</p>
          </div>
          {loan.description && (
            <div className="md:col-span-2">
              <h3 className="font-medium">Description</h3>
              <p>{loan.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal for Risk Assessment */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Risk Assessment</DialogTitle>
            <DialogDescription>{assessmentResult}</DialogDescription>
          </DialogHeader>
          {loan.status === "PENDING" && (
            <div className="flex gap-2 justify-end">
              <Button onClick={handleConfirm} variant="default">Confirm</Button>
              <Button onClick={handleDecline} variant="destructive">Decline</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
