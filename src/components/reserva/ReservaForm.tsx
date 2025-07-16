'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft } from 'lucide-react'

import { Cliente, Reserva } from '@/lib/interfaces'
import { fetchFilteredClientes, fetchFilteredServicios } from '@/lib/data'
import { createReserva, updateReserva } from '@/lib/actions'
import { reservaSchema } from '@/lib/zodSchemas'

export default function ReservaForm({ reserva }: { reserva: Reserva | null }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [Clientes, setClientes] = useState<Cliente[]>([])
  const [servicios, setServicios] = useState<any[]>([])
const [queryClientes, setQueryClientes] = useState('') 
const [queryServicios, setQueryServicios] = useState('') 


  const form = useForm({
    resolver: zodResolver(reservaSchema),
    defaultValues: {
      id_cliente: '',
      id_servicio: '',
      fecha_reserva: '',
    },
  })

  const { reset } = form

  useEffect(() => {
    async function loadData() {
      const clientesData = await fetchFilteredClientes(queryClientes, 1, 500)
      const serviciosData = await fetchFilteredServicios(queryServicios, 1, 500)
      setClientes(clientesData)
      setServicios(serviciosData)
    }
    loadData()
  }, [])

  useEffect(() => {
    if (reserva) {
      reset({
        id_cliente: reserva.id_cliente.toString(),
        id_servicio: reserva.id_servicio?.toString() || '',
        fecha_reserva: new Date(reserva.fecha_reserva).toISOString().slice(0, 10),
      })
    }
  }, [reserva, reset])

  async function onSubmit(values: z.infer<typeof reservaSchema>) {
    setIsLoading(true)
    try {
      const payload = {
        id_cliente: values.id_cliente,
        id_servicio: values.id_servicio ? values.id_servicio : null,
        fecha_reserva: values.fecha_reserva,
      }
      if (reserva) {
        await updateReserva(reserva.id_reserva, payload)
        toast({
          title: 'Reserva actualizada',
          description: 'La reserva se actualizó correctamente.',
        })
      } else {
        await createReserva(payload)
        toast({
          title: 'Reserva creada',
          description: 'La reserva fue registrada exitosamente.',
        })
        
      }

      router.push('/dashboard/reserva')
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Ocurrió un error al guardar la reserva.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="justify-between">
              <CardTitle className="mb-2">
                {reserva ? 'Editar Reserva' : 'Agregar Reserva'}
              </CardTitle>
              <Button
                onClick={() => router.push('/dashboard/reserva')}
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="id_cliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {Clientes.map((Cliente) => (
                            <SelectItem key={Cliente.id_cliente} value={Cliente.id_cliente.toString()}>
                              {Cliente.nombre_cliente}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="id_servicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Servicio (opcional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          {servicios.map((servicio) => (
                            <SelectItem key={servicio.id_servicio} value={servicio.id_servicio.toString()}>
                              {servicio.nombre_servicio}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fecha_reserva"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Reserva</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  )
}