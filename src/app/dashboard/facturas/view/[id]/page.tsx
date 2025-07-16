'use client'
// React and Next.js hooks
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// UI components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'

// Icons
import {
  ArrowLeft,
  Printer,
  FileDown,
  User,
  DollarSign,
  ShoppingCart,
  Wrench,
} from 'lucide-react'

// Data fetching and constants
import { fetchOneFactura } from '@/lib/data'
import { COMPANY_INFO } from '@/lib/constants'

// Utility functions
import { formatCurrency, formatDate } from '@/lib/utils'
import { debug } from 'console'

export default function CompactFacturaViewPage({
  params,
}: {
  params: { id: number }
}) {
  const [factura, setFactura] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        setLoading(true)
        const data = await fetchOneFactura(id)
        setFactura(data)
      } catch (error) {
        console.error('Error fetching factura:', error)
        toast({
          title: 'Error',
          description: 'No se pudo obtener la información de la factura.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFactura()
  }, [id, toast])

  const handlePrintThermal = () => {
    const thermalContent = generateThermalContent()
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
    <html>
      <head>
        <title>Voucher #${factura.id_factura}</title>
        <style>
          @page {
            margin: 0;
            size: 60mm auto;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: 'Courier New', monospace;
            font-size: 10px;
            line-height: 1.2;
            width: 60mm;
          }
          .content {
            width: 100%;
            box-sizing: border-box;
            padding: 5px;
          }
          .dark {
            font-weight: bold;
            color: #000;
            font-size: 11px;
          }
          .center { 
            text-align: center; 
            font-weight: bold;
            color: #000;
          }
          .right { text-align: right; }
          .bold { font-weight: bold; }
          .separator {
            border-bottom: 1px dashed #000;
            margin: 3px 0;
            width: 100%;
          }
          @media print {
            body { width: 60mm; }
            .content { width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="content">
          ${thermalContent}
        </div>
      </body>
    </html>
  `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  }

  const generateThermalContent = () => {
    if (!factura) return ''

    const formatLine = (text: string) => `<div class="dark">${text}</div>`
    const formatCenter = (text: string) => `<div class="center">${text}</div>`
    const formatRight = (text: string) => `<div class="right">${text}</div>`
    const separator = '<div class="separator"></div>'

    const items = factura.OrdenServicio
      ? [
          ...factura.OrdenServicio.ServicioOrdenServicio?.map((s) => ({
            name: s.Servicio.nombre_servicio,
            quantity: 1,
            price: parseFloat(s.precio),
          })) || [],
          ...factura.OrdenServicio.RepuestoOrdenServicio?.map((r) => ({
            name: r.Repuesto.nombre_repuesto,
            quantity: r.cantidad,
            price: parseFloat(r.precio),
          })) || [],
        ]
      : factura.VentaDirecta
      ? factura.VentaDirecta.RepuestoVenta?.map((r) => ({
          name: r.Repuesto.nombre_repuesto,
          quantity: r.cantidad,
          price: parseFloat(r.precio),
        })) || []
      : []

    const itemsHtml = items
      .map(
        (item) => `
        ${formatLine(`${item.name}`)}
        ${formatLine(`${item.quantity} x ${formatCurrency(item.price)}`)}
        ${formatRight(`${formatCurrency(item.quantity * item.price)}`)}
      `
      )
      .join('')

    const date = new Date(factura.fecha)
    const formattedDate = date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    const formattedTime = date.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

    return `
    ${formatCenter(COMPANY_INFO.name)}
    ${formatCenter(`NIT: ${COMPANY_INFO.nit}`)}
    ${formatCenter(COMPANY_INFO.address)}
    ${formatCenter(COMPANY_INFO.phone)}
    ${separator}
    ${formatLine(`Factura #${factura.id_factura}`)}
    ${formatLine(`Fecha: ${formattedDate}`)}
    ${formatLine(`Hora: ${formattedTime}`)}
    ${formatLine(`Cliente: ${factura.Cliente?.nombre_cliente}`)}
    ${formatLine(`Cédula: ${factura.Cliente?.cedula}`)}
    ${formatLine(`Vendedor: ${factura.vendedor}`)}
    ${separator}
    ${formatLine('Descripción Cant Precio Total')}
    ${separator}
    ${itemsHtml}
    ${separator}
    ${formatRight(
      `<span class="bold">Valor: ${formatCurrency(
        Number(factura.subtotal) + Number(factura.descuento)
      )}</span>`
    )}
    ${formatRight(`<span class="bold">Descuento: ${formatCurrency(Number(factura.descuento))}</span>`)}
    ${formatRight(`<span class="bold">Subtotal: ${formatCurrency(Number(factura.subtotal))}</span>`)}
    ${formatRight(`<span class="bold">IVA: ${formatCurrency(Number(factura.iva))}</span>`)}
    ${formatRight(`<span class="bold">Total: ${formatCurrency(Number(factura.total))}</span>`)}
    ${separator}
    ${formatLine('Forma de pago:')}
    ${formatLine(`Efectivo: ${formatCurrency(Number(factura.pago_efectivo))}`)}
    ${formatLine(`Tarjeta: ${formatCurrency(Number(factura.pago_tarjeta))}`)}
    ${formatLine(
      `Transferencia: ${formatCurrency(Number(factura.pago_transferencia))}`
    )}
    ${separator}
    ${formatCenter('¡Gracias por su compra!')}
    ${formatCenter('Vuelva pronto')}
  `
  }

  const handlePrintStandard = () => {
    if (!factura) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const items = factura.OrdenServicio
      ? [
          ...factura.OrdenServicio.ServicioOrdenServicio?.map((s) => ({
            name: s.Servicio.nombre_servicio,
            quantity: 1,
            price: parseFloat(s.precio),
            type: 'Servicio',
          })) || [],
          ...factura.OrdenServicio.RepuestoOrdenServicio?.map((r) => ({
            name: r.Repuesto.nombre_repuesto,
            quantity: r.cantidad,
            price: parseFloat(r.precio),
            type: 'Repuesto',
          })) || [],
        ]
      : factura.VentaDirecta
      ? factura.VentaDirecta.RepuestoVenta?.map((r) => ({
          name: r.Repuesto.nombre_repuesto,
          quantity: r.cantidad,
          price: parseFloat(r.precio),
          type: 'Repuesto',
        })) || []
      : []

    const itemsHtml = items
      .map(
        (item) => `
  <tr style="height: 2px;">
    <td style="font-size: 6px; padding: 1px;">${item.name}</td>
    <td style="font-size: 6px; padding: 1px;">${item.type}</td>
    <td style="font-size: 6px; padding: 1px;" class="text-right">${
      item.quantity
    }</td>
    <td style="font-size: 6px; padding: 1px;" class="text-right">${formatCurrency(
      item.price
    )}</td>
    <td style="font-size: 6px; padding: 1px;" class="text-right">${formatCurrency(
      item.quantity * item.price
    )}</td>
  </tr>
`
      )
      .join('')

    printWindow.document.write(`
  <html>
    <head>
      <title>Factura #${factura.id_factura}</title>
      <style>
        @page { 
          size: A4; 
          margin: 0; 
        }
        * {
          box-sizing: border-box;
        }
        body { 
          font-family: Arial, sans-serif; 
          font-size: 10px; 
          line-height: 1; 
          color: #333; 
          margin: 0; 
          padding: 5mm;
          min-height: 100vh;
        }
        .container { 
          position: relative;
          min-height: calc(100vh - 10mm);
          max-width: 100%;
          padding-bottom: 20px;
        }
        .header { 
          display: flex; 
          justify-content: space-between; 
          align-items: start; 
          margin-bottom: 5px;
        }
        .logo { 
          width: 60px; 
          height: auto;
        }
        .company-info { 
          text-align: right; 
          font-size: 7px;
        }
        h1 { 
          font-size: 13px; 
          margin: 0 0 2px; 
          color: #333;
        }
        h2 { 
          font-size: 12px; 
          margin: 0 0 2px; 
          color: #333;
        }
        h3 { 
          font-size: 11px; 
          margin: 0 0 2px; 
          color: #333;
        }
        p { 
          margin: 0 0 1px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-bottom: 5px;
          font-size: 6px;
        }
        th, td { 
          height: 2px;
          border: 0.5px solid #ddd; 
          padding: 1px; 
          text-align: left;
        }
        th { 
          height: 2px;
          background-color: #FE7500 !important; 
          color: white; 
          font-weight: bold;
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }
        .text-right { 
          text-align: right;
        }
        .total { 
          font-weight: bold;
        }
        .footer { 
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          text-align: center; 
          font-size: 10px; 
          color: #666;
          padding-top: 3px;
          border-top: 0.5px solid #eee;
        }
        .details-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          gap: 5px;
        }
        .details-column {
          flex: 1;
        }
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          th {
            background-color: #FE7500 !important;
            color: white !important;
          }
          .container {
            min-height: 0;
            height: auto;
          }
          .footer {
            position: relative;
            margin-top: 5px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${COMPANY_INFO.logo}" alt="Logo" class="logo">
          <div class="company-info">
            <h1>${COMPANY_INFO.name}</h1>
            <p>NIT: ${COMPANY_INFO.nit}</p>
            <p>${COMPANY_INFO.address}</p>
            <p>${COMPANY_INFO.phone}</p>
          </div>
        </div>
        
        <div class="details-section">
          <div class="details-column">
            <h2>Factura #${factura.id_factura}</h2>
            <p>Fecha: ${formatDate(new Date(factura.fecha))}</p>
          </div>
          <div class="details-column">
            <h3>Cliente</h3>
            <p>${factura.Cliente?.nombre_cliente}</p>
            <p>Cédula: ${factura.Cliente?.cedula}</p>
            <p>Correo: ${factura.Cliente?.correo}</p>
            <p>Teléfono: ${factura.Cliente?.telefono}</p>
            <h3>Vendedor</h3>
            <p>Nombre del vendedor: ${factura.vendedor}</p>
          </div>
        </div>
        
        ${
          factura.OrdenServicio
            ? `
            <div style="margin-bottom: 5px;">
              <h3>Orden de Servicio #${factura.OrdenServicio.id_orden_servicio}</h3>
              <p>Estado: ${factura.OrdenServicio.estado}</p>
              <p>Moto: ${factura.OrdenServicio.MotoCliente?.marca} ${factura.OrdenServicio.MotoCliente?.modelo} 
              (${factura.OrdenServicio.MotoCliente?.ano}) - Placa: ${factura.OrdenServicio.MotoCliente?.placa}</p>
            </div>
            `
            : ''
        }
        
        <table>
          <thead>
            <tr style="height: 2px;">
              <th style="width: 35%; font-size: 10px;">Descripción</th>
              <th style="width: 15%; font-size: 10px;">Tipo</th>
              <th style="width: 15%; font-size: 10px;" class="text-right">Cantidad</th>
              <th style="width: 15%; font-size: 10px;" class="text-right">Precio Unitario</th>
              <th style="width: 20%; font-size: 10px;" class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="text-right" style="font-size: 10px;"><strong>Valor:</strong></td>
              <td class="text-right" style="font-size: 10px;">${formatCurrency(
                Number(factura.descuento) + Number(factura.subtotal)
              )}</td>
            </tr>
            <tr>
              <td colspan="4" class="text-right" style="font-size: 10px;"><strong>Descuento:</strong></td>
              <td class="text-right" style="font-size: 10px;">${formatCurrency(
                Number(factura.descuento)
              )}</td>
            </tr>
            <tr>
              <td colspan="4" class="text-right" style="font-size: 10px;"><strong>Subtotal:</strong></td>
              <td class="text-right" style="font-size: 10px;">${formatCurrency(
                Number(factura.subtotal)
              )}</td>
            </tr>
            <tr>
              <td colspan="4" class="text-right" style="font-size: 10px;"><strong>IVA:</strong></td>
              <td class="text-right" style="font-size: 10px;">${formatCurrency(
                Number(factura.iva)
              )}</td>
            </tr>
            <tr class="total">
              <td colspan="4" class="text-right" style="font-size: 10px;"><strong>Total:</strong></td>
              <td class="text-right" style="font-size: 10px;">${formatCurrency(
                Number(factura.total)
              )}</td>
            </tr>
          </tfoot>
        </table>

        ${
          factura.OrdenServicio
            ? ` <div>
          <h3 style="font-size: 8px; margin-bottom: 1px;">Observaciones</h3>
          <span>${factura.OrdenServicio.observaciones_factura}</span>
        </div>`
            : `
        <div class="details-section">
          <div class="details-column">
            <h3 style="font-size: 8px; margin-bottom: 1px;">Detalles de Pago</h3>
            <table>
              <thead>
                <tr>
                  <th style="font-size: 10px;">Método de Pago</th>
                  <th style="font-size: 10px;" class="text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-size: 10px;">Efectivo</td>
                  <td style="font-size: 10px;" class="text-right">${formatCurrency(
                    Number(factura.pago_efectivo)
                  )}</td>
                </tr>
                <tr>
                  <td style="font-size: 10px;">Tarjeta</td>
                  <td style="font-size: 10px;" class="text-right">${formatCurrency(
                    Number(factura.pago_tarjeta)
                  )}</td>
                </tr>
                <tr>
                  <td style="font-size: 10px;">Transferencia</td>
                  <td style="font-size: 10px;" class="text-right">${formatCurrency(
                    Number(factura.pago_transferencia)
                  )}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> `
        }

        <div class="footer">
          <p>Gracias por su preferencia. ¡Esperamos verle pronto!</p>
          <p>Este documento es una representación impresa de una factura electrónica.</p>
        </div>
      </div>
    </body>
  </html>
`)

    printWindow.document.close()
    printWindow.focus()

    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const handleGenerateXML = () => {
    if (!factura) return

    const items = factura.OrdenServicio
      ? [
          ...factura.OrdenServicio.ServicioOrdenServicio?.map((s) => ({
            nombre: s.Servicio.nombre_servicio,
            cantidad: 1,
            precio: parseFloat(s.precio),
          })) || [],
          ...factura.OrdenServicio.RepuestoOrdenServicio?.map((r) => ({
            nombre: r.Repuesto.nombre_repuesto,
            cantidad: r.cantidad,
            precio: parseFloat(r.precio),
          })) || [],
        ]
      : factura.VentaDirecta
      ? factura.VentaDirecta.RepuestoVenta?.map((r) => ({
          nombre: r.Repuesto.nombre_repuesto,
          cantidad: r.cantidad,
          precio: parseFloat(r.precio),
        })) || []
      : []

    const itemsXml = items
      .map(
        (item) => `
      <item>
        <nombre>${item.nombre}</nombre>
        <cantidad>${item.cantidad}</cantidad>
        <precio>${formatCurrency(item.precio)}</precio>
      </item>
    `
      )
      .join('')

    const xml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <factura>
        <id_de_factura>${factura.id_factura}</id_de_factura>
        <fecha>${factura.fecha}</fecha>
        <emisor>
          <nombre>${COMPANY_INFO.name}</nombre>
          <nit>${COMPANY_INFO.nit}</nit>
          <direccion>${COMPANY_INFO.address}</direccion>
          <telefono>${COMPANY_INFO.phone}</telefono>
          <correo>${COMPANY_INFO.email}</correo>
          <vendedor>${factura.vendedor}</vendedor>
        </emisor>
        <receptor>
          <nombre>${factura.Cliente?.nombre_cliente}</nombre>
          <cedula>${factura.Cliente?.cedula}</cedula>
          <correo>${factura.Cliente?.correo}</correo>
          <telefono>${factura.Cliente?.telefono}</telefono>
        </receptor>
        <items>
          ${itemsXml}
        </items>
        <valor>${Number(factura.subtotal) + Number(factura.descuento)}</valor>
        <descuento>${factura.descuento}</descuento>
        <subtotal>${factura.subtotal}</subtotal>
        <iva>${factura.iva}</iva>
        <total>${factura.total}</total>
      </factura>
    `

    const blob = new Blob([xml], { type: 'text/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `factura_${factura.id_factura}.xml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-auto mt-8"></div>
    )
  }

  if (!factura) {
    return (
      <p className="text-center mt-8">
        No se encontró información de la factura.
      </p>
    )
  }

  return (
    <div className="container mx-auto py-4 space-y-4 print:py-0">
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-2xl font-bold">Factura #{factura.id_factura}</h1>
        <div className="space-x-2">
          <Button
            onClick={() => router.push('/dashboard/facturas')}
            size="sm"
            variant="outline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Volver
          </Button>
          <Button onClick={handlePrintStandard} size="sm">
            <Printer className="mr-1 h-4 w-4" /> Imprimir
          </Button>
          <Button onClick={handlePrintThermal} size="sm">
            <Printer className="mr-1 h-4 w-4" /> Voucher
          </Button>
          <Button onClick={handleGenerateXML} size="sm">
            <FileDown className="mr-1 h-4 w-4" /> XML
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm flex items-center">
              <DollarSign className="mr-1 h-4 w-4" /> Resumen de Factura
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 text-sm">
            <div className="grid grid-cols-2 gap-1">
              <span className="font-semibold">Fecha:</span>
              <span>{formatDate(new Date(factura.fecha))}</span>
              <span className="font-semibold">Valor:</span>
              <span>
                {formatCurrency(
                  Number(factura.subtotal) + Number(factura.descuento)
                )}
              </span>
              <span className="font-semibold">Descuento:</span>
              <span>{formatCurrency(Number(factura.descuento))}</span>
              <span className="font-semibold">Subtotal:</span>
              <span>{formatCurrency(Number(factura.subtotal))}</span>
              <span className="font-semibold">IVA:</span>
              <span>{formatCurrency(Number(factura.iva))}</span>
              <span className="font-semibold">Total:</span>
              <span className="font-bold">
                {formatCurrency(Number(factura.total))}
              </span>
              <span className="font-semibold">Vendedor:</span>
              <span>{factura.vendedor}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm flex items-center">
              <User className="mr-1 h-4 w-4" /> Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 text-sm">
            <div className="grid grid-cols-2 gap-1">
              <span className="font-semibold">Nombre:</span>
              <span>{factura.Cliente?.nombre_cliente}</span>
              <span className="font-semibold">Cédula:</span>
              <span>{factura.Cliente?.cedula}</span>
              <span className="font-semibold">Correo:</span>
              <span>{factura.Cliente?.correo}</span>
              <span className="font-semibold">Teléfono:</span>
              <span>{factura.Cliente?.telefono}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm flex items-center">
            {factura.OrdenServicio ? (
              <Wrench className="mr-1 h-4 w-4" />
            ) : (
              <ShoppingCart className="mr-1 h-4 w-4" />
            )}
            {factura.OrdenServicio ? 'Orden de Servicio' : 'Venta'}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          {factura.OrdenServicio && (
            <div className="mb-2 text-sm">
              <p>
                <span className="font-semibold">Número de Orden:</span>{' '}
                {factura.OrdenServicio.id_orden_servicio}
              </p>
              <p>
                <span className="font-semibold">Estado:</span>{' '}
                <Badge>{factura.OrdenServicio.estado}</Badge>
              </p>
              <p>
                <span className="font-semibold">Moto:</span>{' '}
                {factura.OrdenServicio.MotoCliente?.marca}{' '}
                {factura.OrdenServicio.MotoCliente?.modelo} (
                {factura.OrdenServicio.MotoCliente?.ano}) - Placa:{' '}
                {factura.OrdenServicio.MotoCliente?.placa}
              </p>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Cant.</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(
                factura.OrdenServicio? [
                    ...factura.OrdenServicio.ServicioOrdenServicio?.map((s) => ({
                      name: s.Servicio.nombre_servicio,
                      type: 'Servicio',
                      quantity: 1,
                      price: Number(s.precio),
                    })) || [],
                    ...factura.OrdenServicio.RepuestoOrdenServicio?.map((r) => ({
                      name: r.Repuesto.nombre_repuesto,
                      type: 'Repuesto',
                      quantity: r.cantidad,
                      price: Number(r.precio),
                    })) || [],
                  ]
                : factura.VentaDirecta?.RepuestoVenta?.map((r) => ({
                    name: r.Repuesto.nombre_repuesto,
                    type: 'Repuesto',
                    quantity: r.cantidad,
                    price: Number(r.precio),
                  })) || []
              ).map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="py-1">{item.name}</TableCell>
                  <TableCell className="py-1">{item.type}</TableCell>
                  <TableCell className="py-1 text-right">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="py-1 text-right">
                    {formatCurrency(item.price)}
                  </TableCell>
                  <TableCell className="py-1 text-right">
                    {formatCurrency(item.quantity * item.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm flex items-center">
            <DollarSign className="mr-1 h-4 w-4" /> Pagos
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2 text-sm">
          <div className="grid grid-cols-2 gap-1">
            <span className="font-semibold">Efectivo:</span>
            <span>{formatCurrency(Number(factura.pago_efectivo))}</span>
            <span className="font-semibold">Tarjeta:</span>
            <span>{formatCurrency(Number(factura.pago_tarjeta))}</span>
            <span className="font-semibold">Transferencia:</span>
            <span>{formatCurrency(Number(factura.pago_transferencia))}</span>
            <span className="font-semibold">Total Pagado:</span>
            <span className="font-bold">
              {formatCurrency(
                Number(factura.pago_efectivo) +
                  Number(factura.pago_tarjeta) +
                  Number(factura.pago_transferencia)
              )}
            </span>
          </div>
        </CardContent>
      </Card>

      {factura.OrdenServicio?.observaciones && (
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Trabajo a relizar</CardTitle>
          </CardHeader>
          <CardContent className="py-2 text-sm">
            <p>{factura.OrdenServicio.observaciones}</p>
          </CardContent>
        </Card>
      )}
      {factura.OrdenServicio?.observaciones_mecanico && (
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Diagnóstico del mecánico</CardTitle>
          </CardHeader>
          <CardContent className="py-2 text-sm">
            <p>{factura.OrdenServicio.observaciones_mecanico}</p>
          </CardContent>
        </Card>
      )}
      {factura.OrdenServicio?.observaciones_factura && (
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm">Observaciones</CardTitle>
          </CardHeader>
          <CardContent className="py-2 text-sm">
            <p>{factura.OrdenServicio.observaciones_factura}</p>
          </CardContent>
        </Card>
      )}

      {/* <Card className="print:hidden">
        <CardHeader className="py-2">
          <CardTitle className="text-sm flex items-center">
            <Printer className="mr-1 h-4 w-4" /> Vista previa de voucher
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="bg-gray-100 p-2 rounded-md overflow-x-auto">
            <pre
              className="whitespace-pre-wrap font-mono text-xs"
              style={{ width: '80mm' }}
            >
              {generateThermalContent()}
            </pre>
          </div>
          <p className="mt-2 text-xs text-gray-600">
            Nota: La vista previa puede no reflejar con precisión cómo se verá
            en una impresora térmica real.
          </p>
        </CardContent>
      </Card> */}
    </div>
  )
}
