'use client'

import MarcaRepuestoForm from '@/components/repuestos/marcas/MarcasRepuestosForm'
import { useToast } from '@/components/ui/use-toast'
import { fetchOneMarcaRepuesto } from '@/lib/data'
import { MarcaRepuesto } from '@/lib/interfaces'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function Page({ params }: { params: { id: number } }) {
  const [marca, setMarca] = useState(undefined)
  const { toast } = useToast()
  const router = useRouter()
  const rol = localStorage.getItem('rol')

  if (rol !== 'ADMINISTRADOR') {
    toast({
      title: 'Error',
      description: 'No tienes permisos para editar una marca.',
      variant: 'destructive',
    })
    return router.push('/dashboard/repuestos/marcas')
  }

  useEffect(() => {
    fetchMarcaRepuesto()
  }, [])

  const fetchMarcaRepuesto = async () => {
    try {
      const data = await fetchOneMarcaRepuesto(params.id)
      setMarca(data)
    } catch (error) {
      console.error('Fetch error:', error)
      toast({
        title: 'Error',
        description: 'No se pudo obtener. Intenta de nuevo.',
        variant: 'destructive',
      })
    }
  }
  return <MarcaRepuestoForm marcaRepuesto={marca ?? null} />
}

export default Page
