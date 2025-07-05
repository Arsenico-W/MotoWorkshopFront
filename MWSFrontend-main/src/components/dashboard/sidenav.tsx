'use client'

// React imports
import { useEffect, useState } from 'react'

// Next.js imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// Icon imports
import { PowerIcon, X } from 'lucide-react'

// Component imports
import { Button } from '@/components/ui/button'
import AdminNavLinks from './admin-nav-links'
import VendedorNavLinks from './vendedor-nav-links'

interface SideNavProps {
  onClose?: () => void
}

export default function SideNav({ onClose }: SideNavProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsAdmin(localStorage.getItem('rol') === 'ADMINISTRADOR')
  }, [])

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }

  const logout = () => {
    // Eliminar de localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
    localStorage.removeItem('userName')

    // Eliminar cookies
    deleteCookie('token')
    deleteCookie('rol')

    router.push('/')
  }

  return (
    <div className="flex h-full flex-col bg-white shadow-md">
      <div className="flex items-center justify-between p-4 md:justify-start">
        <Link
          className="flex h-20 items-center justify-start md:h-40 md:bg-black md:rounded-b-2xl md:p-4"
          href="/dashboard"
        >
          <Image
            src="/logo.svg"
            alt="Motoworkshop Logo"
            width={160}
            height={40}
            priority
          />
        </Link>
        <button onClick={onClose} className="md:hidden">
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-grow overflow-y-auto px-4 py-2">
        {isAdmin ? <AdminNavLinks /> : <VendedorNavLinks />}
      </nav>

      <div className="p-4 sticky">
        <Button
          onClick={logout}
          className="w-full bg-orange-500 text-white hover:bg-orange-600"
        >
          <PowerIcon className="mr-2 h-4 w-4" /> Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
