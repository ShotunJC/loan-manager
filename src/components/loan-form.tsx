"use client"; // Required for client-side interactivity

import { useForm } from "react-hook-form";
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

// Define form schema
const formSchema = z.object({
  borrower: z.string().min(2, "Borrower name must be at least 2 characters"),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  interestRate: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid interest rate"),
  term: z.string().regex(/^\d+$/, "Term must be a number"),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "ACTIVE", "PAID", "DEFAULTED"]),
  startDate: z.string().min(1, "Start date is required"),
  description: z.string().optional(),
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
      amount: loan?.amount?.toString() || "",
      interestRate: loan?.interestRate?.toString() || "",
      term: loan?.term?.toString() || "",
      status: loan?.status || "PENDING",
      startDate: loan?.startDate ? new Date(loan.startDate).toISOString().split("T")[0] : "",
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
                  <Input type="number" step="0.01" placeholder="1000.00" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["PENDING", "APPROVED", "REJECTED", "ACTIVE", "PAID", "DEFAULTED"].map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
                  className="resize-none"
                  {...field}
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
