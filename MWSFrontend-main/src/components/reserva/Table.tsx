'use client'

import { useEffect, useState, useCallback } from 'react'
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
import { Calendar, User, ClipboardList, Clock, ChevronsUpDown } from 'lucide-react'
import { motion } from 'framer-motion'

import { fetchFilteredReservas } from '@/lib/data'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { ViewEditDeleteBtn } from '../ViewEditDeleteBtn'
import TableSkeleton from '../skeletons'
import { Reserva } from '@/lib/interfaces'

interface ReservasTableProps {
query: string
currentPage: number
limit: number
}

export default function EnhancedReservasTable({
query,
currentPage,
limit,
}: ReservasTableProps) {
const [reservas, setReservas] = useState<Reserva[]>([])
const [isLoading, setIsLoading] = useState(true)
const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'ascending' | 'descending'
} | null>(null)

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/reservas`
const { toast } = useToast()

const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
        const data = await fetchFilteredReservas(query, currentPage, limit)
        setReservas(data)

    } catch (error) {
        console.error('Error fetching reservas:', error)
        toast({
        title: 'Error',
        description: 'No se pudieron cargar las reservas.',
        variant: 'destructive',
        })
    } finally {
        setIsLoading(false)
    }
}, [query, currentPage, limit, toast])

useEffect(() => {
    fetchData()
}, [fetchData])

// Función para recargar los datos después de eliminar
const handleAfterDelete = useCallback(async () => {
    await fetchData()
}, [fetchData])

const handleSort = (key: string) => {
    setSortConfig((current) => {
    if (current?.key === key) {
        return {
        key,
        direction: current.direction === 'ascending' ? 'descending' : 'ascending',
        }
    }
    return { key, direction: 'ascending' }
    })
}

const sortedReservas = [...reservas].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key as keyof Reserva] < b[key as keyof Reserva]) 
        return direction === 'ascending' ? -1 : 1
    if (a[key as keyof Reserva] < b[key as keyof Reserva]) 
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
            { key: 'cliente_nombre', label: 'Cliente', icon: User },
            { key: 'servicio_nombre', label: 'Servicio', icon: ClipboardList },
            { key: 'fecha_reserva', label: 'Fecha', icon: Calendar },
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
                        {Icon && <Icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                        {label}
                        {sortConfig?.key === key && (
                        <ChevronsUpDown
                            className={cn(
                            'ml-2 h-4 w-4',
                            sortConfig.direction === 'descending' ? 'rotate-180' : ''
                            )}
                        />
                        )}
                    </div>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>Ordenar por {label}</p>
                    </TooltipContent>
                </Tooltip>
                </TooltipProvider>
            </TableHead>
            ))}
            <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
        </TableHeader>
        <TableBody>
        {sortedReservas.length === 0 ? (
            <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
                No se encontraron reservas
            </TableCell>
            </TableRow>
        ) : (
            sortedReservas.map((reserva, index) => (
            <motion.tr
                key={reserva.id_reserva}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100 transition-colors duration-200`}
            >
                <TableCell>{reserva.Cliente.nombre_cliente || '-'}</TableCell>
                <TableCell>{reserva.Servicio.nombre_servicio || '-'}</TableCell>
                <TableCell>
                <Badge variant="secondary">
                    {new Date(reserva.fecha_reserva).toISOString().split('T')[0]
                    .split('-')
                    .reverse()
                    .join('/')}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                <ViewEditDeleteBtn
                    url={`/dashboard/reserva`}
                    id={Number(reserva.id_reserva)}
                    apiUrl={apiUrl}
                    onDelete={handleAfterDelete}
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