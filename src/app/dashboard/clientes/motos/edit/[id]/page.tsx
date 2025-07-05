'use client'
import MotoClienteForm from '@/components/motoClientes/MotosClienteForm'
import { useToast } from '@/components/ui/use-toast'
import { fetchOneMotoCliente } from '@/lib/data'
import React, { useEffect, useState } from 'react'

function Page({ params }: { params: { id: number } }) {
  const [moto, setMoto] = useState(undefined)
  const { toast } = useToast()

  useEffect(() => {
    fetchMotoCliente()
  }, [])

  const fetchMotoCliente = async () => {
    try {
      const data = await fetchOneMotoCliente(params.id)
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
  return <MotoClienteForm moto={moto ?? null} />
}

export default Page
