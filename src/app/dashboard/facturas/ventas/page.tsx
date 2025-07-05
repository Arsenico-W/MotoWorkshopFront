'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// Components
import { fetchVentasPages } from '@/lib/data'
import Search from '@/components/Search'
import Items from '@/components/Items'
import Pagination from '@/components/Pagination'
import AddBtn from '@/components/AddBtn'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import VentaDirectaTable from '@/components/facturas/ventas/Table'

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
        const pages = await fetchVentasPages(query, limit)
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
      <CardHeader className="flex flex-row space-x-2 justify-between ">
        <CardTitle className="text-2xl font-bold">Ventas</CardTitle>
        <Link href="/dashboard/facturas">
          <Button variant="outline">Ir a la sección de facturas &rarr;</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <Search placeholder="Buscar venta..." />
            <div className="flex items-center pl-2 space-x-2">
              <AddBtn url="/dashboard/facturas/ventas/add" />
              <Items />
            </div>
          </div>
          <Separator />
          <VentaDirectaTable
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
