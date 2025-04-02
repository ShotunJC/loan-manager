"use client"; // Required for client-side interactivity

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // Using Sonner for toasts
import { Loan } from "@/types/loan";

// Define form schema
const formSchema = z.object({
  borrower: z.string().min(2, "Borrower name must be at least 2 characters"),
  amount: z.number().positive("Amount must be greater than zero"),
  interestRate: z.number().min(0, "Interest rate must be at least 0%"),
  term: z.number().int().positive("Term must be a positive integer"),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "ACTIVE", "PAID", "DEFAULTED"]),
  startDate: z.date(),
  description: z.string().nullable().optional(),
});

export type LoanFormValues = z.infer<typeof formSchema>;

interface LoanFormProps {
  action: (values: LoanFormValues) => Promise<void>;
  loan?: Partial<LoanFormValues>;
}

export function LoanForm({ action, loan }: LoanFormProps) {
  const form = useForm<LoanFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      borrower: loan?.borrower || "",
      amount: loan?.amount ?? 10000,
      interestRate: loan?.interestRate ?? 5.5,
      term: loan?.term ?? 12,
      status: loan?.status || "PENDING",
      startDate: loan?.startDate ? new Date(loan.startDate) : new Date(),
      description: loan?.description || "",
    },
  });

  const handleSubmit = async (values: LoanFormValues) => {
    try {
      await action(values);
      toast.success("Loan saved successfully");
    } catch (error) {
      toast.error("Failed to save loan");
      console.error("Submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="borrower"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Borrower</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="1000.00"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="5.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="term"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Term (months)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["PENDING", "APPROVED", "REJECTED", "ACTIVE", "PAID", "DEFAULTED"].map(
                      (status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Field - Using Controller for Proper Handling */}
          <Controller
            control={form.control}
            name="startDate"
            render={({ field }) => {
              const dateValue = field.value ? field.value.toISOString().split("T")[0] : "";
              return (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={dateValue}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
              <Textarea 
                placeholder="Loan purpose or additional details" 
                {...field} 
                value={field.value ?? ""} 
              />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
