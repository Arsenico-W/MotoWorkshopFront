'use client'

// React and hooks
import React, { useState, useEffect, useCallback, useMemo } from 'react'

// React Hook Form and Zod
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// UI components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Search, Printer, Minus, Plus, User, Mail, Phone } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

// Utility functions and constants
import { cn, formatCurrency } from '@/lib/utils'
import { fetchFilteredRepuestos, fetchFilteredServicios } from '@/lib/data'
import { Repuesto, Servicio } from '@/lib/interfaces'
import { COMPANY_INFO } from '@/lib/constants'
import { toast } from '@/components/ui/use-toast'

const formSchema = z.object({
  clientName: z.string().min(1, 'El nombre del cliente es requerido'),
  clientEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  clientPhone: z.string().optional(),
  servicios: z.array(
    z.object({
      id_servicio: z.number().int().positive('El ID del servicio es requerido'),
      nombre_servicio: z.string(),
      precio: z.number().min(0, 'El precio del servicio es requerido'),
    })
  ),
  repuestos: z.array(
    z.object({
      id_repuesto: z.number().int().positive('El ID del repuesto es requerido'),
      nombre_repuesto: z.string(),
      cantidad: z.number().int().positive('La cantidad es requerida'),
      precio: z.number().min(0, 'El precio del repuesto es requerido'),
    })
  ),
  observaciones: z.string().optional(),
  subtotal_sin_descuento: z.number().min(0),
  descuento_porcentaje: z.number().min(0).max(100),
  descuento_valor: z.number().min(0),
  subtotal: z.number().min(0),
  iva_porcentaje: z.number().min(0).max(100),
  iva: z.number().min(0),
  total: z.number().min(0),
})

type FormValues = z.infer<typeof formSchema>

