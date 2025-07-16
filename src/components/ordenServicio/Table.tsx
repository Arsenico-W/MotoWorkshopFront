'use client'
// React and hooks
import { useEffect, useState } from 'react'

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'

// Icons
import { FileText, Calendar, Car, Activity, ChevronsUpDown } from 'lucide-react'

// Utility functions
import { cn, formatDate } from '@/lib/utils'

// Data fetching
import { fetchFilteredOrdenes } from '@/lib/data'

// Interfaces
import { OrdenServicio } from '@/lib/interfaces'

// Other components
import { ViewEditDeleteBtn } from '../ViewEditDeleteBtn'
import TableSkeleton from '../skeletons'

// Animation
import { motion } from 'framer-motion'

interface OrdenesServicioTableProps {
  query: string
  currentPage: number
  limit: number
}

export default function EnhancedOrdenesServicioTable({
  query,
  currentPage,
  limit,
}: OrdenesServicioTableProps) {
  const [ordenes, setOrdenes] = useState<OrdenServicio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'ascending' | 'descending'
  } | null>(null)

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/orden-servicio`
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrdenes = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFilteredOrdenes(query, currentPage, limit)
        console.log(data);
        setOrdenes(data)
      } catch (error) {
        console.error('Error fetching Ordenes:', error)
        toast({
          title: 'Error',
          description:
            'No se pudieron cargar las órdenes de servicio. Por favor, intente de nuevo.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrdenes()
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

  const sortedOrdenes = [...ordenes].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key as keyof OrdenServicio] < b[key as keyof OrdenServicio])
      return direction === 'ascending' ? -1 : 1
    if (a[key as keyof OrdenServicio] > b[key as keyof OrdenServicio])
      return direction === 'ascending' ? 1 : -1
    return 0
  })

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      EN_PROCESO: 'bg-blue-100 text-blue-800',
      COMPLETADO: 'bg-green-100 text-green-800',
      CANCELADO: 'bg-red-100 text-red-800',
    }
    return (
      <Badge className={statusStyles[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }

  if (isLoading) return <TableSkeleton columnCount={5} />

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              { key: 'id_orden_servicio', label: '# Orden', icon: FileText },
              { key: 'fecha', label: 'Fecha', icon: Calendar },
              { key: 'MotoCliente.placa', label: 'Placa', icon: Car },
              { key: 'estado', label: 'Estado', icon: Activity },
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
                        <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
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
          {sortedOrdenes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No se encontraron órdenes de servicio
              </TableCell>
            </TableRow>
          ) : (
            sortedOrdenes.map((orden, index) => (
              
              <motion.tr
                key={orden.id_orden_servicio}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100 transition-colors duration-200`}
              >
                <TableCell className="font-medium">
                  {orden.id_orden_servicio}
                </TableCell>
                <TableCell>{formatDate(orden.fecha)}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help underline decoration-dotted">
                        {orden.MotoCliente?.placa}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Marca: {orden.MotoCliente?.marca}</p>
                        <p>Modelo: {orden.MotoCliente?.modelo}</p>
                        <p>Año: {orden.MotoCliente?.ano}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{getStatusBadge(orden.estado)}</TableCell>
                <TableCell className="text-right">
                  <ViewEditDeleteBtn
                    url={`/dashboard/ordenServicio`}
                    id={Number(orden.id_orden_servicio)}
                    apiUrl={apiUrl}
                  />
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
