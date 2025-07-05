'use client'

import React, { useEffect, useState } from 'react'

import { useToast } from '@/components/ui/use-toast'
import { fetchOneUsuario } from '@/lib/data'
import { useRouter } from 'next/navigation'
import UserForm from '@/components/usuarios/UsuariosForm'

function Page({ params }: { params: { id: number } }) {
  const [usuario, setUsuario] = useState(undefined)
  const { toast } = useToast()
  const router = useRouter()
  const rol = localStorage.getItem('rol')

  if (rol !== 'ADMINISTRADOR') {
    toast({
      title: 'Error',
      description: 'No tienes permisos para editar un usuario.',
      variant: 'destructive',
    })
    return router.push('/dashboard/usuarios')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOneUsuario(params.id)
        setUsuario(data)
      } catch (error) {
        console.log(error)
        toast({
          title: 'Error',
          description: 'No se pudo obtener el usuario. Intenta de nuevo.',
          variant: 'destructive',
        })
      }
    }
    fetchData()
  }, [params.id])

  return <UserForm user={usuario ?? null} />
}

export default Page
