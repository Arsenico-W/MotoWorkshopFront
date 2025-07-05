'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Components
import { fetchMotosClientesPages } from '@/lib/data'
import Search from '@/components/Search'
import Items from '@/components/Items'
import Pagination from '@/components/Pagination'
import AddBtn from '@/components/AddBtn'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import MotosTable from '@/components/motoClientes/Table'

export default function Page() {
  const searchParams = useSearchParams()
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const query = searchParams.get('query') || ''
  const currentPage = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10

  useEffect(() => {
    const fetchPages = async () => {
      setIsLoading(true)
      try {
        const pages = await fetchMotosClientesPages(query, limit)
        setTotalPages(pages)
      } catch (error) {
        console.error('Error fetching pages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPages()
  }, [query, limit])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Motos de clientes</CardTitle>
        <Link href="/dashboard/clientes">
          <Button variant="outline">Ir a la sección de clientes &rarr;</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <Search placeholder="Buscar motos..." />
            <div className="flex items-center space-x-2">
              <AddBtn url="/dashboard/clientes/motos/add" />
              <Items />
            </div>
          </div>
          <Separator />
          <MotosTable query={query} currentPage={currentPage} limit={limit} />
          {!isLoading && (
            <div className="mt-4 flex justify-center">
              <Pagination totalPages={totalPages} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
