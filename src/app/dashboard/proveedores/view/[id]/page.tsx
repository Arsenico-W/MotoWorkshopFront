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
import { fetchOneProveedor } from '@/lib/data'

export default function ViewProveedorPage({
  params,
}: {
  params: { id: string }
}) {
  const [proveedor, setProveedor] = useState(undefined)
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    fetchProveedor()
  }, [id])

  const fetchProveedor = async () => {
    try {
      const data = await fetchOneProveedor(Number(id))
      setProveedor(data)
    } catch (error) {
      console.error('Error fetching proveedor:', error)
    }
  }

  if (!proveedor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Función para determinar el color de la cápsula según los días de crédito restantes
  const getCircleColor = (diasRestantes: number) => {
    if (diasRestantes < 5) return 'bg-red-500' // Rojo
    if (diasRestantes < 15) return 'bg-orange-500' // Naranja
    return 'bg-green-500' // Verde
  }

  return (
    <div className="container mx-auto py-10">
      {/* Contenedor para alinear las cartas una al lado de la otra */}
      <div className="flex flex-col lg:flex-row gap-4 justify-center">
        {/* Carta del proveedor */}
        <Card className="w-full lg:w-1/2">
          <CardHeader>
            <CardTitle>Ver proveedor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div>
                <strong>Nombre:</strong> {proveedor.nombre_proveedor}
              </div>
              <div>
                <strong>NIT:</strong> {proveedor.nit}
              </div>
              <div>
                <strong>Teléfono:</strong> {proveedor.telefono}
              </div>
              <div>
                <strong>Asesor:</strong> {proveedor.asesor}
              </div>
              <div>
                <strong>Fecha vencimiento del crédito:</strong>{' '}
                {new Date(proveedor.fecha_vencimiento).toLocaleDateString()}
              </div>
              <div>
                <strong>Días restantes:</strong>{' '}
                <div
                  className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-white ${getCircleColor(
                    proveedor.dias_credito_restantes
                  )}`}
                >
                  <span className="text-sm font-semibold">
                    {proveedor.dias_credito_restantes} días
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/dashboard/proveedores')}>
              Volver
            </Button>
          </CardFooter>
        </Card>

        {/* Carta de repuestos si el proveedor tiene repuestos */}
        {proveedor.repuestos && proveedor.repuestos.length > 0 && (
          <Card className="w-full lg:w-1/2">
            <CardHeader>
              <CardTitle>Repuestos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {proveedor.repuestos.map((repuestoItem, index) => (
                  <div key={index}>
                    <strong>Nombre del repuesto:</strong>{' '}
                    {repuestoItem.repuesto.nombre_repuesto}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
