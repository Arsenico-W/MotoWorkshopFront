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

// Icons
import {
  ChevronDown,
  ChevronsUpDown,
  Barcode,
  Package,
  Tag,
  DollarSign,
  MapPin,
  Boxes,
  Bike,
} from 'lucide-react'

// Utility functions
import { cn } from '@/lib/utils'

// Custom components
import { ViewEditDeleteBtn } from '../ViewEditDeleteBtn'
import TableSkeleton from '../skeletons'

// Interfaces and data fetching
import { Repuesto, Reserva } from '@/lib/interfaces'
import { fetchFilteredRepuestos } from '@/lib/data'

interface RepuestosTableProps {
  query: string
  currentPage: number
  limit: number
}

const getCapsuleColor = (stock: number) => {
  if (stock < 5) return 'bg-red-500 hover:bg-red-600'
  if (stock < 15) return 'bg-orange-500 hover:bg-orange-600'
  return 'bg-green-500 hover:bg-green-600'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function RepuestosTable({
  query,
  currentPage,
  limit,
}: RepuestosTableProps) {
  const [repuestos, setRepuestos] = useState<Repuesto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Repuesto
    direction: 'ascending' | 'descending'
  } | null>(null)
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/repuesto`

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFilteredRepuestos(query, currentPage, limit)
        setRepuestos(data)
      } catch (error) {
        console.error('Error fetching Repuestos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [query, currentPage, limit])

  const handleSort = (key: keyof Repuesto) => {
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

  const sortedRepuestos = [...repuestos].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key as keyof Repuesto] < b[key as keyof Repuesto])
      return direction === 'ascending' ? -1 : 1
    if (a[key as keyof Repuesto] < b[key as keyof Repuesto])
      return direction === 'ascending' ? 1 : -1
    return 0
  })

  if (isLoading) return <TableSkeleton columnCount={8} />

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              {
                key: 'codigo_barras',
                label: 'Código de Barras',
                icon: Barcode,
              },
              {
                key: 'nombre_repuesto',
                label: 'Nombre Repuesto',
                icon: Package,
              },
              { key: 'marca', label: 'Marca', icon: Tag },
              {
                key: 'valor_unitario',
                label: 'Valor Unitario',
                icon: DollarSign,
              },
              { key: 'ubicacion', label: 'Ubicación', icon: MapPin },
              { key: 'stock', label: 'Cantidad en Stock', icon: Boxes },
            ].map(({ key, label, icon: Icon }) => (
              <TableHead
                key={key}
                className="cursor-pointer"
                onClick={() => handleSort(key as keyof Repuesto)}
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
                      <Bike className="mr-2 h-4 w-4" />
                      Motos
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Motos compatibles con este repuesto</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRepuestos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No se encontraron repuestos
              </TableCell>
            </TableRow>
          ) : (
            sortedRepuestos.map((repuesto) => (
              <TableRow key={repuesto.id_repuesto}>
                <TableCell>
                  {repuesto.codigo_barras}
                  </TableCell>
                <TableCell className="font-medium">
                  {repuesto.nombre_repuesto}
                </TableCell>
                <TableCell>
                  {repuesto.MarcaRepuesto.nombre_marca}
                </TableCell>
                <TableCell>
                  {formatCurrency(
                    Number(repuesto.valor_unitario) +
                      Number(repuesto.valor_unitario) * 0.19
                  )}
                </TableCell>
                <TableCell>
                  {repuesto.ubicacion}
                  </TableCell>
                <TableCell>
                  <Badge
                    className={`${getCapsuleColor(repuesto.stock)} text-white`}
                  >
                    {repuesto.stock}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[200px] justify-between"
                      >
                        Ver motos
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <ul className="max-h-[200px] overflow-auto">
                        {repuesto.MotoRepuesto.map((moto) => (
                          <li
                            key={moto.id_moto_mercado}
                            className="p-2 hover:bg-gray-100"
                          >
                            {moto.MotoMercado.modelo}
                          </li>
                        ))}
                      </ul>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="text-right">
                  <ViewEditDeleteBtn
                    url={`/dashboard/repuestos`}
                    id={Number(repuesto.id_repuesto)}
                    apiUrl={apiUrl}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
