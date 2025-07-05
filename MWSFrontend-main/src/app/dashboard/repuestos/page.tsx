'use client'

// React and Next.js hooks
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// Data fetching functions
import { fetchAllRepuestos, fetchRepuestosPages } from '@/lib/data'

// UI Components
import Search from '@/components/Search'
import Items from '@/components/Items'
import Pagination from '@/components/Pagination'
import AddBtn from '@/components/AddBtn'
import RepuestosTable from '@/components/repuestos/Table'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Utility functions
import { formatCurrency } from '@/lib/utils'

export default function Page() {
  const searchParams = useSearchParams()
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [totalValue, setTotalValue] = useState(0)

  const query = searchParams.get('query') || ''
  const currentPage = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10

  useEffect(() => {
    const fetchPages = async () => {
      setIsLoading(true)
      try {
        const pages = await fetchRepuestosPages(query, limit)
        setTotalPages(pages)
      } catch (error) {
        console.error('Error fetching pages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const calculateTotalValue = async () => {
      setIsLoading(true)
      try {
        const repuestos = await fetchAllRepuestos()
        const total = repuestos.reduce((acc, repuesto) => {
          return (
            acc +
            (Number(repuesto.valor_unitario) +
              Number(repuesto.valor_unitario) * 0.19) *
              repuesto.stock
          )
        }, 0)
        setTotalValue(total)
      } catch (error) {
        console.error('Error calculating total value:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPages()
    calculateTotalValue()
  }, [query, limit])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row space-x-2 justify-between ">
        <CardTitle className="text-2xl font-bold">Repuestos</CardTitle>
        <Link href="/dashboard/repuestos/marcas">
          <Button variant="outline">Ir a la sección de marcas &rarr;</Button>
        </Link>
        <Link href="/dashboard/repuestos/motos">
          <Button variant="outline">Ir a la sección de motos &rarr;</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <Search placeholder="Buscar repuesto..." />
            <div className="flex items-center pl-2 space-x-2">
              <AddBtn url="/dashboard/repuestos/add" />
              <Items />
            </div>
          </div>
          <RepuestosTable
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
      <CardFooter>
        <div className="bg-muted p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">
            Valor total del inventario
          </h3>
          <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
        </div>
      </CardFooter>
    </Card>
  )
}
