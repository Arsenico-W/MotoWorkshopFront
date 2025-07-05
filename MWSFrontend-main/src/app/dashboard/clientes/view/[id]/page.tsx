'use client'

// React and Next.js imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// UI components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { ViewEditDeleteBtn } from '@/components/ViewEditDeleteBtn'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Icons
import {
  User,
  Bike,
  Receipt,
  ShoppingBag,
  Calendar,
  Search,
  Filter,
  Eye,
} from 'lucide-react'

// Utility functions and data fetching
import { fetchOneCliente } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

// Interfaces
import { Cliente, MotoCliente, Factura, VentaDirecta } from '@/lib/interfaces'

export default function ViewClientePage({
  params,
}: {
  params: { id: number }
}) {
  const [cliente, setCliente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('motos')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('fecha')
  const router = useRouter()
  const { id } = params
  const { toast } = useToast()
  const motoUrl = '/dashboard/clientes/motos'
  const apiMotoUrl = `${process.env.NEXT_PUBLIC_API_URL}/moto-cliente`

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await fetchOneCliente(id)
        setCliente(data)
      } catch (error) {
        console.error(error)
        toast({
          title: 'Error',
          description:
            'No se pudieron obtener los datos del cliente, intenta de nuevo.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, toast])

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filterAndSortData = (data: any[], type: string) => {
    return data
      ?.filter((item) =>
        type === 'motos'
          ? item.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.placa.toLowerCase().includes(searchTerm.toLowerCase())
          : true
      )
      .sort((a, b) => {
        if (sortBy === 'fecha') {
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        }
        if (sortBy === 'monto') {
          return parseFloat(b.total) - parseFloat(a.total)
        }
        return 0
      })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-[200px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="flex justify-center items-center h-screen">
        No se encontraron datos del cliente.
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Detalles del Cliente</h1>
        <Button onClick={() => router.push('/dashboard/clientes')}>
          Volver a la lista de clientes
        </Button>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">
                  {cliente.nombre_cliente}
                </h2>
                <p className="text-muted-foreground">{cliente.cedula}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Correo:</strong> {cliente.correo}
              </div>
              <div>
                <strong>Teléfono:</strong> {cliente.telefono}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Actividad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Total Motos:</span>
                <Badge variant="secondary">
                  {cliente.motos_cliente?.length || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Facturas:</span>
                <Badge variant="secondary">
                  {cliente.facturas?.length || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Ventas Directas:</span>
                <Badge variant="secondary">
                  {cliente.ventas_directas?.length || 0}
                </Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span>Última Actividad:</span>
                <Badge variant="outline">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(
                    new Date(
                      cliente.ventas_directas?.[0]?.fecha ||
                        cliente.facturas?.[0]?.fecha ||
                        ''
                    )
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="motos" className="flex items-center">
            <Bike className="w-4 h-4 mr-2" /> Motos
          </TabsTrigger>
          <TabsTrigger value="facturas" className="flex items-center">
            <Receipt className="w-4 h-4 mr-2" /> Facturas
          </TabsTrigger>
          <TabsTrigger value="ventas" className="flex items-center">
            <ShoppingBag className="w-4 h-4 mr-2" /> Ventas Directas
          </TabsTrigger>
        </TabsList>
        <div className="flex justify-between items-center my-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fecha">Fecha</SelectItem>
                <SelectItem value="monto">Monto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <TabsContent value="motos">
          <Card>
            <CardContent className="p-6">
              {cliente.motos_cliente && cliente.motos_cliente.length > 0 ? (
                <ScrollArea className="h-[300px] w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Marca</TableHead>
                        <TableHead>Modelo</TableHead>
                        <TableHead>Año</TableHead>
                        <TableHead>Placa</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterAndSortData(cliente.motos_cliente, 'motos').map(
                        (moto: MotoCliente) => (
                          <TableRow key={moto.id_moto_cliente}>
                            <TableCell>{moto.marca}</TableCell>
                            <TableCell>{moto.modelo}</TableCell>
                            <TableCell>{moto.ano}</TableCell>
                            <TableCell>{moto.placa}</TableCell>
                            <TableCell>
                              <ViewEditDeleteBtn
                                id={moto.id_moto_cliente}
                                url={motoUrl}
                                apiUrl={apiMotoUrl}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <p className="text-center text-muted-foreground">
                  No hay motos registradas para este cliente.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="facturas">
          <Card>
            <CardContent className="p-6">
              {cliente.facturas && cliente.facturas.length > 0 ? (
                <ScrollArea className="h-[300px] w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nº Factura</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Detalles</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterAndSortData(cliente.facturas, 'facturas').map(
                        (factura: Factura) => (
                          <TableRow key={factura.id_factura}>
                            <TableCell>{factura.id_factura}</TableCell>
                            <TableCell>{formatDate(factura.fecha)}</TableCell>
                            <TableCell>
                              {formatCurrency(factura.total)}
                            </TableCell>
                            <TableCell>
                              {factura.id_orden_servicio
                                ? 'Orden de Servicio'
                                : 'Venta'}
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Ver Detalles
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Detalles de la Factura
                                    </DialogTitle>
                                    <DialogDescription>
                                      Factura #{factura.id_factura} -{' '}
                                      {formatDate(factura.fecha)}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 items-center gap-4">
                                      <span className="font-medium">
                                        Subtotal:
                                      </span>
                                      <span>
                                        {formatCurrency(factura.subtotal)}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 items-center gap-4">
                                      <span className="font-medium">IVA:</span>
                                      <span>{formatCurrency(factura.iva)}</span>
                                    </div>
                                    <div className="grid grid-cols-2 items-center gap-4">
                                      <span className="font-medium">
                                        Total:
                                      </span>
                                      <span className="font-bold">
                                        {formatCurrency(factura.total)}
                                      </span>
                                    </div>
                                    <Separator />
                                    <div className="grid grid-cols-2 items-center gap-4">
                                      <span className="font-medium">
                                        Pago Efectivo:
                                      </span>
                                      <span>
                                        {formatCurrency(factura.pago_efectivo)}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 items-center gap-4">
                                      <span className="font-medium">
                                        Pago Tarjeta:
                                      </span>
                                      <span>
                                        {formatCurrency(factura.pago_tarjeta)}
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-2 items-center gap-4">
                                      <span className="font-medium">
                                        Pago Transferencia:
                                      </span>
                                      <span>
                                        {formatCurrency(
                                          factura.pago_transferencia
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link
                                      href={`/dashboard/facturas/view/${factura.id_factura}`}
                                      passHref
                                    >
                                      <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Ver factura</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <p className="text-center text-muted-foreground">
                  No hay facturas registradas para este cliente.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ventas">
          <Card>
            <CardContent className="p-6">
              {cliente.ventas_directas && cliente.ventas_directas.length > 0 ? (
                <ScrollArea className="h-[300px] w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nº Venta</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead>IVA</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterAndSortData(cliente.ventas_directas, 'ventas').map(
                        (venta: VentaDirecta) => (
                          <TableRow key={venta.id_venta}>
                            <TableCell>{venta.id_venta}</TableCell>
                            <TableCell>{formatDate(venta.fecha)}</TableCell>
                            <TableCell>
                              {formatCurrency(venta.subtotal)}
                            </TableCell>
                            <TableCell>{formatCurrency(venta.iva)}</TableCell>
                            <TableCell>{formatCurrency(venta.total)}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <p className="text-center text-muted-foreground">
                  No hay ventas directas registradas para este cliente.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
