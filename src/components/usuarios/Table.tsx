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
import { fetchFilteredServicios, fetchFilteredUsuarios } from '@/lib/data'
import TableSkeleton from '@/components/skeletons'
import { ViewEditDeleteBtn } from '@/components/ViewEditDeleteBtn'

interface UsuariosTableProps {
  query: string
  currentPage: number
  limit: number
}

export default function UsuariosTable({
  query,
  currentPage,
  limit,
}: UsuariosTableProps) {
  const [usuarios, setUsuario] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/users`

  useEffect(() => {
    const fetchMarcas = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFilteredUsuarios(query, currentPage, limit)
        setUsuario(data)
      } catch (error) {
        console.error('Error fetching servicios:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarcas()
  }, [query, currentPage, limit])

  if (isLoading) return <TableSkeleton columnCount={4} />

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No se encontraron usuarios
              </TableCell>
            </TableRow>
          ) : (
            usuarios.map((usuario) => (
              <TableRow key={usuario.id_usuario}>
                <TableCell className="font-medium">
                  {usuario.nombre_usuario}
                </TableCell>
                <TableCell className="font-medium">
                  {usuario.email}
                </TableCell>
                <TableCell className="font-medium">
                  {usuario.rol}
                </TableCell>
                <TableCell className="text-right">
                  <ViewEditDeleteBtn
                    url={`/dashboard/usuarios`}
                    id={Number(usuario.id_usuario)}
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
