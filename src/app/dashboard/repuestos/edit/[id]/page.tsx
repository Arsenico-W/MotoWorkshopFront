'use client'

import React, { useEffect, useState } from 'react'

import { useToast } from '@/components/ui/use-toast'
import { fetchOneRepuesto } from '@/lib/data'
import RepuestoForm from '@/components/repuestos/RepuestosForm'
import { useRouter } from 'next/navigation'

function Page({ params }: { params: { id: number } }) {
  const [repuesto, setRepuesto] = useState(undefined)
  const { toast } = useToast()
  const router = useRouter()
  const rol = localStorage.getItem('rol')

  if(rol !== 'ADMINISTRADOR') {
    toast({
      title: 'Error',
      description: 'No tienes permisos para editar un repuesto.',
      variant: 'destructive',
    })
    return router.push('/dashboard/repuestos')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOneRepuesto(params.id)
        setRepuesto(data)
      } catch (error) {
        console.log(error)
        toast({
          title: 'Error',
          description: 'No se pudo obtener el cliente. Intenta de nuevo.',
          variant: 'destructive',
        })
      }
    }
    fetchData()
  }, [params.id])

  return <RepuestoForm repuesto={repuesto ?? null} />
}

export default Page
