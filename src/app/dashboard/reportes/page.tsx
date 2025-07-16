'use client'

// React and Next.js hooks
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

// UI components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'

// Date-fns utilities
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  parseISO,
  isAfter,
  isBefore,
  isEqual,
} from 'date-fns'

// Chart.js components
import {
  Line,
  Bar,
  Pie
} from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Icons
import {
  Download,
  DollarSign,
  TrendingUp,
  Wallet,
  CreditCard,
  Banknote,
  Percent,
  Package,
  Eye,
} from 'lucide-react'

// Utility functions and data fetching
import { formatCurrency } from '@/lib/utils'
import { fetchAllFacturas } from '@/lib/data'

// Next.js Link component
import Link from 'next/link'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string
  value: number
  icon: React.ReactNode
}) {
  const formattedValue = formatCurrency(value)
  const [wholePart, decimalPart] = formattedValue.split(',')

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="size-8 rounded-full bg-primary/10 p-1.5 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">
          {wholePart}
          <span className="text-lg">,{decimalPart}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function InvoiceReportsDashboard() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('day')
  const [startDate, setStartDate] = useState(
    format(startOfDay(new Date()), "yyyy-MM-dd'T'HH:mm:ss")
  )
  const [endDate, setEndDate] = useState(
    format(endOfDay(new Date()), "yyyy-MM-dd'T'HH:mm:ss")
  )

  const rol = localStorage.getItem('rol')
  const router = useRouter()

  useEffect(() => {
    if (rol !== 'ADMINISTRADOR') {
      toast({
        title: 'Error',
        description: 'No tienes permisos para ver los reportes de ventas.',
        variant: 'destructive',
      })
      router.push('/dashboard')
    } else {
      fetchInvoices()
    }
  }, [rol, router])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const data = await fetchAllFacturas()
      setInvoices(data)
    } catch (error) {
      console.error('Error fetching invoices:', error)
      toast({
        title: 'Error',
        description:
          'No se pudieron cargar las facturas. Por favor, intente de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const invoiceDate = parseISO(invoice.fecha)
      const start = parseISO(startDate)
      const end = parseISO(endDate)
      return (
        (isAfter(invoiceDate, start) || isEqual(invoiceDate, start)) &&
        (isBefore(invoiceDate, end) || isEqual(invoiceDate, end))
      )
    })
  }, [invoices, startDate, endDate])

  const totalSales = useMemo(() => {
    return filteredInvoices.reduce(
      (acc, invoice) => acc + parseFloat(invoice.total),
      0
    )
  }, [filteredInvoices])

  const totalProfit = useMemo(() => {
    return filteredInvoices.reduce((acc, invoice) => {
      let invoiceProfit = 0
      if (invoice.orden_servicio) {
        invoiceProfit += invoice.orden_servicio.servicios.reduce(
          (serviceAcc, service) => serviceAcc + parseFloat(service.precio),
          0
        )
        invoiceProfit += invoice.orden_servicio.repuestos.reduce(
          (repuestoAcc, repuesto) =>
            repuestoAcc +
            (parseFloat(repuesto.precio) -
              parseFloat(repuesto.repuesto.valor_compra)) *
              repuesto.cantidad,
          0
        )
      }
      if (invoice.venta_directa) {
        invoiceProfit += invoice.venta_directa.repuestos.reduce(
          (repuestoAcc, repuesto) =>
            repuestoAcc +
            (parseFloat(repuesto.precio) -
              parseFloat(repuesto.repuesto.valor_compra)) *
              repuesto.cantidad,
          0
        )
      }
      return acc + (invoiceProfit - parseFloat(invoice.descuento))
    }, 0)
  }, [filteredInvoices])

  const salesByPaymentMethod = useMemo(() => {
    return filteredInvoices.reduce(
      (acc, invoice) => {
        acc.efectivo += parseFloat(invoice.pago_efectivo)
        acc.tarjeta += parseFloat(invoice.pago_tarjeta)
        acc.transferencia += parseFloat(invoice.pago_transferencia)
        acc.iva += parseFloat(invoice.iva)
        acc.descuento += parseFloat(invoice.descuento)
        return acc
      },
      { efectivo: 0, tarjeta: 0, transferencia: 0, iva: 0, descuento: 0 }
    )
  }, [filteredInvoices])

  const salesByDate = useMemo(() => {
    const salesMap = new Map()
    filteredInvoices.forEach((invoice) => {
      const date = format(parseISO(invoice.fecha), 'yyyy-MM-dd')
      salesMap.set(date, (salesMap.get(date) || 0) + parseFloat(invoice.total))
    })
    return Object.fromEntries(salesMap)
  }, [filteredInvoices])

  const profitByDate = useMemo(() => {
    const profitMap = new Map()
    filteredInvoices.forEach((invoice) => {
      const date = format(parseISO(invoice.fecha), 'yyyy-MM-dd')
      let invoiceProfit = 0
      if (invoice.orden_servicio) {
        invoiceProfit += invoice.orden_servicio.servicios.reduce(
          (serviceAcc, service) => serviceAcc + parseFloat(service.precio),
          0
        )
        invoiceProfit += invoice.orden_servicio.repuestos.reduce(
          (repuestoAcc, repuesto) =>
            repuestoAcc +
            (parseFloat(repuesto.precio) -
              parseFloat(repuesto.repuesto.valor_compra)) *
              repuesto.cantidad,
          0
        )
      }
      if (invoice.venta_directa) {
        invoiceProfit += invoice.venta_directa.repuestos.reduce(
          (repuestoAcc, repuesto) =>
            repuestoAcc +
            (parseFloat(repuesto.precio) -
              parseFloat(repuesto.repuesto.valor_compra)) *
              repuesto.cantidad,
          0
        )
      }
      invoiceProfit -= parseFloat(invoice.descuento)
      profitMap.set(date, (profitMap.get(date) || 0) + invoiceProfit)
    })
    return Object.fromEntries(profitMap)
  }, [filteredInvoices])

  const soldPartsAndServices = useMemo(() => {
    const partsMap = new Map()
    const servicesMap = new Map()

    filteredInvoices.forEach((invoice) => {
      if (invoice.orden_servicio) {
        invoice.orden_servicio.servicios.forEach((service) => {
          const key = service.servicio.nombre_servicio
          servicesMap.set(key, (servicesMap.get(key) || 0) + 1)
        })
        invoice.orden_servicio.repuestos.forEach((repuesto) => {
          const key = repuesto.repuesto.nombre_repuesto
          partsMap.set(key, (partsMap.get(key) || 0) + repuesto.cantidad)
        })
      }
      if (invoice.venta_directa) {
        invoice.venta_directa.repuestos.forEach((repuesto) => {
          const key = repuesto.repuesto.nombre_repuesto
          partsMap.set(key, (partsMap.get(key) || 0) + repuesto.cantidad)
        })
      }
    })

    return {
      parts: Array.from(partsMap.entries()).sort((a, b) => b[1] - a[1]),
      services: Array.from(servicesMap.entries()).sort((a, b) => b[1] - a[1]),
    }
  }, [filteredInvoices])

  const handleDateRangeChange = (value: string) => {
    setDateRange(value)
    const now = new Date()
    switch (value) {
      case 'day':
        setStartDate(format(startOfDay(now), "yyyy-MM-dd'T'HH:mm:ss"))
        setEndDate(format(endOfDay(now), "yyyy-MM-dd'T'HH:mm:ss"))
        break
      case 'week':
        setStartDate(
          format(startOfDay(subDays(now, 6)), "yyyy-MM-dd'T'HH:mm:ss")
        )
        setEndDate(format(endOfDay(now), "yyyy-MM-dd'T'HH:mm:ss"))
        break
      case 'month':
        setStartDate(
          format(startOfDay(startOfMonth(now)), "yyyy-MM-dd'T'HH:mm:ss")
        )
        setEndDate(format(endOfDay(endOfMonth(now)), "yyyy-MM-dd'T'HH:mm:ss"))
        break
      case 'year':
        setStartDate(
          format(startOfDay(startOfYear(now)), "yyyy-MM-dd'T'HH:mm:ss")
        )
        setEndDate(format(endOfDay(endOfYear(now)), "yyyy-MM-dd'T'HH:mm:ss"))
        break
    }
  }

  const lineChartData = {
    labels: Object.keys(salesByDate),
    datasets: [
      {
        label: 'Ventas Totales',
        data: Object.values(salesByDate),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Ganancias',
        data: Object.values(profitByDate),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  }

  const barChartData = {
    labels: ['Efectivo', 'Tarjeta', 'Transferencia'],
    datasets: [
      {
        label: 'Ventas por Método de Pago',
        data: [
          salesByPaymentMethod.efectivo,
          salesByPaymentMethod.tarjeta,
          salesByPaymentMethod.transferencia,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
      },
    ],
  }

  const pieChartData = {
    labels: ['Efectivo', 'Tarjeta', 'Transferencia'],
    datasets: [
      {
        data: [
          salesByPaymentMethod.efectivo,
          salesByPaymentMethod.tarjeta,
          salesByPaymentMethod.transferencia,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
      },
    ],
  }

  const downloadReport = () => {
    const csvContent = [
      [
        'Fecha',
        '# Factura',
        'Cliente',
        'Efectivo',
        'Tarjeta',
        'Transferencia',
        'Subtotal',
        'Iva',
        'Total',
        'Ganancia',
        'Descuento',
        'Total sin descuento',
      ],
      ...filteredInvoices.map((invoice) => {
        let profit = 0 - parseFloat(invoice.descuento)
        if (invoice.orden_servicio) {
          profit += invoice.orden_servicio.servicios.reduce(
            (serviceAcc, service) => serviceAcc + parseFloat(service.precio),
            0
          )
          profit += invoice.orden_servicio.repuestos.reduce(
            (repuestoAcc, repuesto) =>
              repuestoAcc +
              (parseFloat(repuesto.precio) -
                parseFloat(repuesto.repuesto.valor_compra)) *
                repuesto.cantidad,
            0
          )
        }
        if (invoice.venta_directa) {
          profit += invoice.venta_directa.repuestos.reduce(
            (repuestoAcc, repuesto) =>
              repuestoAcc +
              (parseFloat(repuesto.precio) -
                parseFloat(repuesto.repuesto.valor_compra)) *
                repuesto.cantidad,
            0
          )
        }
        return [
          format(parseISO(invoice.fecha), 'dd/MM/yyyy HH:mm:ss'),
          invoice.id_factura,
          invoice.Cliente.nombre_cliente,
          invoice.pago_efectivo,
          invoice.pago_tarjeta,
          invoice.pago_transferencia,
          invoice.subtotal,
          invoice.iva,
          invoice.total,
          profit.toFixed(2),
          invoice.descuento,
          (Number(invoice.descuento) + Number(invoice.total)).toFixed(2),
        ]
      }),
    ]
      .map((row) => row.join(';'))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute(
        'download',
        `reporte_ventas_${startDate}_${endDate}.csv`
      )
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const downloadPartsAndServicesReport = () => {
    const csvContent = [
      ['Tipo', 'Nombre', 'Cantidad'],
      ...soldPartsAndServices.parts.map((part) => ['Repuesto', ...part]),
      ...soldPartsAndServices.services.map((service) => [
        'Servicio',
        ...service,
      ]),
    ]
      .map((row) => row.join(';'))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute(
        'download',
        `reporte_repuestos_servicios_${startDate}_${endDate}.csv`
      )
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (loading) {
    return (
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-auto mt-8"></div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">
        Dashboard de Reportes de Ventas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <DashboardCard
          title="Ventas Totales (Sin descuento aplicado)"
          value={totalSales + salesByPaymentMethod.descuento}
          icon={<DollarSign className="size-full" />}
        />
        <DashboardCard
          title="Ventas Totales (Descuento aplicado)"
          value={totalSales}
          icon={<DollarSign className="size-full" />}
        />
        <DashboardCard
          title="Ganancias Totales"
          value={totalProfit}
          icon={<TrendingUp className="size-full" />}
        />
        <DashboardCard
          title="Efectivo"
          value={salesByPaymentMethod.efectivo}
          icon={<Banknote className="size-full" />}
        />
        <DashboardCard
          title="Tarjeta"
          value={salesByPaymentMethod.tarjeta}
          icon={<CreditCard className="size-full" />}
        />
        <DashboardCard
          title="Transferencia"
          value={salesByPaymentMethod.transferencia}
          icon={<Wallet className="size-full" />}
        />
        <DashboardCard
          title="IVA a Pagar"
          value={salesByPaymentMethod.iva}
          icon={<Percent className="size-full" />}
        />
        <DashboardCard
          title="Descuentos dados"
          value={salesByPaymentMethod.descuento}
          icon={<Percent className="size-full" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-1">
          <Label htmlFor="date-range">Rango de Fechas</Label>
          <Select
            onValueChange={handleDateRangeChange}
            defaultValue={dateRange}
          >
            <SelectTrigger id="date-range">
              <SelectValue placeholder="Seleccionar rango" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hoy</SelectItem>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="start-date">Fecha Inicio</Label>
          <Input
            id="start-date"
            type="date"
            value={format(parseISO(startDate), 'yyyy-MM-dd')}
            onChange={(e) =>
              setStartDate(
                format(
                  startOfDay(parseISO(e.target.value)),
                  "yyyy-MM-dd'T'HH:mm:ss"
                )
              )
            }
          />
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="end-date">Fecha Fin</Label>
          <Input
            id="end-date"
            type="date"
            value={format(parseISO(endDate), 'yyyy-MM-dd')}
            onChange={(e) =>
              setEndDate(
                format(
                  endOfDay(parseISO(e.target.value)),
                  "yyyy-MM-dd'T'HH:mm:ss"
                )
              )
            }
          />
        </div>
        <Separator className="md:col-span-4" />
        <div className="md:col-span-1 flex items-end space-x-2">
          <Button onClick={downloadReport} className="flex-1">
            <Download className="mr-2 h-4 w-4" /> Reporte de Ventas
          </Button>
          <Button onClick={downloadPartsAndServicesReport} className="flex-1">
            <Package className="mr-2 h-4 w-4" /> Reporte de Repuestos y
            Servicios
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Ventas y Ganancias por Día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => formatCurrency(value as number),
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Método de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => formatCurrency(value as number),
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Distribución de Ventas por Método de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.label || ''
                        const value = context.raw as number
                        const total = (
                          context.chart.data.datasets[0].data as number[]
                        ).reduce((a, b) => a + b, 0)
                        const percentage = ((value / total) * 100).toFixed(2)
                        return `${label}: ${formatCurrency(
                          value
                        )} (${percentage}%)`
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Repuestos Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Repuesto</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {soldPartsAndServices.parts
                  .slice(0, 10)
                  .map(([part, quantity]) => (
                    <TableRow key={part}>
                      <TableCell>{part}</TableCell>
                      <TableCell className="text-right">{quantity}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Servicios Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Servicio</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {soldPartsAndServices.services
                  .slice(0, 10)
                  .map(([service, quantity]) => (
                    <TableRow key={service}>
                      <TableCell>{service}</TableCell>
                      <TableCell className="text-right">{quantity}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalle de Facturas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]"># Factura</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Ganancia</TableHead>
                  <TableHead className="text-right">Efectivo</TableHead>
                  <TableHead className="text-right">Tarjeta</TableHead>
                  <TableHead className="text-right">Transferencia</TableHead>
                  <TableHead className="text-right">Ver</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => {
                  let profit = 0
                  if (invoice.orden_servicio) {
                    profit += invoice.orden_servicio.servicios.reduce(
                      (serviceAcc, service) =>
                        serviceAcc + parseFloat(service.precio),
                      0
                    )
                    profit += invoice.orden_servicio.repuestos.reduce(
                      (repuestoAcc, repuesto) =>
                        repuestoAcc +
                        (parseFloat(repuesto.precio) -
                          parseFloat(repuesto.repuesto.valor_compra)) *
                          repuesto.cantidad,
                      0
                    )
                    profit -= parseFloat(invoice.descuento)
                  }
                  if (invoice.venta_directa) {
                    profit += invoice.venta_directa.repuestos.reduce(
                      (repuestoAcc, repuesto) =>
                        repuestoAcc +
                        (parseFloat(repuesto.precio) -
                          parseFloat(repuesto.repuesto.valor_compra)) *
                          repuesto.cantidad,
                      0
                    )
                  }
                  return (
                    <TableRow key={invoice.id_factura}>
                      <TableCell className="font-medium">
                        {invoice.id_factura}
                      </TableCell>
                      <TableCell>
                        {format(parseISO(invoice.fecha), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell>{invoice.Cliente.nombre_cliente}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(parseFloat(invoice.total))}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(profit)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(parseFloat(invoice.pago_efectivo))}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(parseFloat(invoice.pago_tarjeta))}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(parseFloat(invoice.pago_transferencia))}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/facturas/view/${invoice.id_factura}`}
                          passHref
                        >
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
