'use client'

import MotoMercadoForm from '@/components/repuestos/motos/MotosMercadoForm'
import { useToast } from '@/components/ui/use-toast'
import { fetchOneMotoRepuesto } from '@/lib/data'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function Page({ params }: { params: { id: number } }) {
  const [moto, setMoto] = useState(undefined)
  const { toast } = useToast()
  const router = useRouter()
  const rol = localStorage.getItem('rol')

  if (rol !== 'ADMINISTRADOR') {
    toast({
      title: 'Error',
      description: 'No tienes permisos para editar una moto.',
      variant: 'destructive',
    })
    return router.push('/dashboard/repuestos/motos')
  }

  useEffect(() => {
    fetchMotoRepuesto()
  }, [])

  const fetchMotoRepuesto = async () => {
    try {
      const data = await fetchOneMotoRepuesto(params.id)
      setMoto(data)
    } catch (error) {
      console.error('Fetch error:', error)
      toast({
        title: 'Error',
        description: 'No se pudo obtener el cliente. Intenta de nuevo.',
        variant: 'destructive',
      })
    }
  }
  return <MotoMercadoForm moto={moto ?? null} />
}

export default Page
