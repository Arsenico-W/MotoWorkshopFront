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
import { useToast } from '@/components/ui/use-toast'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Schema and interfaces imports
import { clienteSchema } from '@/lib/zodSchemas'
import { Cliente } from '@/lib/interfaces'

// Utility functions and actions imports
import { createCliente, updateCliente } from '@/lib/actions'
import { formatName } from '@/lib/utils'

export default function ClienteForm({ cliente }: { cliente: Cliente | null }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof clienteSchema>>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre_cliente: '',
      cedula: '',
      correo: '',
      telefono: '',
    },
  })

  const { reset } = form

  useEffect(() => {
    // Actualiza el formulario cuando 'cliente' cambia
    if (cliente) {
      reset({
        nombre_cliente: cliente?.nombre_cliente || '',
        cedula: cliente?.cedula || '',
        correo: cliente?.correo || '',
        telefono: cliente?.telefono || '',
      })
    }
  }, [cliente, reset])

  async function onSubmit(values: z.infer<typeof clienteSchema>) {
    setIsLoading(true)
    try {
      const data = {
        ...values,
        nombre_cliente: formatName(values.nombre_cliente),
        correo: values.correo.toLowerCase(),
      }
      if (cliente) {
        // Actualizar cliente existente
        await updateCliente(cliente.id_cliente, data)
        toast({
          title: 'Cliente actualizado',
          description: 'El cliente fue actualizado correctamente. ✅',
        })
      } else {
        // Crear un nuevo cliente
        await createCliente(data)
        toast({
          title: 'Cliente creado',
          description: 'El cliente fue creado correctamente. ✅',
        })
      }

      router.push('/dashboard/clientes') // Redirige a la lista de clientes
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
              {cliente ? 'Editar Cliente' : 'Agregar Cliente'}
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
                  name="nombre_cliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Cliente</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingresa el nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cedula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cédula</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingresa la cédula" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="correo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingresa el correo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingresa el teléfono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant="outline"
                  type="submit"
                  className="w-full bg-orange-500 text-white hover:bg-orange-700 hover:text-white"
                  disabled={isLoading}
                >
                  {isLoading
                    ? cliente
                      ? 'Actualizando...'
                      : 'Creando...'
                    : cliente
                    ? 'Actualizar Cliente'
                    : 'Agregar Cliente'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/dashboard/clientes')}>
              Volver
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
