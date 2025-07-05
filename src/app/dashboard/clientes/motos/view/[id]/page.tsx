'use client'

// React and Next.js hooks
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Custom hooks
import { useToast } from '@/components/ui/use-toast'

// UI components
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

// Icons
import { Bike, User, Wrench } from 'lucide-react'

// Data fetching functions
import { fetchOneMotoCliente } from '@/lib/data'

// Interfaces
import { OrdenServicio } from '@/lib/interfaces'

// Utility functions
import { formatCurrency, formatDate } from '@/lib/utils'

export default function ViewMotoClientePage({
  params,
}: {
  params: { id: number }
}) {
  const [motoCliente, setMotoCliente] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await fetchOneMotoCliente(id)
        setMotoCliente(data)
      } catch (error) {
        console.error(error)
        toast({
          title: 'Error',
          description:
            'No se pudieron obtener los datos de la moto, intenta de nuevo.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!motoCliente) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">
          No se encontraron datos de la moto.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Detalles de la Moto</h1>
        <Button onClick={() => router.push('/dashboard/clientes/motos')}>
          Volver a la lista de motos
        </Button>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bike className="mr-2" /> Información de la Moto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="font-semibold">Marca:</dt>
                <dd>{motoCliente.marca}</dd>
              </div>
              <div>
                <dt className="font-semibold">Modelo:</dt>
                <dd>{motoCliente.modelo}</dd>
              </div>
              <div>
                <dt className="font-semibold">Año:</dt>
                <dd>{motoCliente.ano}</dd>
              </div>
              <div>
                <dt className="font-semibold">Placa:</dt>
                <dd>{motoCliente.placa}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2" /> Información del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="font-semibold">Nombre:</dt>
                <dd>{motoCliente.cliente.nombre_cliente}</dd>
              </div>
              <div>
                <dt className="font-semibold">Cédula:</dt>
                <dd>{motoCliente.cliente.cedula}</dd>
              </div>
              <div>
                <dt className="font-semibold">Correo:</dt>
                <dd>{motoCliente.cliente.correo}</dd>
              </div>
              <div>
                <dt className="font-semibold">Teléfono:</dt>
                <dd>{motoCliente.cliente.telefono}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="mr-2" /> Resumen de Órdenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="font-semibold">Total de Órdenes:</dt>
                <dd>{motoCliente.ordenes_servicio.length}</dd>
              </div>
              <div>
                <dt className="font-semibold">Órdenes Pendientes:</dt>
                <dd>
                  {
                    motoCliente.ordenes_servicio.filter(
                      (orden) => orden.estado === 'PENDIENTE'
                    ).length
                  }
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Última Orden:</dt>
                <dd>
                  {formatDate(
                    motoCliente.ordenes_servicio[0]?.fecha || new Date()
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Órdenes de Servicio</CardTitle>
          <CardDescription>
            Listado de todas las órdenes de servicio para esta moto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="pending">Pendientes</TabsTrigger>
              <TabsTrigger value="completed">Completadas</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <OrdenesTable ordenes={motoCliente.ordenes_servicio} />
            </TabsContent>
            <TabsContent value="pending">
              <OrdenesTable
                ordenes={motoCliente.ordenes_servicio.filter(
                  (orden) => orden.estado === 'PENDIENTE'
                )}
              />
            </TabsContent>
            <TabsContent value="completed">
              <OrdenesTable
                ordenes={motoCliente.ordenes_servicio.filter(
                  (orden) => orden.estado === 'COMPLETADO'
                )}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function OrdenesTable({ ordenes }: { ordenes: OrdenServicio[] }) {
  const router = useRouter()
  return (
    <ScrollArea className="h-[400px]">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-2">N° Orden</th>
            <th className="text-left p-2">Fecha</th>
            <th className="text-left p-2">Estado</th>
            <th className="text-left p-2">Total</th>
            <th className="text-left p-2">Mecánico</th>
            <th className="text-left p-2">Detalles</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden) => (
            <tr key={orden.id_orden_servicio} className="border-t">
              <td className="p-2">{orden.id_orden_servicio}</td>
              <td className="p-2">{formatDate(orden.fecha)}</td>
              <td className="p-2">
                <Badge
                  variant={
                    orden.estado === 'PENDIENTE' ? 'default' : 'secondary'
                  }
                >
                  {orden.estado}
                </Badge>
              </td>
              <td className="p-2">{formatCurrency(orden.total)}</td>
              <td className="p-2">{orden.mecanico || 'No asignado'}</td>
              <td className="p-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(
                      `/dashboard/ordenServicio/view/${orden.id_orden_servicio}`
                    )
                  }
                >
                  Ver detalles
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  )
}
