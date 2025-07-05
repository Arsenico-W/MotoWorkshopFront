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

// Schema and actions
import { marcaRepuestoSchema } from '@/lib/zodSchemas'
import { createMarcaRepuesto, updateMarcaRepuesto } from '@/lib/actions'

// Icons
import { ArrowLeft } from 'lucide-react'

export default function MarcaRepuestoForm({
  marcaRepuesto,
}: {
  marcaRepuesto: { id_marca: number; nombre_marca: string } | null
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof marcaRepuestoSchema>>({
    resolver: zodResolver(marcaRepuestoSchema),
    defaultValues: {
      nombre_marca: marcaRepuesto?.nombre_marca || '',
    },
  })

  const { reset } = form

  useEffect(() => {
    if (marcaRepuesto) {
      reset({
        nombre_marca: marcaRepuesto.nombre_marca || '',
      })
    }
  }, [marcaRepuesto, reset])

  async function onSubmit(values: z.infer<typeof marcaRepuestoSchema>) {
    setIsLoading(true)
    const data = {
      nombre_marca: values.nombre_marca.toUpperCase(),
    }
    try {
      if (marcaRepuesto) {
        // Actualizar marca de repuesto existente
        await updateMarcaRepuesto(marcaRepuesto.id_marca, data)
        toast({
          title: 'Marca actualizada',
          description: 'La marca de repuesto fue actualizada correctamente. ✅',
        })
      } else {
        // Crear una nueva marca de repuesto
        await createMarcaRepuesto(data)
        toast({
          title: 'Marca creada',
          description: 'La marca de repuesto fue creada correctamente. ✅',
        })
      }

      router.push('/dashboard/repuestos//marcas') // Redirige a la lista de marcas de repuestos
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
              {marcaRepuesto ? 'Editar Marca' : 'Agregar Marca'}
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
                  name="nombre_marca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la Marca</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingresa el nombre de la marca"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant="outline"
                  type="submit"
                  className="w-full bg-orange-500 text-white hover:bg-orange-700"
                  disabled={isLoading}
                >
                  {isLoading
                    ? marcaRepuesto
                      ? 'Actualizando...'
                      : 'Creando...'
                    : marcaRepuesto
                    ? 'Actualizar Marca'
                    : 'Agregar Marca'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/dashboard/repuestos/marcas')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
