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
import { Separator } from '@/components/ui/separator'
import { ArrowLeft } from 'lucide-react'

// Schema and data fetching imports
import { motoMercadoSchema } from '@/lib/zodSchemas'
import { fetchFilteredRepuestos } from '@/lib/data'

// Interfaces and actions imports
import { MotoMercado, Repuesto } from '@/lib/interfaces'
import { createMotoMercado, updateMotoMercado } from '@/lib/actions'

export default function MotoMercadoForm({
  moto,
}: {
  moto: MotoMercado | null
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]) // Lista de repuestos
  const [selectedRepuestos, setSelectedRepuestos] = useState<number[]>([]) // Repuestos seleccionados
  const [query, setQuery] = useState('') // Estado para la barra de búsqueda

  const form = useForm<z.infer<typeof motoMercadoSchema>>({
    resolver: zodResolver(motoMercadoSchema),
    defaultValues: {
      modelo: '',
      repuestos: [], // Para almacenar los IDs de los repuestos seleccionados
    },
  })

  const { reset } = form

  // Efecto para manejar el filtrado de repuestos
  useEffect(() => {
    const fetchRepuestos = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFilteredRepuestos(query, 1, 50) // Filtrar repuestos
        setRepuestos(data)
      } catch (error) {
        console.error('Error fetching repuestos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepuestos()
  }, [query])

  useEffect(() => {
    if (moto) {
      reset({
        modelo: moto.modelo || '',
        repuestos:
          moto.repuestos?.map((repuesto) => repuesto.id_repuesto) || [],
      })
      setSelectedRepuestos(
        moto.repuestos?.map((repuesto) => repuesto.id_repuesto) || []
      )
    }
  }, [moto, reset])

  async function onSubmit(values: z.infer<typeof motoMercadoSchema>) {
    console.log('Intentando enviar el formulario con los datos:', values)
    setIsLoading(true)

    const data = {
      ...values,
      modelo: values.modelo.toLocaleUpperCase(),
      repuestos: selectedRepuestos, // Enviar los IDs de los repuestos seleccionados
    }
    console.log('Datos a enviar:', data)

    try {
      if (moto) {
        // Actualizar moto mercado existente
        await updateMotoMercado(moto.id_moto_mercado, data)
        toast({
          title: 'Moto actualizada',
          description: 'La moto mercado fue actualizada correctamente. ✅',
        })
      } else {
        // Crear una nueva moto mercado
        await createMotoMercado(data)
        toast({
          title: 'Moto creada',
          description: 'La moto mercado fue creada correctamente. ✅',
        })
      }

      router.push('/dashboard/repuestos/motos') // Redirige a la lista de motos mercado
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

  const toggleRepuestoSelection = (id: number) => {
    setSelectedRepuestos((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((repuestoId) => repuestoId !== id)
        : [...prevSelected, id]
    )

    // Actualiza el campo de repuestos en el formulario
    form.setValue('repuestos', [...selectedRepuestos, id])
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              {moto ? 'Editar Moto' : 'Agregar Moto'} compatible
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

                  if (errors.repuestos) {
                    const errorMessage = errors.repuestos.message
                    toast({
                      title: 'Error de validación',
                      description: errorMessage,
                      variant: 'destructive',
                    })
                  }
                }}
                className="space-y-8"
              >
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
                <Separator />
                <div>
                  <Input
                    placeholder="Buscar repuesto..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                {/* Lista de repuestos filtrados */}
                <div className="overflow-auto h-[200px]">
                  {repuestos.map((repuesto) => (
                    <div
                      key={repuesto.id_repuesto}
                      className="flex items-center"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRepuestos.includes(
                          repuesto.id_repuesto
                        )}
                        onChange={() => {
                          toggleRepuestoSelection(repuesto.id_repuesto)
                        }}
                      />
                      <span className="ml-2">{repuesto.nombre_repuesto}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
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
            <Button onClick={() => router.push('/dashboard/repuestos/motos')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
