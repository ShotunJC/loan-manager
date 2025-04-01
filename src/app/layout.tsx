import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SonnerProvider } from '@/components/toaster-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Loan Manager',
  description: 'Manage your loans efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SonnerProvider />
        {children}
      </body>
    </html>
  )
}