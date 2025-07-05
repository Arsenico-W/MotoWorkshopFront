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
import { fetchFilteredMotosRepuestos } from '@/lib/data'
import { MotoMercado } from '@/lib//interfaces'
import TableSkeleton from '@/components/skeletons'
import { ViewEditDeleteBtn } from '@/components/ViewEditDeleteBtn'

interface MotosMercadoTableProps {
  query: string
  currentPage: number
  limit: number
}

export default function MotosMercadoTable({
  query,
  currentPage,
  limit,
}: MotosMercadoTableProps) {
  const [motos, setMotos] = useState<MotoMercado[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/moto-mercado`

  useEffect(() => {
    const fetchMotos = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFilteredMotosRepuestos(
          query,
          currentPage,
          limit
        )
        setMotos(data)
      } catch (error) {
        console.error('Error fetching motos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMotos()
  }, [query, currentPage, limit])

  if (isLoading) return <TableSkeleton columnCount={2} />

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Modelo</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {motos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No se encontraron motos
              </TableCell>
            </TableRow>
          ) : (
            motos.map((moto) => (
              <TableRow key={moto.id_moto_mercado}>
                <TableCell className="font-medium">{moto.modelo}</TableCell>
                <TableCell className="text-right">
                  <ViewEditDeleteBtn
                    url={`/dashboard/repuestos/motos`}
                    id={Number(moto.id_moto_mercado)}
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
