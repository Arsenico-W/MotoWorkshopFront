'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Components
import { fetchClientesPages } from '@/lib/data'
import Search from '@/components/Search'
import Items from '@/components/Items'
import ClientesTable from '@/components/clientes/Table'
import Pagination from '@/components/Pagination'
import AddBtn from '@/components/AddBtn'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

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
        const pages = await fetchClientesPages(query, limit)
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
        <CardTitle className="text-2xl font-bold">Clientes</CardTitle>
        <Link href="/dashboard/clientes/motos">
          <Button variant="outline">Ir a la sección de motos &rarr;</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <Search placeholder="Buscar clientes..." />
            <div className="flex items-center pl-2 space-x-2">
              <AddBtn url="/dashboard/clientes/add" />
              <Items />
            </div>
          </div>
          <Separator />
          <ClientesTable
            query={query}
            currentPage={currentPage}
            limit={limit}
          />
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
