'use client'
// React and Next.js imports
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// UI components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import TableSkeleton from '@/components/skeletons'

// Icons
import {
  ChevronsUpDown,
  Calendar,
  User,
  DollarSign,
  Package,
  FileText,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  User2,
} from 'lucide-react'

// Utility functions
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { fetchFilteredFacturas } from '@/lib/data'
import { useToast } from '@/components/ui/use-toast'
import { Factura } from '@/lib/interfaces'

// Animation library
import { motion } from 'framer-motion'

interface FacturasTableProps {
  query: string
  currentPage: number
  limit: number
}

export default function FacturasTable({ query, currentPage, limit }: FacturasTableProps) {
  const [facturas, setFacturas] = useState<Factura[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'ascending' | 'descending'} | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/factura`
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFilteredFacturas(query, currentPage, limit)
        setFacturas(data || [])
      } catch (error: any) {
        toast({
          title: 'Error',
          description:
            error.message || 'Ocurrió un error al cargar las facturas',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [query, currentPage, limit, toast])

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction:
            current.direction === 'ascending' ? 'descending' : 'ascending',
        }
      }
      return { key, direction: 'ascending' }
    })
  }

  const sortedFacturas = [...facturas].sort((a: any, b: any) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1
    if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1
    return 0
  })

  const handleDelete = async (factura: Factura) => {
    const rol = localStorage.getItem('rol')
    if (rol !== 'ADMINISTRADOR') {
      toast({
        title: 'Error',
        description: 'No tienes permisos para borrar.',
        variant: 'destructive',
      })
      return
    }

    const deleteUrl = factura.id_orden_servicio
      ? `${process.env.NEXT_PUBLIC_API_URL}/orden-servicio/${factura.id_orden_servicio}`
      : factura.id_venta_directa
      ? `${process.env.NEXT_PUBLIC_API_URL}/venta-directa/${factura.id_venta_directa}`
      : `${apiUrl}/${factura.id_factura}`

    setIsDeleting(true)
    try {
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete')
      }

      setFacturas(facturas.filter((f) => f.id_factura !== factura.id_factura))
      toast({
        title: 'Éxito',
        description: 'La factura ha sido eliminada exitosamente.',
      })
      router.refresh()
    } catch (error) {
      console.error('Error deleting factura:', error)
      toast({
        title: 'Error',
        description:
          'No se pudo eliminar la factura. Por favor, intente de nuevo.',
        variant: 'destructive',
      })
    }
    setIsDeleting(false)
  }

  if (isLoading) return <TableSkeleton columnCount={7} />

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              { key: 'id_factura', label: 'Nº Factura', icon: FileText },
              { key: 'fecha', label: 'Fecha', icon: Calendar },
              { key: 'cliente', label: 'Cliente', icon: User },
              { key: 'total', label: 'Total', icon: DollarSign },
              { key: 'tipo', label: 'Tipo', icon: Package },
              { key: 'estado', label: 'Estado', icon: FileText },
              { key: 'vendedor', label: 'Vendedor', icon: User2 },
            ].map(({ key, label, icon: Icon }) => (
              <TableHead
                key={key}
                className="cursor-pointer"
                onClick={() => handleSort(key)}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Icon className="mr-2 h-4 w-4" />
                        {label}
                        {sortConfig?.key === key && (
                          <ChevronsUpDown
                            className={cn(
                              'ml-2 h-4 w-4',
                              sortConfig.direction === 'descending'
                                ? 'rotate-180'
                                : ''
                            )}
                          />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Haga clic para ordenar por {label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
            ))}
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFacturas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No se encontraron facturas
              </TableCell>
            </TableRow>
          ) : (
            sortedFacturas.map((factura, index) => (
              <motion.tr
                key={factura.id_factura}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100 transition-colors duration-200`}
              >
                <TableCell className="font-medium text-center">
                  {factura.id_factura}
                </TableCell>
                <TableCell>{formatDate(factura.fecha)}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help underline decoration-dotted">
                          {factura.Cliente?.nombre_cliente || 'N/A'}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cédula: {factura.Cliente?.cedula}</p>
                        <p>Correo: {factura.Cliente?.correo}</p>
                        <p>Teléfono: {factura.Cliente?.telefono}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-semibold">
                    {formatCurrency(factura.total)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {factura.id_orden_servicio ? (
                    <Badge
                      variant="outline"
                      className="bg-indigo-50 text-indigo-700 border-indigo-200"
                    >
                      Orden de Servicio
                    </Badge>
                  ) : factura.id_venta_directa ? (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      Venta
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Otro</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      factura.OrdenServicio?.estado === 'COMPLETADO'
                        ? 'default'
                        : 'destructive'
                    }
                    className={`${
                      factura.OrdenServicio?.estado === 'COMPLETADO'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}
                  >
                    {factura.OrdenServicio?.estado || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>{factura.vendedor || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={
                              factura.id_orden_servicio
                                ? `/dashboard/ordenServicio/edit/${factura.id_orden_servicio}`
                                : factura.id_venta_directa
                                ? `/dashboard/facturas/ventas/edit/${factura.id_venta_directa}`
                                : `/dashboard/facturas/edit/${factura.id_factura}`
                            }
                            passHref
                          >
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar factura</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <AlertDialog>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isDeleting}
                              >
                                {isDeleting ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Eliminar factura</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Estás seguro de que quieres eliminar esta factura?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará
                            permanentemente la factura y devolverá al stock los
                            repuestos vendidos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(factura)}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
