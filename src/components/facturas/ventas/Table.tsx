'use client'

// React and Next.js imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
} from '@/components/ui/alert-dialog'
import TableSkeleton from '@/components/skeletons'

// Icons
import {
  ChevronDown,
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
} from 'lucide-react'
import { NumberedListIcon } from '@heroicons/react/24/outline'

// Utility functions and hooks
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { fetchFilteredVentas } from '@/lib/data'
import { useToast } from '@/components/ui/use-toast'

export default function VentaDirectaTable({ query, currentPage, limit }) {
  const [ventas, setVentas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/venta-directa`
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFilteredVentas(query, currentPage, limit)
        setVentas(data || [])
      } catch (error) {
        toast({
          title: 'Error',
          description:
            error.message || 'Ocurrió un error al cargar las ventas directas',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [query, currentPage, limit, apiUrl, toast])

  const handleSort = (key) => {
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

  const sortedVentas = [...ventas].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1
    if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1
    return 0
  })

  const handleDelete = async (id) => {
    const rol = localStorage.getItem('rol')
    if (rol !== 'ADMINISTRADOR') {
      toast({
        title: 'Error',
        description: 'No tienes permisos para eliminar una venta.',
        variant: 'destructive',
      })
      return
    }
    setIsDeleting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        toast({
          title: 'Exito',
          description:
            'Registro eliminado.✅ Actualiza la pagina para ver los cambios.',
        })

        router.refresh()
      } else {
        throw new Error('No se pudo borrar')
      }
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error',
        description: 'No se pudo borrar, intenta nuevamente.',
        variant: 'destructive',
      })
    }
    setIsDeleting(false)
  }

  if (isLoading) return <TableSkeleton columnCount={6} />

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              { key: 'id', label: 'Nº Venta', icon: NumberedListIcon },
              { key: 'fecha', label: 'Fecha', icon: Calendar },
              { key: 'cliente', label: 'Cliente', icon: User },
              { key: 'total', label: 'Total', icon: DollarSign },
              { key: 'repuestos', label: 'Repuestos', icon: Package },
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
            <TableHead>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Factura
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Detalles de la factura</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedVentas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No se encontraron ventas
              </TableCell>
            </TableRow>
          ) : (
            sortedVentas.map((venta) => (
              <TableRow key={venta.id_venta}>
                <TableCell className="font-medium text-center">
                  {venta.id_venta}
                </TableCell>
                <TableCell>{formatDate(venta.fecha)}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help underline decoration-dotted">
                          {venta.Cliente.nombre_cliente}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cédula: {venta.Cliente.cedula}</p>
                        <p>Correo: {venta.Cliente.correo}</p>
                        <p>Teléfono: {venta.Cliente.telefono}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{formatCurrency(Number(venta.total))}</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[200px] justify-between"
                      >
                        Ver repuestos
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Repuesto</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Precio</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {venta.RepuestoVenta.map((repuesto) => (
                            <TableRow key={repuesto.id_repuesto}>
                              <TableCell>
                                {repuesto.Repuesto.nombre_repuesto}
                              </TableCell>
                              <TableCell>{repuesto.cantidad}</TableCell>
                              <TableCell>
                                {formatCurrency(Number(repuesto.precio))}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="ml-2">
                    TOTAL: {formatCurrency(Number(venta.total))}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Link
                      href={`/dashboard/facturas/view/${venta.factura?.id_factura}`}
                    >
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link
                      href={`/dashboard/facturas/ventas/edit/${venta.id_venta}`}
                    >
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
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
                            ¿Estás seguro de que quieres eliminar esta venta?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará
                            permanentemente la venta, la factura y devolverá al
                            stock los repuestos vendidos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(venta.id_venta)}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
