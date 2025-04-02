// src/app/api/loans/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const loan = await prisma.loan.findUnique({
      where: { id: params.id },
    });
    if (!loan) return NextResponse.json({ error: "Loan not found" }, { status: 404 });

    return NextResponse.json(loan);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching loan" }, { status: 500 });
  }
}
