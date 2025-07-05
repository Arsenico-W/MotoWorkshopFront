'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// Components
import { fetchFacturasPages } from '@/lib/data'
import Search from '@/components/Search'
import Items from '@/components/Items'
import Pagination from '@/components/Pagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import FacturasTable from '@/components/facturas/Table'


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
        const pages = await fetchFacturasPages(query, limit)
        setTotalPages(pages)
      } catch (error) {
        console.error('Error fetching pages:', error)
        setTotalPages(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPages()
  }, [query, limit])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Facturas</CardTitle>
        <div className="flex space-x-2">
          <Link href="/dashboard/facturas/ventas">
            <Button variant="outline">Ir a la sección de ventas</Button>
          </Link>
          <Link href="/dashboard/facturas/ventas/add">
            <Button variant="outline" className='bg-orange-500 text-white hover:bg-orange-600'>Generar venta</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <Search
              placeholder="Buscar facturas por # de factura..."
            />
            <div className="flex items-center pl-2 space-x-2">
              <Items />
            </div>
          </div>
          <Separator />
          <FacturasTable
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
