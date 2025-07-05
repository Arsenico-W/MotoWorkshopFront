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
import { Mail, Phone, User, ChevronsUpDown } from 'lucide-react'
import { motion } from 'framer-motion'

// Utility functions and hooks
import { fetchFilteredClientes } from '@/lib/data'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

// Interfaces
import { Cliente } from '@/lib/interfaces'

// Custom components
import { ViewEditDeleteBtn } from '../ViewEditDeleteBtn'
import TableSkeleton from '../skeletons'

interface ClientesTableProps {
  query: string
  currentPage: number
  limit: number
}

export default function EnhancedClientesTable({
  query,
  currentPage,
  limit,
}: ClientesTableProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'ascending' | 'descending'
  } | null>(null)

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/clientes`
  const { toast } = useToast()

  useEffect(() => {
    const fetchClientes = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFilteredClientes(query, currentPage, limit)
        setClientes(data)
      } catch (error) {
        console.error('Error fetching clientes:', error)
        toast({
          title: 'Error',
          description:
            'No se pudieron cargar los clientes. Por favor, intente de nuevo.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchClientes()
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

  const sortedClientes = [...clientes].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key as keyof Cliente] < b[key as keyof Cliente])
      return direction === 'ascending' ? -1 : 1
    if (a[key as keyof Cliente] > b[key as keyof Cliente])
      return direction === 'ascending' ? 1 : -1
    return 0
  })

  if (isLoading) return <TableSkeleton columnCount={5} />

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {[
              { key: 'nombre_cliente', label: 'Nombre', icon: User },
              { key: 'cedula', label: 'Cédula', icon: null },
              { key: 'correo', label: 'Correo', icon: Mail },
              { key: 'telefono', label: 'Teléfono', icon: Phone },
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
                        {Icon && (
                          <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}
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
          {sortedClientes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No se encontraron clientes
              </TableCell>
            </TableRow>
          ) : (
            sortedClientes.map((cliente, index) => (
              <motion.tr
                key={cliente.id_cliente}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100 transition-colors duration-200`}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {cliente.nombre_cliente}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{cliente.cedula}</Badge>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={`mailto:${cliente.correo}`}
                          className="flex items-center space-x-2 text-blue-600 hover:underline"
                        >
                          <Mail className="h-4 w-4" />
                          <span>{cliente.correo}</span>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enviar correo a {cliente.nombre_cliente}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{cliente.telefono}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <ViewEditDeleteBtn
                    url={`/dashboard/clientes`}
                    id={Number(cliente.id_cliente)}
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
