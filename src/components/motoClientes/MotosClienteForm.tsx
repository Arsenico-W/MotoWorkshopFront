'use client'

// React and Next.js imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// React Hook Form and Zod imports
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// UI components imports
import { Button } from '@/components/ui/button'
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
import { useToast } from '@/components/ui/use-toast'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Schema and data fetching imports
import { motoClienteSchema } from '@/lib/zodSchemas'
import { fetchFilteredClientes } from '@/lib/data'

// Interfaces and actions imports
import { MotoCliente, Cliente } from '@/lib/interfaces'
import { createMotoCliente, updateMotoCliente } from '@/lib/actions'

// Icon imports
import { ArrowLeft } from 'lucide-react'

export default function MotoClienteForm({
  moto,
}: {
  moto: MotoCliente | null
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [query, setQuery] = useState('')
  const [currentPage] = useState(1)
  const [limit] = useState(50)

  const form = useForm<z.infer<typeof motoClienteSchema>>({
    resolver: zodResolver(motoClienteSchema),
    defaultValues: {
      placa: '',
      marca: '',
      modelo: '',
    },
  })

  const { reset } = form

  useEffect(() => {
    const fetchClientes = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFilteredClientes(query, currentPage, limit)
        setClientes(data)
      } catch (error) {
        console.error('Error fetching clientes:', error)
        toast({
          title: 'Error',
          description:
            'No se pudieron cargar los clientes. Por favor, intente nuevamente.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchClientes()
  }, [query, currentPage, limit, toast])

  useEffect(() => {
    if (moto) {
      reset({
        placa: moto.placa || '',
        marca: moto.marca || '',
        modelo: moto.modelo || '',
        ano: moto.ano || 0,
        id_cliente: moto.Cliente?.id_cliente,
      })
    }
  }, [moto, reset])

  async function onSubmit(values: z.infer<typeof motoClienteSchema>) {
    setIsLoading(true)
    const data = {
      ...values,
      placa: values.placa.toUpperCase(),
      marca: values.marca.toUpperCase(),
      modelo: values.modelo.toUpperCase(),
      ano: Number(values.ano),
      id_cliente: Number(values.id_cliente),
    }
    try {
      if (moto) {
        await updateMotoCliente(moto.id_moto_cliente, {
          ...data,
          id_cliente: Number(data.id_cliente),
        })
        toast({
          title: 'Moto actualizada',
          description: 'La moto cliente fue actualizada correctamente. ✅',
        })
      } else {
        await createMotoCliente({ ...data, id_cliente: data.id_cliente })
        toast({
          title: 'Moto creada',
          description: 'La moto cliente fue creada correctamente. ✅',
        })
      }

      router.push('/dashboard/clientes/motos')
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: error.message || 'Ocurrió un error, intenta nuevamente.',
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
            <CardTitle>
              {moto ? 'Editar Moto' : 'Agregar Moto'} de cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="placa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placa</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingresa la placa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingresa la marca" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="modelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingresa el modelo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ano"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Año</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingresa el año"
                          {...field}
                          type="number"
                          min={1900}
                          max={new Date().getFullYear() + 1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <div>
                  <Input
                    placeholder="Buscar cliente..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="id_cliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                moto?.Cliente
                                  ? moto.Cliente.nombre_cliente
                                  : 'Selecciona un cliente'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="overflow-auto h-[200px]">
                          {clientes.map((cliente) => (
                            <SelectItem
                              key={cliente.id_cliente}
                              value={cliente.id_cliente.toString()}
                            >
                              {cliente.nombre_cliente} {cliente.cedula}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-orange-500 text-white hover:bg-orange-700"
                  disabled={isLoading}
                >
                  {isLoading
                    ? moto
                      ? 'Actualizando...'
                      : 'Creando...'
                    : moto
                    ? 'Actualizar Moto'
                    : 'Agregar Moto'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => router.push('/dashboard/clientes/motos')}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
