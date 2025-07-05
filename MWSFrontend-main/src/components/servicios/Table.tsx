'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetchFilteredServicios } from '@/lib/data'
import { Servicio } from '@/lib//interfaces'
import TableSkeleton from '@/components/skeletons'
import { ViewEditDeleteBtn } from '@/components/ViewEditDeleteBtn'

interface ServiciosTableProps {
  query: string
  currentPage: number
  limit: number
}

export default function ServiciosTable({
  query,
  currentPage,
  limit,
}: ServiciosTableProps) {
  const [servicio, setServicio] = useState<Servicio[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/servicio`

  useEffect(() => {
    const fetchMarcas = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFilteredServicios(query, currentPage, limit)
        setServicio(data)
      } catch (error) {
        console.error('Error fetching servicios:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarcas()
  }, [query, currentPage, limit])

  if (isLoading) return <TableSkeleton columnCount={2} />

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Servicio</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servicio.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No se encontraron servicios
              </TableCell>
            </TableRow>
          ) : (
            servicio.map((servicio) => (
              <TableRow key={servicio.id_servicio}>
                <TableCell className="font-medium">
                  {servicio.nombre_servicio}
                </TableCell>
                <TableCell className="text-right">
                  <ViewEditDeleteBtn
                    url={`/dashboard/servicios`}
                    id={Number(servicio.id_servicio)}
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
