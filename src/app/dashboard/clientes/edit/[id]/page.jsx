'use client'

import React, { useEffect, useState } from 'react'

import ClienteForm from '@/components/clientes/ClienteForm'
import { useToast } from '@/components/ui/use-toast'
import { fetchOneCliente } from '@/lib/data'

function Page({ params }) {
  const [cliente, setCliente] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOneCliente(params.id)
        setCliente(data)
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

  return <ClienteForm cliente={cliente ?? null} />
}

export default Page
