'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const rol = localStorage.getItem('rol')
    if (rol === 'ADMINISTRADOR') {
      setIsLoading(false)
    } else {
      router.push('/dashboard')
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <div className='overflow-auto md:pb-8'>{children}</div>
}