export default function CompactQuotationPage() {
  const [repuestoSearch, setRepuestoSearch] = useState('')
  const [servicioSearch, setServicioSearch] = useState('')
  const [repuestos, setRepuestos] = useState<Repuesto[]>([])
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [formattedServicioPrices, setFormattedServicioPrices] = useState<
    string[]
  >([])
  const [isSearching, setIsSearching] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      servicios: [],
      repuestos: [],
      observaciones: '',
      subtotal_sin_descuento: 0,
      descuento_porcentaje: 0,
      descuento_valor: 0,
      subtotal: 0,
      iva_porcentaje: 19,
      iva: 0,
      total: 0,
    },
  })

  const {
    fields: serviciosFields,
    append: appendServicio,
    remove: removeServicio,
  } = useFieldArray({
    control: form.control,
    name: 'servicios',
  })

  const {
    fields: repuestosFields,
    append: appendRepuesto,
    remove: removeRepuesto,
    update: updateRepuesto,
  } = useFieldArray({
    control: form.control,
    name: 'repuestos',
  })

  const searchRepuestos = useCallback(async () => {
    setIsSearching(true)
    try {
      const results = await fetchFilteredRepuestos(repuestoSearch, 1, 50)
      setRepuestos(results)
    } catch (error) {
      console.error('Error al buscar repuestos:', error)
      toast({
        title: 'Error',
        description:
          'No se pudieron cargar los repuestos. Por favor, intente de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsSearching(false)
    }
  }, [repuestoSearch])

  const searchServicios = useCallback(async () => {
    setIsSearching(true)
    try {
      const results = await fetchFilteredServicios(servicioSearch, 1, 50)
      setServicios(results)
    } catch (error) {
      console.error('Error al buscar servicios:', error)
      toast({
        title: 'Error',
        description:
          'No se pudieron cargar los servicios. Por favor, intente de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsSearching(false)
    }
  }, [servicioSearch])

  useEffect(() => {
    if (repuestoSearch) searchRepuestos()
  }, [repuestoSearch, searchRepuestos])

  useEffect(() => {
    if (servicioSearch) searchServicios()
  }, [servicioSearch, searchServicios])

  const calculateTotals = useMemo(() => {
    const repuestosTotal = form
      .watch('repuestos')
      .reduce((acc, repuesto) => acc + repuesto.precio * repuesto.cantidad, 0)
    const serviciosTotal = form
      .watch('servicios')
      .reduce((acc, servicio) => acc + servicio.precio, 0)
    const subtotalSinDescuento = repuestosTotal + serviciosTotal
    const descuentoPorcentaje = form.watch('descuento_porcentaje')
    const descuentoValor = (subtotalSinDescuento * descuentoPorcentaje) / 100
    const subtotal = subtotalSinDescuento - descuentoValor
    const ivaPorcentaje = form.watch('iva_porcentaje')
    const iva = (repuestosTotal * ivaPorcentaje) / 100
    const total = subtotal + iva

    return { subtotalSinDescuento, descuentoValor, subtotal, iva, total }
  }, [
    form.watch('repuestos'),
    form.watch('servicios'),
    form.watch('descuento_porcentaje'),
    form.watch('iva_porcentaje'),
  ])

  useEffect(() => {
    form.setValue(
      'subtotal_sin_descuento',
      calculateTotals.subtotalSinDescuento
    )
    form.setValue('descuento_valor', calculateTotals.descuentoValor)
    form.setValue('subtotal', calculateTotals.subtotal)
    form.setValue('iva', calculateTotals.iva)
    form.setValue('total', calculateTotals.total)
  }, [calculateTotals, form])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleQuantityChange = useCallback(
    (index: number, newQuantity: number) => {
      const currentRepuesto = form.getValues(`repuestos.${index}`)
      updateRepuesto(index, { ...currentRepuesto, cantidad: newQuantity })
    },
    [form, updateRepuesto]
  )

  const handleServicioPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const value = e.target.value
      form.setValue(`servicios.${index}.precio`, Number(value))
      const newFormattedPrices = [...formattedServicioPrices]
      newFormattedPrices[index] = value ? formatCurrency(parseFloat(value)) : ''
      setFormattedServicioPrices(newFormattedPrices)
    },
    [form, formattedServicioPrices]
  )

  const handleRemoveServicio = useCallback(
    (index: number) => {
      removeServicio(index)
      setFormattedServicioPrices((prev) => prev.filter((_, i) => i !== index))
    },
    [removeServicio]
  )

  const handleRemoveRepuesto = useCallback(
    (index: number) => {
      removeRepuesto(index)
    },
    [removeRepuesto]
  )

  return (
    <FormProvider {...form}>
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-only,
            .print-only * {
              visibility: visible;
            }
            .print-only {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}</style>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cotización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" aria-hidden="true" />
                <Input
                  {...form.register('clientName')}
                  placeholder="Nombre del cliente"
                  aria-label="Nombre del cliente"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <Input
                  {...form.register('clientEmail')}
                  type="email"
                  placeholder="Email del cliente"
                  aria-label="Email del cliente"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <Input
                  {...form.register('clientPhone')}
                  placeholder="Teléfono del cliente"
                  aria-label="Teléfono del cliente"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Servicios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={servicioSearch}
                  onChange={(e) => setServicioSearch(e.target.value)}
                  placeholder="Buscar servicio"
                  aria-label="Buscar servicio"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={searchServicios}
                  disabled={isSearching}
                  aria-label="Buscar"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              {servicios.length > 0 && (
                <Select
                  onValueChange={(value) => {
                    const servicio = servicios.find(
                      (s) => s.id_servicio === parseInt(value)
                    )
                    if (servicio) {
                      appendServicio({
                        id_servicio: servicio.id_servicio,
                        nombre_servicio: servicio.nombre_servicio,
                        precio: 0,
                      })
                      setFormattedServicioPrices((prev) => [...prev, '$ 0'])
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar servicio" />
                  </SelectTrigger>
                  <SelectContent className="overflow-auto h-[200px]">
                    {servicios.map((servicio) => (
                      <SelectItem
                        key={servicio.id_servicio}
                        value={servicio.id_servicio.toString()}
                      >
                        {servicio.nombre_servicio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead className="w-[50px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviciosFields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium">
                        {field.nombre_servicio}
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`servicios.${index}.precio`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div>
                                  <Input
                                    type="number"
                                    placeholder="Ingresa el precio"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e)
                                      handleServicioPriceChange(e, index)
                                    }}
                                    aria-label={`Precio de ${form.getValues(
                                      `servicios.${index}.nombre_servicio`
                                    )}`}
                                  />
                                  <div className="mt-1 text-sm text-gray-500">
                                    {formattedServicioPrices[index]} COP
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveServicio(index)}
                          aria-label={`Eliminar ${field.nombre_servicio}`}
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Repuestos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={repuestoSearch}
                  onChange={(e) => setRepuestoSearch(e.target.value)}
                  placeholder="Buscar repuesto"
                  aria-label="Buscar repuesto"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={searchRepuestos}
                  disabled={isSearching}
                  aria-label="Buscar"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              {repuestos.length > 0 && (
                <Select
                  onValueChange={(value) => {
                    const repuesto = repuestos.find(
                      (r) => r.id_repuesto === parseInt(value)
                    )
                    if (repuesto) {
                      appendRepuesto({
                        id_repuesto: repuesto.id_repuesto,
                        nombre_repuesto: repuesto.nombre_repuesto,
                        cantidad: 1,
                        precio: Number(repuesto.valor_unitario),
                      })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar repuesto" />
                  </SelectTrigger>
                  <SelectContent className="overflow-auto h-[200px]">
                    {repuestos.map((repuesto) => (
                      <SelectItem
                        key={repuesto.id_repuesto}
                        value={repuesto.id_repuesto.toString()}
                      >
                        {repuesto.nombre_repuesto} -{' '}
                        {formatCurrency(
                          Number(repuesto.valor_unitario) +
                            Number(repuesto.valor_unitario * 0.19)
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Repuesto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-[50px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repuestosFields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium">
                        {field.nombre_repuesto}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              handleQuantityChange(
                                index,
                                Math.max(1, field.cantidad - 1)
                              )
                            }
                            aria-label={`Disminuir cantidad de ${field.nombre_repuesto}`}
                          >
                            <Minus className="h-3 w-3" aria-hidden="true" />
                          </Button>
                          <span className="w-8 text-center">
                            {field.cantidad}
                          </span>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              handleQuantityChange(index, field.cantidad + 1)
                            }
                            aria-label={`Aumentar cantidad de ${field.nombre_repuesto}`}
                          >
                            <Plus className="h-3 w-3" aria-hidden="true" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(field.precio)}</TableCell>
                      <TableCell>
                        {formatCurrency(field.cantidad * field.precio)}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveRepuesto(index)}
                          aria-label={`Eliminar ${field.nombre_repuesto}`}
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resumen Financiero</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Valor</Label>
                <Input
                  value={formatCurrency(form.watch('subtotal_sin_descuento'))}
                  readOnly
                  className="text-right"
                  aria-label="Valor total sin descuento"
                />
              </div>
              <div>
                <Label className="text-xs">Descuento (%)</Label>
                <Input
                  type="number"
                  {...form.register('descuento_porcentaje', {
                    valueAsNumber: true,
                  })}
                  min="0"
                  max="100"
                  step="0.01"
                  className="text-right"
                  aria-label="Porcentaje de descuento"
                />
              </div>
              <div>
                <Label className="text-xs">Valor del Descuento</Label>
                <Input
                  value={formatCurrency(form.watch('descuento_valor'))}
                  readOnly
                  className="text-right"
                  aria-label="Valor del descuento"
                />
              </div>
              <div>
                <Label className="text-xs">Subtotal</Label>
                <Input
                  value={formatCurrency(form.watch('subtotal'))}
                  readOnly
                  className="text-right"
                  aria-label="Subtotal"
                />
              </div>
              <div>
                <Label className="text-xs">IVA (%)</Label>
                <Input
                  type="number"
                  {...form.register('iva_porcentaje', {
                    valueAsNumber: true,
                  })}
                  min="0"
                  max="100"
                  step="0.01"
                  className="text-right"
                  aria-label="Porcentaje de IVA"
                />
              </div>
              <div>
                <Label className="text-xs">IVA (solo repuestos)</Label>
                <Input
                  value={formatCurrency(form.watch('iva'))}
                  readOnly
                  className="text-right"
                  aria-label="IVA"
                />
              </div>
              <div>
                <Label className="text-xs">Total</Label>
                <Input
                  value={formatCurrency(form.watch('total'))}
                  readOnly
                  className="text-right font-bold"
                  aria-label="Total"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Observaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              {...form.register('observaciones')}
              placeholder="Observaciones adicionales"
              rows={3}
              aria-label="Observaciones"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="button" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
            Imprimir Cotización
          </Button>
        </div>

        <div className="print-only">
          <div className="text-xs">
            <div className="flex justify-between items-center mb-2">
              <img src={COMPANY_INFO.logo} alt="Logo" className="w-1/4" />
              <div className="text-right">
                <h1 className="text-sm font-bold">{COMPANY_INFO.name}</h1>
                <p>
                  NIT: {COMPANY_INFO.nit} | {COMPANY_INFO.address}
                </p>
                <p>
                  Tel: {COMPANY_INFO.phone} | Email: {COMPANY_INFO.email}
                </p>
              </div>
            </div>

            <h2 className="text-sm font-semibold mb-1">Cotización</h2>

            <div className="mb-2">
              <p>
                <strong>Cliente:</strong> {form.watch('clientName')} |{' '}
                <strong>Email:</strong> {form.watch('clientEmail')} |{' '}
                <strong>Teléfono:</strong> {form.watch('clientPhone')}
              </p>
            </div>

            <table className="w-full mb-2 text-[8px] ">
              <thead>
                <tr className="border-b">
                  <th className="text-left ">Descripción</th>
                  <th className="text-right">Cantidad</th>
                  <th className="text-right">Precio Unitario</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {serviciosFields.map((servicio, index) => (
                  <tr key={servicio.id} className="border-b">
                    <td>{servicio.nombre_servicio}</td>
                    <td className="text-right">1</td>
                    <td className="text-right">
                      {formatCurrency(form.watch(`servicios.${index}.precio`))}
                    </td>
                    <td className="text-right">
                      {formatCurrency(form.watch(`servicios.${index}.precio`))}
                    </td>
                  </tr>
                ))}
                {repuestosFields.map((repuesto, index) => (
                  <tr key={repuesto.id} className="border-b">
                    <td>{repuesto.nombre_repuesto}</td>
                    <td className="text-right">{repuesto.cantidad}</td>
                    <td className="text-right">
                      {formatCurrency(repuesto.precio)}
                    </td>
                    <td className="text-right">
                      {formatCurrency(repuesto.cantidad * repuesto.precio)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right text-[8px]">
              <p>
                <strong>Valor:</strong>{' '}
                {formatCurrency(form.watch('subtotal_sin_descuento'))}
              </p>
              <p>
                <strong>Descuento:</strong>{' '}
                {formatCurrency(form.watch('descuento_valor'))}
              </p>
              <p>
                <strong>Subtotal:</strong>{' '}
                {formatCurrency(form.watch('subtotal'))}
              </p>
              <p>
                <strong>
                  IVA ({form.watch('iva_porcentaje')}% solo en repuestos):
                </strong>{' '}
                {formatCurrency(form.watch('iva'))}
              </p>
              <p className="text-sm font-bold">
                <strong>Total:</strong> {formatCurrency(form.watch('total'))}
              </p>
            </div>

            {form.watch('observaciones') && (
              <div className="mt-2 text-[8px]">
                <h3 className="font-semibold">Observaciones:</h3>
                <p>{form.watch('observaciones')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  )
}
