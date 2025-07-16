'use client'

// React and Next.js hooks
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// UI components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useToast } from '@/components/ui/use-toast'

// Icons
import {
  ArrowLeft,
  Tag,
  Package,
  Barcode,
  DollarSign,
  MapPin,
  Package as PackageIcon,
} from 'lucide-react'

// Data fetching and utilities
import { fetchOneMarcaRepuesto } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

interface Repuesto {
  id_repuesto: number
  codigo_barras: string
  nombre_repuesto: string
  valor_unitario: string
  ubicacion: string
  stock: number
}

interface Marca {
  id_marca: number
  nombre_marca: string
  Repuesto: Repuesto[]
}

export default function MarcaViewPage({ params }: { params: { id: number } }) {
  const [marca, setMarca] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params

  useEffect(() => {
    const fetchMarca = async () => {
      try {
        setLoading(true)

        const data = await fetchOneMarcaRepuesto(id)
        setMarca(data)
      } catch (error) {
        console.error('Error fetching marca:', error)
        toast({
          title: 'Error',
          description: 'No se pudo obtener la información de la marca.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMarca()
  }, [id, toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!marca) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">
          No se encontró información de la marca.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Detalles de la Marca</h1>
        <Button
          onClick={() => router.push('/dashboard/repuestos/marcas')}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="mr-2 h-6 w-6" /> Información de la Marca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">ID:</p>
              <p>{marca.id_marca}</p>
            </div>
            <div>
              <p className="font-semibold">Nombre de la Marca:</p>
              <p>{marca.nombre_marca}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-6 w-6" /> Repuestos Asociados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre del Repuesto</TableHead>
                  <TableHead>Código de Barras</TableHead>
                  <TableHead>Valor Unitario</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marca.Repuesto.map((repuesto) => (
                  <TableRow key={repuesto.id_repuesto}>
                    <TableCell>{repuesto.id_repuesto}</TableCell>
                    <TableCell>{repuesto.nombre_repuesto}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Barcode className="mr-2 h-4 w-4" />
                        {repuesto.codigo_barras}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" />
                        {formatCurrency(
                          Number(repuesto.valor_unitario) +
                            Number(repuesto.valor_unitario) * 0.19
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        {repuesto.ubicacion}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <PackageIcon className="mr-2 h-4 w-4" />
                        {repuesto.stock}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          <div className="mt-4">
            <Badge variant="secondary">
              Total de Repuestos: {marca.Repuesto.length}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
