'use client'
// React and Next.js hooks
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Utility functions
import { fetchOneOrdenServicio } from '@/lib/data'

// Components
import OrdenServicioForm from '@/components/ordenServicio/OrdenServicioForm'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function EditOrdenServicioPage({
  params,
}: {
  params: {
    id: number
  }
}) {
  const [initialData, setInitialData] = useState(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchOrdenServicio = async () => {
      try {
        const data = await fetchOneOrdenServicio(params.id)
        setInitialData(data)
      } catch (error) {
        console.error('Error fetching orden servicio:', error)
        toast({
          title: 'Error',
          description:
            'No se pudo cargar la orden de servicio. Por favor, intente de nuevo.',
          variant: 'destructive',
        })
      }
    }

    fetchOrdenServicio()
  }, [params.id, toast])

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orden-servicio/${params.id}`,
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
          `${responseData.message}.
           Revisa posibles duplicados en repuestos o servicios.` ||
            'No se pudo actualizar la orden de servicio.'
        )
      }
      toast({
        title: 'Éxito',
        description:
          'La orden de servicio ha sido actualizada exitosamente. ✅',
      })
      if (responseData.factura) {
        router.push(
          `/dashboard/facturas/view/${responseData.factura.id_factura}`
        )
      } else {
        router.push(`/dashboard/ordenServicio/view/${params.id}`)
      }
    } catch (error) {
      console.error('Error updating orden servicio:', error)
      toast({
        title: 'Error',
        description:
          error.message  ||
          'No se pudo actualizar la orden de servicio. Intenta de nuevo.',
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
      <h1 className="text-2xl font-bold mb-5">Editar Orden de Servicio</h1>
      <Link href="/dashboard/ordenServicio">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </Link>
      <OrdenServicioForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  )
}
