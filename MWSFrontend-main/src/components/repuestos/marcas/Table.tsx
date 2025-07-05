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
import { fetchFilteredMarcasRepuestos } from '@/lib/data'
import { MarcaRepuesto } from '@/lib//interfaces'
import TableSkeleton from '@/components/skeletons'
import { ViewEditDeleteBtn } from '@/components/ViewEditDeleteBtn'

interface MarcasTableProps {
  query: string
  currentPage: number
  limit: number
}

export default function MarcasTable({
  query,
  currentPage,
  limit,
}: MarcasTableProps) {
  const [marcas, setMarcas] = useState<MarcaRepuesto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/marca-repuesto`

  useEffect(() => {
    const fetchMarcas = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFilteredMarcasRepuestos(
          query,
          currentPage,
          limit
        )
        setMarcas(data)
      } catch (error) {
        console.error('Error fetching marcas:', error)
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
            <TableHead>Nombre Marca</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {marcas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No se encontraron marcas
              </TableCell>
            </TableRow>
          ) : (
            marcas.map((marca) => (
              <TableRow key={marca.id_marca}>
                <TableCell className="font-medium">
                  {marca.nombre_marca}
                </TableCell>
                <TableCell className="text-right">
                  <ViewEditDeleteBtn
                    url={`/dashboard/repuestos/marcas`}
                    id={Number(marca.id_marca)}
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
