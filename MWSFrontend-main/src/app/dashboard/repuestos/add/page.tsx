'use client'

import RepuestoForm from '@/components/repuestos/RepuestosForm'
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
      description: 'No tienes permisos para agregar un repuesto.',
      variant: 'destructive',
    })
    return router.push('/dashboard/repuestos')
  }

  return <RepuestoForm repuesto={null} />
}

export default Page
