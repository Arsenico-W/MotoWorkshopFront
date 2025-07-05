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
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
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
import { cn, formatCurrency, formatName } from '@/lib/utils'
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
import { ScrollArea } from '@/components/ui/scroll-area'

// Data fetching and interfaces
import {
  fetchFilteredMotosClientes,
  fetchFilteredRepuestos,
  fetchFilteredServicios,
} from '@/lib/data'
import { MotoCliente, Repuesto, Servicio } from '@/lib/interfaces'

// Form schema
import { ordenServicioFormSchema } from '@/lib/zodSchemas'

//Alert
import Swal from 'sweetalert2'

type FormValues = z.infer<typeof ordenServicioFormSchema>

interface OrdenServicioFormProps {
  initialData?: any
  onSubmit: (data: FormValues) => Promise<void>
}

export default function OrdenServicioForm({
  initialData,
  onSubmit,
}: OrdenServicioFormProps) {
  const [motoSearch, setMotoSearch] = useState('')
  const [repuestoSearch, setRepuestoSearch] = useState('')
  const [servicioSearch, setServicioSearch] = useState('')
  const [motos, setMotos] = useState<MotoCliente[]>([])
  const [repuestos, setRepuestos] = useState<Repuesto[]>([])
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [selectedMoto, setSelectedMoto] = useState<MotoCliente | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [formattedServicioPrices, setFormattedServicioPrices] = useState<
    string[]
  >([])
  const [ivaPercentage, setIvaPercentage] = useState(19)
  const [cashReceived, setCashReceived] = useState(0)
  const [changeAmount, setChangeAmount] = useState(0)

  const form = useForm<FormValues>({
    resolver: zodResolver(ordenServicioFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          fecha: new Date(initialData.fecha),
          subtotal: parseFloat(initialData.subtotal),
          descuento: parseFloat(initialData.descuento),
          iva: parseFloat(initialData.iva),
          total: parseFloat(initialData.total),
          servicios: initialData.servicios?.map((s: any) => ({
            id_servicio: s.id_servicio,
            nombre_servicio: s.servicio.nombre_servicio,
            precio: parseFloat(s.precio),
          })),
          repuestos: initialData.repuestos?.map((r: any) => ({
            id_repuesto: r.id_repuesto,
            nombre_repuesto: r.repuesto.nombre_repuesto,
            cantidad: r.cantidad,
            precio: parseFloat(r.precio),
          })),
          vendedor: initialData.vendedor,
          adelanto_efectivo: parseFloat(initialData.adelanto_efectivo) || 0,
          adelanto_tarjeta: parseFloat(initialData.adelanto_tarjeta) || 0,
          adelanto_transferencia:
            parseFloat(initialData.adelanto_transferencia) || 0,
        }
      : {
          fecha: new Date(),
          estado: 'PENDIENTE',
          subtotal: 0,
          descuento: 0,
          iva: 0,
          total: 0,
          guardar_cascos: false,
          guardar_papeles: false,
          observaciones: '',
          observaciones_mecanico: '',
          observaciones_factura: '',
          mecanico: '',
          id_moto_cliente: 0,
          servicios: [],
          repuestos: [],
          vendedor: localStorage.getItem('userName'),
          adelanto_efectivo: 0,
          adelanto_tarjeta: 0,
          adelanto_transferencia: 0,
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
  } = useFieldArray({
    control: form.control,
    name: 'repuestos',
  })

  useEffect(() => {
    if (initialData) {
      if (initialData.moto_cliente) {
        setSelectedMoto(initialData.moto_cliente)
      }
      if (initialData.subtotal && initialData.descuento) {
        const subtotalSinDescuento =
          parseFloat(initialData.subtotal) + parseFloat(initialData.descuento)
        const calculatedPercentage =
          (parseFloat(initialData.descuento) / subtotalSinDescuento) * 100
        setDiscountPercentage(Number(calculatedPercentage.toFixed(2)))
      }
      if (initialData.repuestos) {
        const repuestosTotal = initialData.repuestos.reduce(
          (acc, r) => acc + r.precio * r.cantidad,
          0
        )
        if (repuestosTotal > 0) {
          const calculatedIvaPercentage =
            ((initialData.iva || 0) / repuestosTotal) * 100
          setIvaPercentage(Number(calculatedIvaPercentage.toFixed(2)))
        } else {
          setIvaPercentage(0)
        }
      } else {
        setIvaPercentage(19) // Valor por defecto si no hay repuestos
      }
    }
  }, [initialData])

  const searchMotos = useCallback(async () => {
    const results = await fetchFilteredMotosClientes(motoSearch, 1, 50)
    setMotos(results)
  }, [motoSearch])

  const searchRepuestos = useCallback(async () => {
    const results = await fetchFilteredRepuestos(repuestoSearch, 1, 50)
    setRepuestos(results)
  }, [repuestoSearch])

  const searchServicios = useCallback(async () => {
    const results = await fetchFilteredServicios(servicioSearch, 1, 50)
    setServicios(results)
  }, [servicioSearch])

  useEffect(() => {
    if (motoSearch) searchMotos()
  }, [motoSearch, searchMotos])

  useEffect(() => {
    if (repuestoSearch) searchRepuestos()
  }, [repuestoSearch, searchRepuestos])

  useEffect(() => {
    if (servicioSearch) searchServicios()
  }, [servicioSearch, searchServicios])

  const calculateSubtotal = useCallback(() => {
    const repuestosTotal = (form.watch('repuestos') ?? [])
      .reduce((acc, repuesto) => acc + repuesto.precio * repuesto.cantidad, 0)
    const serviciosTotal = (form.watch('servicios') ?? [])
      .reduce((acc, servicio) => acc + servicio.precio, 0)
    return { repuestosTotal, serviciosTotal }
  }, [form])

  const updateCalculations = useCallback(() => {
    const { repuestosTotal, serviciosTotal } = calculateSubtotal()
    const subtotalBeforeDiscount =
      Math.round((repuestosTotal + serviciosTotal) * 100) / 100
    const discountValue =
      Math.round(subtotalBeforeDiscount * (discountPercentage / 100) * 100) /
        100 || 0
    const subtotalAfterDiscount = subtotalBeforeDiscount - discountValue
    const iva = Math.round(repuestosTotal * (ivaPercentage / 100) * 100) / 100
    const total = Math.round((subtotalAfterDiscount + iva) * 100) / 100
    form.setValue('subtotal', subtotalAfterDiscount)
    form.setValue('descuento', discountValue)
    form.setValue('iva', iva)
    form.setValue('total', total)
  }, [calculateSubtotal, form, discountPercentage, ivaPercentage])

  useEffect(() => {
    updateCalculations()
  }, [
    form.watch('repuestos'),
    form.watch('servicios'),
    discountPercentage,
    ivaPercentage,
    updateCalculations,
  ])

  const handleCashReceivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setCashReceived(value)
    const change = value - form.watch('total')
    setChangeAmount(change > 0 ? change : 0)
    if (change >= 0) {
      form.setValue('adelanto_efectivo', form.watch('total'))
    } else {
      form.setValue('adelanto_efectivo', value)
    }
  }

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    const totalPagos =
      Number(values.adelanto_efectivo) +
      Number(values.adelanto_tarjeta) +
      Number(values.adelanto_transferencia)

    if (!initialData && values.estado !== 'PENDIENTE') {
      toast({
        title: 'Error',
        description:
          'No se puede crear una orden de servicio con un estado diferente a PENDIENTE.',
        variant: 'destructive',
      })
      setIsSubmitting(false)
      return
    }

    if(initialData){
      if (initialData.estado == 'PENDIENTE' && values.estado == 'PENDIENTE') {
        toast({
          title: 'Error',
          description:
            'No se puede actualizar de estado PENDIENTE a PENDIENTE, debes cambiarlo a EN PROCESO.',
          variant: 'destructive',
        })
        setIsSubmitting(false)
        return
      }
      if (initialData.estado == 'PENDIENTE' && values.estado == 'COMPLETADO') {
        toast({
          title: 'Error',
          description:
            'No se puede pasar de estado PENDIENTE a COMPLETADO, debes cambiarlo primero a EN PROCESO.',
          variant: 'destructive',
        })
        setIsSubmitting(false)
        return
      }
      if (initialData.estado !== 'PENDIENTE' && values.estado == 'PENDIENTE') {
        toast({
          title: 'Error',
          description:
            'No se puede poner el estado PENDIENTE de una orden de servicio ya creada.',
          variant: 'destructive',
        })
        setIsSubmitting(false)
        return
      }
    }

    if (
      values.estado === 'COMPLETADO' &&
      Math.abs(totalPagos - values.total) > 0.01
    ) {
      toast({
        title: 'Error',
        description:
          'El total de los pagos debe ser igual al total de la orden.',
        variant: 'destructive',
      })
      setIsSubmitting(false)
      return
    }

    if (values.estado === 'COMPLETADO') {
      let result = await Swal.fire({
        title: '¿Está seguro?',
        text: 'Se completará la orden de servicio, se generará una factura y después no se podrá editar. Asegúrate de agregar todos los repuestos y servicios necesarios. ¿Desea continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, completar',
        cancelButtonText: 'No, volver',
      })
      if (!result.isConfirmed) {
        setIsSubmitting(false)
        return
      }
    }

    if (values.estado === 'CANCELADO') {
      let result = await Swal.fire({
        title: '¿Está seguro?',
        text: 'Se cancelará la orden de servicio, se devolveran al inventario los repuestos y después no se podrá editar. ¿Desea continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, volver',
      })
      if (!result.isConfirmed) {
        setIsSubmitting(false)
        return
      } else {
        let data = {
          ...values,
          adelanto_efectivo: 0,
          adelanto_tarjeta: 0,
          adelanto_transferencia: 0,
          total: 0,
          subtotal: 0,
          descuento: 0,
          iva: 0,
        }
      }
    }

    try {
      let data = {
        ...values,
        mecanico: formatName(values.mecanico),
        observaciones: values.observaciones
          ? values.observaciones[0].toUpperCase() +
            values.observaciones.slice(1).toLowerCase()
          : values.observaciones,
        observaciones_mecanico: values.observaciones_mecanico
          ? values.observaciones_mecanico[0].toUpperCase() +
            values.observaciones_mecanico.slice(1).toLowerCase()
          : values.observaciones_mecanico,
        observaciones_factura: values.observaciones_factura
          ? values.observaciones_factura[0].toUpperCase() +
            values.observaciones_factura.slice(1).toLowerCase()
          : values.observaciones_factura,
      }
      await onSubmit(data)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description:
          'Hubo un problema al procesar la orden de servicio. Por favor, intente de nuevo.',
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

  const handleServicioPriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value
    form.setValue(`servicios.${index}.precio`, Number(value))
    const newFormattedPrices = [...formattedServicioPrices]
    newFormattedPrices[index] = value ? formatCurrency(parseFloat(value)) : ''
    setFormattedServicioPrices(newFormattedPrices)
    updateCalculations()
  }

  return (
    <>
      <div className="p-2">
        {initialData?.estado === 'COMPLETADO' && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Atención!</strong>
            <span className="block sm:inline">
              {' '}
              Esta orden de servicio ya ha sido completada.
            </span>
          </div>
        )}
      </div>
      <div className="p-2">
        {initialData?.estado === 'CANCELADO' && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Atención!</strong>
            <span className="block sm:inline">
              {' '}
              Esta orden de servicio ha sido cancelada.
            </span>
          </div>
        )}
      </div>

      {(!initialData || initialData?.estado == 'PENDIENTE' ||
        initialData?.estado == 'EN_PROCESO') && (
        <FormProvider {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Información General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
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
                        <Label htmlFor="estado">Estado</Label>
                        <Select
                          onValueChange={(value) =>
                            form.setValue('estado', value as any)
                          }
                          defaultValue={form.watch('estado')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                            <SelectItem value="EN_PROCESO">
                              En Proceso
                            </SelectItem>
                            <SelectItem value="COMPLETADO">
                              Completado
                            </SelectItem>
                            <SelectItem value="CANCELADO">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="motoSearch">Buscar Moto</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="motoSearch"
                          value={motoSearch}
                          onChange={(e) => setMotoSearch(e.target.value)}
                          placeholder="Buscar por placa"
                        />
                        <Button type="button" size="icon" onClick={searchMotos}>
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                      {motos.length > 0 && (
                        <Select
                          onValueChange={(value) => {
                            const moto = motos.find(
                              (m) => m.id_moto_cliente === parseInt(value)
                            )
                            if (moto) {
                              setSelectedMoto(moto)
                              form.setValue(
                                'id_moto_cliente',
                                moto.id_moto_cliente
                              )
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar moto" />
                          </SelectTrigger>
                          <SelectContent className="overflow-auto h-[200px]">
                            {motos.map((moto) => (
                              <SelectItem
                                key={moto.id_moto_cliente}
                                value={moto.id_moto_cliente.toString()}
                              >
                                {moto.placa} - {moto.marca} {moto.modelo} -{' '}
                                {moto.Cliente.nombre_cliente}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    {selectedMoto && (
                      <Card className="bg-muted ">
                        <CardContent className="pt-4 grid gap-2">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {selectedMoto.Cliente?.nombre_cliente}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span>Cédula: {selectedMoto.Cliente?.cedula}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Teléfono: {selectedMoto.Cliente?.telefono}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Moto:</span>
                            <span>
                              {selectedMoto.marca} {selectedMoto.modelo} -{' '}
                              {selectedMoto.placa} ({selectedMoto.ano})
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    <FormField
                      control={form.control}
                      name="id_moto_cliente"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="hidden" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mecanico"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="mecanico">Mecánico</Label>
                          <FormControl>
                            <Input
                              {...field}
                              id="mecanico"
                              placeholder="Nombre del mecánico"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {initialData && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Servicios y Repuestos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 overflow-auto">
                      <div className="space-y-2">
                        <Label htmlFor="servicioSearch">Buscar Servicio</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="servicioSearch"
                            value={servicioSearch}
                            onChange={(e) => setServicioSearch(e.target.value)}
                            placeholder="Buscar servicio"
                          />
                          <Button
                            type="button"
                            size="icon"
                            onClick={searchServicios}
                          >
                            <Search className="h-4 w-4" />
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
                                setFormattedServicioPrices((prev) => [
                                  ...prev,
                                  '$ 0',
                                ])
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
                      </div>
                      <div className="border rounded-md max-h-[400px] overflow-auto">
                        <Table className="overflow-auto">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">
                                Servicio
                              </TableHead>
                              <TableHead>Precio</TableHead>
                              <TableHead className="w-[100px]">
                                Acciones
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {serviciosFields.map((field, index) => (
                              <TableRow key={field.id}>
                                <TableCell className="font-medium w-[200px]">
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
                                              min="0"
                                              {...field}
                                              onChange={(e) => {
                                                field.onChange(e)
                                                handleServicioPriceChange(
                                                  e,
                                                  index
                                                )
                                              }}
                                            />
                                            <div className="mt-1 text-sm text-gray-500">
                                              {formattedServicioPrices[index]}{' '}
                                              COP
                                            </div>
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                                <TableCell className="w-[100px]">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      removeServicio(index)
                                      setFormattedServicioPrices((prev) =>
                                        prev.filter((_, i) => i !== index)
                                      )
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

                      <div className="space-y-2">
                        <Label htmlFor="repuestoSearch">Buscar Repuesto</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="repuestoSearch"
                            value={repuestoSearch}
                            onChange={(e) => setRepuestoSearch(e.target.value)}
                            placeholder="Buscar repuesto"
                          />
                          <Button
                            type="button"
                            size="icon"
                            onClick={searchRepuestos}
                          >
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
                                updateCalculations()
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar repuesto" />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea className="h-[200px]">
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
                                    - Stock: {repuesto.stock}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      <div className="border rounded-md max-h-[400px] overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">
                                Repuesto
                              </TableHead>
                              <TableHead className="w-[100px]">
                                Cantidad
                              </TableHead>
                              <TableHead className="w-[150px]">
                                Precio
                              </TableHead>
                              <TableHead className="w-[150px]">Total</TableHead>
                              <TableHead className="w-[100px]">
                                Acciones
                              </TableHead>
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
                                              field.onChange(
                                                parseInt(e.target.value)
                                              )
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
                )}
              </div>

             {initialData && (<Card>
                <CardHeader>
                  <CardTitle>Detalles Financieros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subtotal_before_discount">Valor</Label>
                      <Input
                        value={formatCurrency(
                          calculateSubtotal().repuestosTotal +
                            calculateSubtotal().serviciosTotal
                        )}
                        id="subtotal_before_discount"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descuento_porcentaje">
                        Descuento (%)
                      </Label>
                      <Input
                        type="number"
                        value={discountPercentage || 0}
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
                      <Label htmlFor="iva_porcentaje">
                        IVA (%) - Solo para Repuestos
                      </Label>
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
                      <Label htmlFor="iva">
                        Valor del IVA (Solo Repuestos)
                      </Label>
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
                      <Label htmlFor="adelanto_efectivo">
                        Pago en Efectivo
                      </Label>
                      <Input
                        value={formatCurrency(form.watch('adelanto_efectivo'))}
                        id="adelanto_efectivo"
                        readOnly
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adelanto_tarjeta">Pago con Tarjeta</Label>
                      <Input
                        value={form.watch('adelanto_tarjeta')}
                        onChange={(e) =>
                          handleDecimalInput(e.target.value, 'adelanto_tarjeta')
                        }
                        id="adelanto_tarjeta"
                        type="text"
                        inputMode="decimal"
                      />
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(form.watch('adelanto_tarjeta'))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adelanto_transferencia">
                        Pago por Transferencia
                      </Label>
                      <Input
                        value={form.watch('adelanto_transferencia')}
                        onChange={(e) =>
                          handleDecimalInput(
                            e.target.value,
                            'adelanto_transferencia'
                          )
                        }
                        id="adelanto_transferencia"
                        type="text"
                        inputMode="decimal"
                      />
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(form.watch('adelanto_transferencia'))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}

              <Card>
                <CardHeader>
                  <CardTitle>Detalles Adicionales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <FormField
                      control={form.control}
                      name="guardar_cascos"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <Label htmlFor="guardar_cascos">
                              Guardar Cascos
                            </Label>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="guardar_papeles"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <Label htmlFor="guardar_papeles">
                              Guardar Papeles
                            </Label>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="observaciones"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="observaciones">
                          Trabajo a realizar
                        </Label>
                        <FormControl>
                          <Textarea
                            {...field}
                            id="observaciones"
                            placeholder="Trabajo a realizar"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {
                  form.watch('estado') !== 'PENDIENTE'  &&
                  form.watch('estado') !== 'CANCELADO'
                  &&<FormField
                    control={form.control}
                    name="observaciones_mecanico"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="observaciones_mecanico">
                          Diagnostico mecánico
                        </Label>
                        <FormControl>
                          <Textarea
                            {...field}
                            id="observaciones_mecanico"
                            placeholder="Diagnosticos del mecánico"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />}

                 {form.watch('estado') === 'COMPLETADO' && <FormField
                    control={form.control}
                    name="observaciones_factura"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="observaciones_factura">
                          Observaciones para la factura
                        </Label>
                        <FormControl>
                          <Textarea
                            {...field}
                            id="observaciones_factura"
                            placeholder="Observaciones para la factura"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />}
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {initialData ? 'Actualizando Orden...' : 'Creando Orden...'}
                  </>
                ) : initialData ? (
                  'Actualizar Orden de Servicio'
                ) : (
                  'Crear Orden de Servicio'
                )}
              </Button>
            </form>
          </Form>
        </FormProvider>
      )}
    </>
  )
}
