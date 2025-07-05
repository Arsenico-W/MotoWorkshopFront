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
import { fetchFilteredMotosClientes } from '@/lib/data'
import { MotoCliente } from '@/lib/interfaces'
import { ViewEditDeleteBtn } from '../ViewEditDeleteBtn'
import TableSkeleton from '../skeletons'
import { Badge } from '@/components/ui/badge'

interface MotosTableProps {
  query: string
  currentPage: number
  limit: number
}

export default function MotosTable({
  query,
  currentPage,
  limit,
}: MotosTableProps) {
  const [motos, setMotos] = useState<MotoCliente[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/motos`

  useEffect(() => {
    const fetchMotos = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFilteredMotosClientes(query, currentPage, limit)
        setMotos(data)
      } catch (error) {
        console.error('Error fetching motos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMotos()
  }, [query, currentPage, limit])

  if (isLoading) return <TableSkeleton columnCount={5} />

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Marca</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Año</TableHead>
            <TableHead>Placa</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {motos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No se encontraron motos
              </TableCell>
            </TableRow>
          ) : (
            motos.map((moto) => (
              <TableRow key={moto.id_moto_cliente}>
                <TableCell className="font-medium">{moto.marca}</TableCell>
                <TableCell>{moto.modelo}</TableCell>
                <TableCell>{moto.ano}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {moto.placa}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <ViewEditDeleteBtn
                    url={`/dashboard/clientes/motos`}
                    id={Number(moto.id_moto_cliente)}
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
