import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import 'react-toastify/dist/ReactToastify.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MotoWorkShop',
  description: 'Gestiona tu taller y tienda de forma sencilla',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}flex flex-col min-h-screen overflow-hidden`}>
        <Toaster />
        {children}
      </body>
    </html>
  )
}
