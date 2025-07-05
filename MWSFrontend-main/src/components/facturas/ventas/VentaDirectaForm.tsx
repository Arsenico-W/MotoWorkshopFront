'use client'
// React and hooks
import { useState, useEffect, useCallback } from 'react'

// Form handling and validation
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useForm,
  useFieldArray,
  Controller,
  FormProvider,
} from 'react-hook-form'
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
import { toast } from '@/components/ui/use-toast'
import {
  CalendarIcon,
  Minus,
  Search,
  Loader2,
  User,
  Phone,
  CreditCard,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn, formatCurrency } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

// Data fetching and interfaces
import { fetchFilteredClientes, fetchFilteredRepuestos } from '@/lib/data'
import { Cliente, Repuesto } from '@/lib/interfaces'

// Validation schema
import { ventaFormSchema } from '@/lib/zodSchemas'

type FormValues = z.infer<typeof ventaFormSchema>

interface VentaDirectaFormProps {
  initialData?: any
  onSubmit: (data: FormValues) => Promise<void>
}

export default function VentaDirectaForm({
  initialData,
  onSubmit,
}: VentaDirectaFormProps) {
  const [clienteSearch, setClienteSearch] = useState('')
  const [repuestoSearch, setRepuestoSearch] = useState('')
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [repuestos, setRepuestos] = useState<Repuesto[]>([])
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [formattedRepuestoPrices, setFormattedRepuestoPrices] = useState<
    string[]
  >([])
  const [cashReceived, setCashReceived] = useState(0)
  const [changeAmount, setChangeAmount] = useState(0)
  const [ivaPercentage, setIvaPercentage] = useState(19)

  const form = useForm<FormValues>({
    resolver: zodResolver(ventaFormSchema),
    defaultValues: initialData
      ? {
          id_venta: initialData.id_venta,
          fecha: new Date(initialData.fecha),
          pago_efectivo: parseFloat(initialData.pago_efectivo),
          pago_tarjeta: parseFloat(initialData.pago_tarjeta),
          pago_transferencia: parseFloat(initialData.pago_transferencia),
          subtotal_sin_descuento:
            parseFloat(initialData.subtotal) +
            parseFloat(initialData.descuento),
          descuento: parseFloat(initialData.descuento),
          subtotal: parseFloat(initialData.subtotal),
          iva: parseFloat(initialData.iva),
          total: parseFloat(initialData.total),
          id_cliente: initialData.id_cliente,
          repuestos: initialData.repuestos.map((r: any) => ({
            id_repuesto: r.id_repuesto,
            nombre_repuesto: r.repuesto.nombre_repuesto,
            cantidad: r.cantidad,
            precio: parseFloat(r.precio),
          })),
          vendedor: initialData.vendedor,
        }
      : {
          fecha: new Date(),
          pago_efectivo: 0,
          pago_tarjeta: 0,
          pago_transferencia: 0,
          subtotal_sin_descuento: 0,
          descuento: 0,
          subtotal: 0,
          iva: 0,
          total: 0,
          id_cliente: 0,
          repuestos: [],
          vendedor: localStorage.getItem('userName'),
        },
  })

  const {
    fields: repuestosFields,
    append: appendRepuesto,
    remove: removeRepuesto,
  } = useFieldArray({
    control: form.control,
    name: 'repuestos',
  })

  useEffect(() => {
    if (initialData) {
      if (initialData.cliente) {
        setSelectedCliente(initialData.cliente)
      }
      if (initialData.subtotal && initialData.descuento) {
        const subtotalSinDescuento =
          parseFloat(initialData.subtotal) + parseFloat(initialData.descuento)
        const calculatedPercentage =
          (parseFloat(initialData.descuento) / subtotalSinDescuento) * 100
        setDiscountPercentage(Number(calculatedPercentage.toFixed(2)))
      }
      if (initialData.repuestos) {
        setFormattedRepuestoPrices(
          initialData.repuestos.map((r: any) => formatCurrency(r.precio))
        )
      }
      if (initialData.iva && initialData.subtotal) {
        const calculatedIvaPercentage =
          (parseFloat(initialData.iva) / parseFloat(initialData.subtotal)) * 100
        setIvaPercentage(Number(calculatedIvaPercentage.toFixed(2)))
      }
    }
  }, [initialData])

  const searchClientes = useCallback(async () => {
    const results = await fetchFilteredClientes(clienteSearch, 1, 50)
    setClientes(results)
  }, [clienteSearch])

  const searchRepuestos = useCallback(async () => {
    const results = await fetchFilteredRepuestos(repuestoSearch, 1, 50)
    setRepuestos(results)
  }, [repuestoSearch])

  useEffect(() => {
    if (clienteSearch) searchClientes()
  }, [clienteSearch, searchClientes])

  useEffect(() => {
    if (repuestoSearch) searchRepuestos()
  }, [repuestoSearch, searchRepuestos])

  const calculateSubtotal = useCallback(() => {
    return form
      .watch('repuestos')
      .reduce((acc, repuesto) => acc + repuesto.precio * repuesto.cantidad, 0)
  }, [form])

  const updateCalculations = useCallback(() => {
    const subtotalSinDescuento = Math.round(calculateSubtotal() * 100) / 100
    const discountValue =
      Math.round(subtotalSinDescuento * (discountPercentage / 100) * 100) / 100
    const subtotal = subtotalSinDescuento - discountValue
    const iva = Math.round(subtotal * (ivaPercentage / 100) * 100) / 100
    const total = Math.round((subtotal + iva) * 100) / 100
    form.setValue('subtotal_sin_descuento', subtotalSinDescuento)
    form.setValue('descuento', discountValue)
    form.setValue('subtotal', subtotal)
    form.setValue('iva', iva)
    form.setValue('total', total)
  }, [calculateSubtotal, form, discountPercentage, ivaPercentage])

  useEffect(() => {
    updateCalculations()
  }, [form.watch('repuestos'), discountPercentage, updateCalculations])

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    const totalPagos =
      Number(values.pago_efectivo) +
      Number(values.pago_tarjeta) +
      Number(values.pago_transferencia)

    if (Math.abs(totalPagos - values.total) > 0.01) {
      toast({
        title: 'Error',
        description:
          'El total de los pagos debe ser igual al total de la venta.',
        variant: 'destructive',
      })
      setIsSubmitting(false)
      return
    }

    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description:
          'Hubo un problema al procesar la venta. Por favor, intente de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDecimalInput = (value: string, fieldName: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '')
    const parts = numericValue.split('.')
    if (parts.length > 2) return
    if (parts[1] && parts[1].length > 2) parts[1] = parts[1].slice(0, 2)
    const finalValue = parts.join('.')
    form.setValue(fieldName as any, parseFloat(finalValue) || 0)
  }

  const handleCashReceivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setCashReceived(value)
    const change = value - form.watch('total')
    setChangeAmount(change > 0 ? change : 0)
    if (change >= 0) {
      form.setValue('pago_efectivo', form.watch('total'))
    } else {
      form.setValue('pago_efectivo', value)
    }
  }

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Controller
                    control={form.control}
                    name="fecha"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clienteSearch">Buscar Cliente</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="clienteSearch"
                      value={clienteSearch}
                      onChange={(e) => setClienteSearch(e.target.value)}
                      placeholder="Buscar por nombre o cédula"
                    />
                    <Button type="button" size="icon" onClick={searchClientes}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  {clientes.length > 0 && (
                    <Select
                      onValueChange={(value) => {
                        const cliente = clientes.find(
                          (c) => c.id_cliente === parseInt(value)
                        )
                        if (cliente) {
                          setSelectedCliente(cliente)
                          form.setValue('id_cliente', cliente.id_cliente)
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent className="overflow-auto h-[200px]">
                        {clientes.map((cliente) => (
                          <SelectItem
                            key={cliente.id_cliente}
                            value={cliente.id_cliente.toString()}
                          >
                            {cliente.nombre_cliente} - {cliente.cedula}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                {selectedCliente && (
                  <Card className="bg-muted">
                    <CardContent className="pt-4 grid gap-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {selectedCliente.nombre_cliente}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span>Cédula: {selectedCliente.cedula}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>Teléfono: {selectedCliente.telefono}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <FormField
                  control={form.control}
                  name="id_cliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Repuestos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={repuestoSearch}
                    onChange={(e) => setRepuestoSearch(e.target.value)}
                    placeholder="Buscar repuesto"
                  />
                  <Button type="button" size="icon" onClick={searchRepuestos}>
                    <Search className="h-4 w-4" />
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
                        setFormattedRepuestoPrices((prev) => [
                          ...prev,
                          formatCurrency(Number(repuesto.valor_unitario)),
                        ])
                        updateCalculations()
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
                          - {' Stock: '}
                          {repuesto.stock}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <div className="border rounded-md max-h-[400px] overflow-auto">
                  <Table className="overflow-auto">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Repuesto</TableHead>
                        <TableHead className="w-[100px]">Cantidad</TableHead>
                        <TableHead className="w-[150px]">Precio</TableHead>
                        <TableHead className="w-[150px]">Total</TableHead>
                        <TableHead className="w-[100px]">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {repuestosFields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell className="w-[200px]">
                            {field.nombre_repuesto}
                          </TableCell>
                          <TableCell className="w-[100px]">
                            <FormField
                              control={form.control}
                              name={`repuestos.${index}.cantidad`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(parseInt(e.target.value))
                                        updateCalculations()
                                      }}
                                      className="w-16"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell className="w-[150px]">
                            {formatCurrency(
                              form.watch(`repuestos.${index}.precio`)
                            )}
                          </TableCell>
                          <TableCell className="w-[150px]">
                            {formatCurrency(
                              form.watch(`repuestos.${index}.cantidad`) *
                                form.watch(`repuestos.${index}.precio`)
                            )}
                          </TableCell>
                          <TableCell className="w-[100px]">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                removeRepuesto(index)
                                updateCalculations()
                              }}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detalles Financieros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subtotal_sin_descuento">Valor</Label>
                  <Input
                    value={formatCurrency(form.watch('subtotal_sin_descuento'))}
                    id="subtotal_sin_descuento"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descuento_porcentaje">Descuento (%)</Label>
                  <Input
                    type="number"
                    value={discountPercentage}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value)
                      setDiscountPercentage(isNaN(value) ? 0 : value)
                      updateCalculations()
                    }}
                    id="descuento_porcentaje"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descuento">Valor del Descuento</Label>
                  <Input
                    value={formatCurrency(form.watch('descuento'))}
                    id="descuento"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtotal">Subtotal</Label>
                  <Input
                    value={formatCurrency(form.watch('subtotal'))}
                    id="subtotal"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iva_porcentaje">IVA (%)</Label>
                  <Input
                    type="number"
                    value={ivaPercentage}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value)
                      setIvaPercentage(isNaN(value) ? 0 : value)
                      updateCalculations()
                    }}
                    id="iva_porcentaje"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iva">Valor del IVA</Label>
                  <Input
                    value={formatCurrency(form.watch('iva'))}
                    id="iva"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total">Total</Label>
                  <Input
                    value={formatCurrency(form.watch('total'))}
                    id="total"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cash_received">Efectivo Recibido</Label>
                  <Input
                    value={cashReceived}
                    onChange={handleCashReceivedChange}
                    id="cash_received"
                    type="number"
                    min="0"
                    step="0.01"
                  />
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(cashReceived)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="change">Cambio</Label>
                  <Input
                    value={formatCurrency(changeAmount)}
                    id="change"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pago_efectivo">Pago en Efectivo</Label>
                  <Input
                    value={formatCurrency(form.watch('pago_efectivo'))}
                    id="pago_efectivo"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pago_tarjeta">Pago con Tarjeta</Label>
                  <Input
                    value={form.watch('pago_tarjeta')}
                    onChange={(e) =>
                      handleDecimalInput(e.target.value, 'pago_tarjeta')
                    }
                    id="pago_tarjeta"
                    type="text"
                    inputMode="decimal"
                  />
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(form.watch('pago_tarjeta'))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pago_transferencia">
                    Pago por Transferencia
                  </Label>
                  <Input
                    value={form.watch('pago_transferencia')}
                    onChange={(e) =>
                      handleDecimalInput(e.target.value, 'pago_transferencia')
                    }
                    id="pago_transferencia"
                    type="text"
                    inputMode="decimal"
                  />
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(form.watch('pago_transferencia'))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? 'Actualizando Venta...' : 'Creando Venta...'}
              </>
            ) : initialData ? (
              'Actualizar Venta'
            ) : (
              'Crear Venta'
            )}
          </Button>
        </form>
      </Form>
    </FormProvider>
  )
}
