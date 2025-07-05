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
import { ArrowLeft, Barcode, Bike, DollarSign, Wrench } from 'lucide-react'

// Data fetching and utilities
import { fetchOneMotoRepuesto } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

interface Repuesto {
  id_repuesto: number
  nombre_repuesto: string
}

interface MotoMercado {
  id_moto_mercado: number
  modelo: string
  repuestos: Array<{
    id_moto_mercado: number
    id_repuesto: number
    repuesto: Repuesto
  }>
}

export default function MotoMercadoViewPage({
  params,
}: {
  params: { id: number }
}) {
  const [motoMercado, setMotoMercado] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params

  useEffect(() => {
    const fetchMotoMercado = async () => {
      try {
        setLoading(true)

        const data = await fetchOneMotoRepuesto(id)
        setMotoMercado(data)
      } catch (error) {
        console.error('Error fetching moto-mercado:', error)
        toast({
          title: 'Error',
          description:
            'No se pudo obtener la información de la moto de mercado.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMotoMercado()
  }, [id, toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!motoMercado) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">
          No se encontró información de la moto de mercado.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Detalles de Moto de Mercado</h1>
        <Button
          onClick={() => router.push('/dashboard/repuestos/motos')}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bike className="mr-2 h-6 w-6" /> Información de la Moto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">ID:</p>
              <p>{motoMercado.id_moto_mercado}</p>
            </div>
            <div>
              <p className="font-semibold">Modelo:</p>
              <p>{motoMercado?.modelo}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="mr-2 h-6 w-6" /> Repuestos Asociados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Repuesto</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Barcode className="mr-2 h-4 w-4" />
                      Codigo de barras
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Valor unitario
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {motoMercado.repuestos.map((item) => (
                  <TableRow key={item.repuesto.id_repuesto}>
                    <TableCell>{item.repuesto.nombre_repuesto}</TableCell>
                    <TableCell>{item.repuesto.codigo_barras}</TableCell>
                    <TableCell>
                      {formatCurrency(
                        Number(
                          item.repuesto.valor_unitario +
                            item.repuesto.valor_unitario * 0.19
                        )
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          <div className="mt-4">
            <Badge variant="secondary">
              Total de Repuestos: {motoMercado.repuestos.length}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
