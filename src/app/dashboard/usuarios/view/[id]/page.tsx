'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { fetchOneUsuario } from '@/lib/data'

export default function ViewProveedorPage({
  params,
}: {
  params: { id: number }
}) {
  const [usuario, setUsuario] = useState(undefined)
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    fetchUsuario()
  }, [id])

  const fetchUsuario = async () => {
    try {
      const data = await fetchOneUsuario(id)
      setUsuario(data)
    } catch (error) {
      console.error('Error fetching servicio:', error)
    }
  }

  if (!usuario) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col lg:flex-row gap-4 justify-center">
        <Card className="w-full lg:w-1/2">
          <CardHeader>
            <CardTitle>Ver usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div>
                <strong>Nombre:</strong> {usuario.nombre_usuario}
              </div>
            </div>
            <div className="grid w-full items-center gap-4">
              <div>
                <strong>Email:</strong> {usuario.email}
              </div>
            </div>
            <div className="grid w-full items-center gap-4">
              <div>
                <strong>Rol:</strong> {usuario.rol}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/dashboard/usuarios')}>
              Volver
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
