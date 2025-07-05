'use client'

// React and Next.js hooks
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// React Hook Form and Zod
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// UI components
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
import { Separator } from '@/components/ui/separator'
import { ArrowLeft } from 'lucide-react'

// Schemas, interfaces, and utility functions
import { servicioSchema } from '@/lib/zodSchemas'
import { Servicio } from '@/lib/interfaces'
import { createServicio, updateServicio } from '@/lib/actions'
import { formatName } from '@/lib/utils'

export default function ServicioForm({
  servicio,
}: {
  servicio: Servicio | null
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof servicioSchema>>({
    resolver: zodResolver(servicioSchema),
    defaultValues: {
      nombre_servicio: '',
    },
  })

  const { reset } = form

  useEffect(() => {
    if (servicio) {
      reset({
        nombre_servicio: servicio.nombre_servicio || '',
      })
    }
  }, [servicio, reset])

  async function onSubmit(values: z.infer<typeof servicioSchema>) {
    console.log('Intentando enviar el formulario con los datos:', values)
    setIsLoading(true)

    const data = {
      ...values,
      nombre_servicio: formatName(values.nombre_servicio),
    }
    console.log('Datos a enviar:', data)

    try {
      if (servicio) {
        await updateServicio(servicio.id_servicio, data)
        toast({
          title: 'Servicio actualizado',
          description: 'El servicio fue actualizado correctamente. ✅',
        })
      } else {
        await createServicio(data)
        toast({
          title: 'Servicio creado',
          description: 'El servicio fue creado correctamente. ✅',
        })
      }

      router.push('/dashboard/servicios') // Redirige a la lista de motos mercado
    } catch (error) {
      console.error(error)

      toast({
        title: 'Error',
        description: error.message,
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
              {servicio ? 'Editar Servicio' : 'Agregar Servicio'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  console.log('Intentando enviar el formulario')

                  await form.handleSubmit(onSubmit)() // Ejecuta la validación y la función onSubmit si es válida

                  const errors = form.formState.errors
                  console.log('Errores de validación:', errors) // Imprimir errores de validación
                }}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="nombre_servicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingresa el nombre del servicio"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />

                <Button
                  variant="outline"
                  type="submit"
                  className="w-full bg-orange-500 text-white hover:bg-orange-700"
                  disabled={isLoading}
                >
                  {isLoading
                    ? servicio
                      ? 'Actualizando...'
                      : 'Creando...'
                    : servicio
                    ? 'Actualizar Servicio'
                    : 'Agregar Servicio'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/dashboard/servicios')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
