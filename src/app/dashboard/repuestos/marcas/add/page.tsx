'use client'

import MarcaRepuestoForm from '@/components/repuestos/marcas/MarcasRepuestosForm'
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
      description: 'No tienes permisos para agregar una marca.',
      variant: 'destructive',
    })
    return router.push('/dashboard/repuestos/marcas')
  }

  return <MarcaRepuestoForm marcaRepuesto={null} />
}

export default Page
