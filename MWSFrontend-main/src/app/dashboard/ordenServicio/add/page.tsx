'use client'
// React and Next.js hooks
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Next.js components
import Link from 'next/link'

// Icons
import { ArrowLeft } from 'lucide-react'

// Custom components
import OrdenServicioForm from '@/components/ordenServicio/OrdenServicioForm'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function AddOrdenServicioPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orden-servicio`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(
          `${error.message}.
           Revisa posibles duplicados en repuestos o servicios.` ||
            'No se pudo crear la orden de servicio.'
        )
      }

      const createdData = await response.json()
      console.log('Orden de servicio creada:', createdData)

      toast({
        title: 'Éxito',
        description: 'La orden de servicio ha sido creada exitosamente. ✅',
      })

      router.push(
        `/dashboard/ordenServicio/view/${createdData.id_orden_servicio}`
      )
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error.message ||
          'No se pudo crear la orden de servicio. Intenta de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full container mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          Crear Nueva Orden de Servicio
        </CardTitle>
        <Link href="/dashboard/ordenServicio">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Separator />
          <OrdenServicioForm onSubmit={handleSubmit} />
        </div>
      </CardContent>
    </Card>
  )
}
