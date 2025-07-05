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
import { Mail, Phone, User, Wrench, ChevronsUpDown } from 'lucide-react'
import { motion } from 'framer-motion'

import { fetchFilteredMecanicos } from '@/lib/data'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { ViewEditDeleteBtn } from '../ViewEditDeleteBtn'
import TableSkeleton from '../skeletons'
import { Mecanico } from '@/lib/interfaces'

interface MecanicosTableProps {
query: string
currentPage: number
limit: number
}

export default function EnhancedMecanicosTable({
query,
currentPage,
limit,
}: MecanicosTableProps) {
const [mecanicos, setMecanicos] = useState<any[]>([])
const [isLoading, setIsLoading] = useState(true)
const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'ascending' | 'descending'
} | null>(null)

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/mecanico`
const { toast } = useToast()

const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
        const data = await fetchFilteredMecanicos(query, currentPage, limit)
        setMecanicos(data)
    } catch (error) {
        console.error('Error fetching mecanicos:', error)
        toast({
        title: 'Error',
        description: 'No se pudieron cargar los mecánicos.',
        variant: 'destructive',
        })
    } finally {
        setIsLoading(false)
    }
}, [query, currentPage, limit, toast])

const handleDelete = useCallback(() => {
    // Recargar la lista después de eliminar
    fetchData()
}, [fetchData])

useEffect(() => {
    fetchData()
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

const sortedMecanicos = [...mecanicos].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key as keyof Mecanico] < b[key as keyof Mecanico]) 
        return direction === 'ascending' ? -1 : 1
    if (a[key as keyof Mecanico] < b[key as keyof Mecanico]) 
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
            { key: 'nombre', label: 'Nombre', icon: User },
            { key: 'cedula', label: 'Cédula', icon: null },
            { key: 'correo', label: 'Correo', icon: Mail },
            { key: 'telefono', label: 'Teléfono', icon: Phone },
            { key: 'tipo_mecanico', label: 'Tipo', icon: Wrench },
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
        {sortedMecanicos.length === 0 ? (
            <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
                No se encontraron mecánicos
            </TableCell>
            </TableRow>
        ) : (
            sortedMecanicos.map((mecanico, index) => (
            <motion.tr
                key={mecanico.id_mecanico}
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
                        <span className="font-medium">{mecanico.nombre}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant="secondary">{mecanico.cedula}</Badge>
                </TableCell>
                <TableCell>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <a
                                    href={`mailto:${mecanico.correo}`}
                                    className="flex items-center space-x-2 text-blue-600 hover:underline"
                                >
                                <Mail className="h-4 w-4" />
                                <span>{mecanico.correo}</span>
                                </a>
                            </TooltipTrigger>
                        <TooltipContent>
                            <p>Enviar correo</p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </TableCell>
                <TableCell>
                    <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{mecanico.telefono}</span>
                    </div>
                </TableCell>
                <TableCell>{mecanico.mecanicodetalle?.[0]?.tipo_mecanico || '-'}</TableCell>
                <TableCell className="text-right">
                <ViewEditDeleteBtn
                    url={`/dashboard/mecanico`}
                    id={Number(mecanico.id_mecanico)}
                    apiUrl={apiUrl}
                    onDelete={handleDelete}
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