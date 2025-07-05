'use client'

import { useEffect, useState } from 'react'
import { fetchOneVenta } from '@/lib/data'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import VentaDirectaForm from '@/components/facturas/ventas/VentaDirectaForm'

export default function EditVentaDirectaPage({
  params,
}: {
  params: {
    id: number
  }
}) {
  const [initialData, setInitialData] = useState(null)
  const { toast } = useToast()
  const router = useRouter()
  const rol = localStorage.getItem('rol')

  if (rol !== 'ADMINISTRADOR') {
    toast({
      title: 'Error',
      description: 'No tienes permisos para editar una venta.',
      variant: 'destructive',
    })
    return router.push('/dashboard/facturas/ventas')
  }

  useEffect(() => {
    const fetchVentaDirecta = async () => {
      try {
        const data = await fetchOneVenta(params.id)
        setInitialData(data)
      } catch (error) {
        console.error('Error fetching venta :', error)
        toast({
          title: 'Error',
          description:
            'No se pudo cargar la venta . Por favor, intente de nuevo.',
          variant: 'destructive',
        })
      }
    }

    fetchVentaDirecta()
  }, [params.id, toast])

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/venta-directa/${params.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(data),
        }
      )

      const responseData = await response.json()
      console.log('responseData:', responseData)
      if (!response.ok) {
        throw new Error(
          `${responseData.message}. Revisa posibles duplicados en los repuestos.`  || 'No se pudo actualizar la venta.'
        )
      }
      toast({
        title: 'Éxito',
        description: 'La venta ha sido actualizada exitosamente. ✅',
      })
      if (responseData.factura) {
        router.push(
          `/dashboard/facturas/view/${responseData.factura.id_factura}`
        )
      } else {
        router.push(`/dashboard/facturas/view/${params.id}`)
      }
    } catch (error) {
      console.error('Error updating venta:', error)
      toast({
        title: 'Error',
        description:
          error.message ||
          'No se pudo actualizar la venta. Intenta de nuevo.',
        variant: 'destructive',
      })
    }
  }

  if (!initialData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Editar Venta</h1>
      <Link href="/dashboard/facturas/ventas">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </Link>
      <VentaDirectaForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  )
}
