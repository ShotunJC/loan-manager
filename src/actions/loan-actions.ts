"use server";

import  prisma  from "@/lib/prisma";
import { LoanFormValues } from "@/components/loan-form";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createLoan(data: LoanFormValues) {
  try {
    await prisma.loan.create({ data });
    return { success: true, message: "Loan created!" };
  } catch (error) {
    return { success: false, message: "Failed to create loan" };
  }
}

export async function updateLoan(id: string, values: LoanFormValues) {
  try {
    await prisma.loan.update({
      where: { id },
      data: {
        borrower: values.borrower,
        amount: parseFloat(values.amount),
        interestRate: parseFloat(values.interestRate),
        term: parseInt(values.term),
        status: values.status,
        startDate: new Date(values.startDate),
        description: values.description,
      },
    });

    revalidatePath("/loans");
    revalidatePath(`/loans/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating loan:", error);
    return { success: false, error: "Failed to update loan" };
  }
}

export async function confirmLoan(formData: FormData) {
  const loanId = formData.get("loanId") as string;
  await prisma.loan.update({
    where: { id: loanId },
    data: { status: "APPROVED" },
  });
  redirect(`/loans/${loanId}`);
}

export async function declineLoan(formData: FormData) {
  const loanId = formData.get("loanId") as string;
  await prisma.loan.update({
    where: { id: loanId },
    data: { status: "REJECTED" },
  });
  redirect(`/loans/${loanId}`);
}