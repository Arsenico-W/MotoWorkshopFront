'use client'

import React, { useEffect, useState } from 'react'

import { useToast } from '@/components/ui/use-toast'
import { fetchOneProveedor } from '@/lib/data'
import ProveedorForm from '@/components/proveedores/ProveedorForm'
import { useRouter } from 'next/navigation'

function Page({ params }: { params: { id: number } }) {
  const [proveedor, setProveedor] = useState(undefined)
  const router = useRouter()
  const { toast } = useToast()
  const rol = localStorage.getItem('rol')

  if (rol !== 'ADMINISTRADOR') {
    toast({
      title: 'Error',
      description: 'No tienes permisos para editar un proveedor.',
      variant: 'destructive',
    })
    return router.push('/dashboard/proveedores')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOneProveedor(params.id)
        setProveedor(data)
      } catch (error) {
        console.log(error)
        toast({
          title: 'Error',
          description: 'No se pudo obtener el proveedor. Intenta de nuevo.',
          variant: 'destructive',
        })
      }
    }
    fetchData()
  }, [params.id])

  return <ProveedorForm proveedor={proveedor ?? null} />
}

export default Page
