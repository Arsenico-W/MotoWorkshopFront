'use client'

import React, { useEffect, useState } from 'react'

import { useToast } from '@/components/ui/use-toast'
import { fetchOneServicio } from '@/lib/data'
import { useRouter } from 'next/navigation'
import ServicioForm from '@/components/servicios/ServiciosForm'

function Page({ params }: { params: { id: number } }) {
  const [servicio, setServicio] = useState(undefined)
  const { toast } = useToast()
  const router = useRouter()
  const rol = localStorage.getItem('rol')

  if (rol !== 'ADMINISTRADOR') {
    toast({
      title: 'Error',
      description: 'No tienes permisos para editar un servicio.',
      variant: 'destructive',
    })
    return router.push('/dashboard/servicios')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOneServicio(params.id)
        setServicio(data)
      } catch (error) {
        console.log(error)
        toast({
          title: 'Error',
          description: 'No se pudo obtener el servicio. Intenta de nuevo.',
          variant: 'destructive',
        })
      }
    }
    fetchData()
  }, [params.id])

  return <ServicioForm servicio={servicio ?? null} />
}

export default Page
