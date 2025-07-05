'use client'

import MotoMercadoForm from '@/components/repuestos/motos/MotosMercadoForm'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import React from 'react'

function Page() {
  const router = useRouter()
  const { toast } = useToast()
  const rol = localStorage.getItem('rol')
  if (rol !== 'ADMINISTRADOR') {
    toast({
      title: 'Error',
      description: 'No tienes permisos para agregar una moto.',
      variant: 'destructive',
    })
    return router.push('/dashboard/repuestos/motos')
  }
  return <MotoMercadoForm moto={null} />
}

export default Page
