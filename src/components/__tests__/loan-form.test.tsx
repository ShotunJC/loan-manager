import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoanForm } from "@/components/loan-form";
import { LoanStatus } from "@/types/loan";
import "@testing-library/jest-dom";

describe("LoanForm", () => {
  it("renders correctly", () => {
    render(<LoanForm action={jest.fn()} />);
    
    expect(screen.getByLabelText("Borrower")).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
    expect(screen.getByLabelText("Interest Rate (%)")).toBeInTheDocument();
    expect(screen.getByLabelText("Term (months)")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("shows validation errors", async () => {
    render(<LoanForm action={jest.fn()} />);
    
    fireEvent.click(screen.getByText("Save"));
    
    expect(await screen.findByText("Borrower name must be at least 2 characters.")).toBeInTheDocument();
    expect(await screen.findByText("Amount must be a valid number.")).toBeInTheDocument();
    expect(await screen.findByText("Interest rate must be a valid number.")).toBeInTheDocument();
    expect(await screen.findByText("Term must be a valid integer.")).toBeInTheDocument();
    expect(await screen.findByText("Start date is required.")).toBeInTheDocument();
  });
});