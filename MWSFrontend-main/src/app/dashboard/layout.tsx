'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import SideNav from '@/components/dashboard/sidenav'
import { MotoWorkShopLoader } from '@/components/MotoWorkShopLoader'
import NotificationBubble from '@/components/NotificacionBubble'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      router.push('/login')
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <MotoWorkShopLoader />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 transform bg-white transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <span className="text-lg font-semibold">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          <SideNav onClose={() => setIsSidebarOpen(false)} />
        </div>
      </div>

      {/* Sidebar for tablet and desktop */}
      <div className="hidden md:block md:w-64 lg:w-72 xl:w-80 md:flex-shrink-0 md:overflow-y-auto md:bg-white">
        <SideNav onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <div className="flex items-center space-x-4 ml-auto">
              {typeof window !== 'undefined' && localStorage.getItem('userName') && (
                <span className="hidden text-sm text-gray-700 sm:inline-block">
                  Bienvenido, <strong>{localStorage.getItem('userName')}</strong>
                </span>
              )}
              <NotificationBubble />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto pb-16 md:pb-4">
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}


