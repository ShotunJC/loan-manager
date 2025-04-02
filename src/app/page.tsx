// /app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="container mx-auto py-12 text-center">
      <h1 className="text-3xl font-bold mb-6">Loan Management System</h1>
      <p className="text-lg mb-8">Manage loans efficiently with our platform</p>
      
      <div className="flex justify-center gap-4">
        <Link href="/loans">
          <Button>View Loans</Button>
        </Link>
        <Link href="/loans/create">
          <Button variant="outline">Create New Loan</Button>
        </Link>
      </div>
    </div>
  );
}