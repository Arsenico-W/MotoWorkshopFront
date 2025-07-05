'use client'

import FormularioProveedor from '@/components/proveedores/ProveedorForm'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import React from 'react'

function page() {
  const router = useRouter()
  const { toast } = useToast()
  const rol = localStorage.getItem('rol')

  if (rol !== 'ADMINISTRADOR') {
    toast({
      title: 'Error',
      description: 'No tienes permisos para agregar un proveedor.',
      variant: 'destructive',
    })
    return router.push('/dashboard/proveedores')
  }
  return <FormularioProveedor proveedor={null} />
}

export default page
