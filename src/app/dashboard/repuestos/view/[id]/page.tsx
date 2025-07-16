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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'

// Icons
import { ArrowLeft, Package, Bike, Truck } from 'lucide-react'

// Data fetching and utility functions
import { fetchOneRepuesto } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

export default function ViewRepuestoPage({
  params,
}: {
  params: { id: number }
}) {
  const [repuesto, setRepuesto] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params
  const rol = localStorage.getItem('rol')

  if(rol !== 'ADMINISTRADOR'){
    toast({
      title: 'Error',
      description: 'No tienes permiso para acceder a esta página.',
      variant: 'destructive',
    })
    router.push('/dashboard/repuestos')
}


  useEffect(() => {
    const fetchRepuesto = async () => {
      try {
        setLoading(true)

        const data = await fetchOneRepuesto(id)
        setRepuesto(data)
      } catch (error) {
        console.error('Error fetching repuesto:', error)
        toast({
          title: 'Error',
          description: 'No se pudo obtener la información del repuesto.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRepuesto()
  }, [id, toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!repuesto) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">
          No se encontró información del repuesto.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Detalles del Repuesto</h1>
        <Button
          onClick={() => router.push('/dashboard/repuestos')}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la lista
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2" /> Información General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="font-semibold">Nombre:</dt>
                <dd>{repuesto.nombre_repuesto}</dd>
              </div>
              <div>
                <dt className="font-semibold">Código de Barras:</dt>
                <dd>{repuesto.codigo_barras}</dd>
              </div>
              <div>
                <dt className="font-semibold">Valor de compra:</dt>
                <dd>{formatCurrency(parseFloat(repuesto.valor_compra))}</dd>
              </div>
              <div>
                <dt className="font-semibold">Valor venta:</dt>
                <dd>{formatCurrency(parseFloat(repuesto.valor_unitario))}</dd>
              </div>
              <div>
                <dt className="font-semibold">Ubicación:</dt>
                <dd>{repuesto.ubicacion}</dd>
              </div>
              <div>
                <dt className="font-semibold">Stock:</dt>
                <dd>
                  <Badge
                    variant={
                      repuesto.stock > 100
                        ? 'default'
                        : repuesto.stock > 50
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {repuesto.stock}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Marca:</dt>
                <dd>{repuesto.MarcaRepuesto.nombre_marca}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bike className="mr-2" /> Motos Compatibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Modelo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repuesto.MotoRepuesto.map((moto) => (
                    <TableRow key={moto.id_moto_mercado}>
                      <TableCell>{moto.MotoMercado.modelo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="mr-2" /> Proveedores
          </CardTitle>
          <CardDescription>
            Listado de proveedores para este repuesto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>NIT</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Asesor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repuesto.ProveedorRepuesto.map((prov) => (
                  <TableRow key={prov.id_proveedor}>
                    <TableCell>{prov.Proveedor.nombre_proveedor}</TableCell>
                    <TableCell>{prov.Proveedor.nit}</TableCell>
                    <TableCell>{prov.Proveedor.telefono}</TableCell>
                    <TableCell>{prov.Proveedor.asesor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
