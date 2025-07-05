'use client'

import VentaDirectaForm from '@/components/facturas/ventas/VentaDirectaForm'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AddVentaDirectaPage() {
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (data) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/venta-directa`,
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
      toast({
        title: 'Error',
        description:
          `${error.message}. Revisa posibles duplicados en los repuestos.` ||
          'No se pudo crear la venta. Intenta de nuevo.',
        variant: 'destructive',
      })
      return
    }

    toast({
      title: 'Éxito',
      description: 'La venta ha sido creada exitosamente.✅',
    })

    const createdData = await response.json()
    router.push(`/dashboard/facturas/view/${createdData.factura.id_factura}`)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Crear Nueva Venta</h1>
      <Link href="/dashboard/facturas/ventas">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </Link>
      <VentaDirectaForm onSubmit={handleSubmit} />
    </div>
  )
}
