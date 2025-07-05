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
import TableSkeleton from '../skeletons'
import { ViewEditDeleteBtn } from '../ViewEditDeleteBtn'

// Icons
import {
  Building2,
  CreditCard,
  Phone,
  User,
  Calendar,
  Clock,
  ChevronsUpDown,
} from 'lucide-react'

// Utilities
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Data and interfaces
import { Proveedor } from '@/lib/interfaces'
import { fetchFilteredProveedores } from '@/lib/data'

interface ProveedoresTableProps {
  query: string
  currentPage: number
  limit: number
}

const getCapsuleColor = (diasRestantes: number) => {
  if (diasRestantes < 5) return 'bg-red-500 hover:bg-red-600'
  if (diasRestantes < 15) return 'bg-orange-500 hover:bg-orange-600'
  return 'bg-green-500 hover:bg-green-600'
}

export default function EnhancedProveedoresTable({
  query,
  currentPage,
  limit,
}: ProveedoresTableProps) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'ascending' | 'descending'
  } | null>(null)
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/proveedor`
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFilteredProveedores(query, currentPage, limit)
        setProveedores(data)
      } catch (error) {
        console.error('Error fetching Proveedores:', error)
        toast({
          title: 'Error',
          description:
            'No se pudieron cargar los proveedores. Por favor, intente de nuevo.',
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

  const sortedProveedores = [...proveedores].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key as keyof Proveedor] < b[key as keyof Proveedor])
      return direction === 'ascending' ? -1 : 1
    if (a[key as keyof Proveedor] > b[key as keyof Proveedor])
      return direction === 'ascending' ? 1 : -1
    return 0
  })

  if (isLoading) return <TableSkeleton columnCount={7} />

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              { key: 'nombre_proveedor', label: 'Nombre', icon: Building2 },
              { key: 'nit', label: 'NIT', icon: CreditCard },
              { key: 'telefono', label: 'Teléfono', icon: Phone },
              { key: 'asesor', label: 'Asesor', icon: User },
              {
                key: 'fecha_vencimiento',
                label: 'Fecha de vencimiento',
                icon: Calendar,
              },
              {
                key: 'dias_credito_restantes',
                label: 'Días restantes del crédito',
                icon: Clock,
              },
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
          {sortedProveedores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No se encontraron proveedores
              </TableCell>
            </TableRow>
          ) : (
            sortedProveedores.map((proveedor, index) => (
              <motion.tr
                key={proveedor.id_proveedor}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100 transition-colors duration-200`}
              >
                <TableCell className="font-medium">
                  {proveedor.nombre_proveedor}
                </TableCell>
                <TableCell>{proveedor.nit}</TableCell>
                <TableCell>{proveedor.telefono}</TableCell>
                <TableCell>{proveedor.asesor}</TableCell>
                <TableCell>
                  {format(proveedor.fecha_vencimiento, 'dd MMMM yyyy', {
                    locale: es,
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getCapsuleColor(
                      proveedor.dias_credito_restantes
                    )} text-white`}
                  >
                    {proveedor.dias_credito_restantes}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ViewEditDeleteBtn
                    url={`/dashboard/proveedores`}
                    id={Number(proveedor.id_proveedor)}
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
