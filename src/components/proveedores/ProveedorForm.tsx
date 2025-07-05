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
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'

// Interfaces and utility functions imports
import { Proveedor, Repuesto } from '@/lib/interfaces'
import { createProveedor, updateProveedor } from '@/lib/actions'
import { fetchFilteredRepuestos } from '@/lib/data'
import { ArrowLeft } from 'lucide-react'
import { proveedorSchema } from '@/lib/zodSchemas'
import { formatName } from '@/lib/utils'

type FormValues = z.infer<typeof proveedorSchema>

export default function ProveedorForm({
  proveedor,
}: {
  proveedor: Proveedor | null
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [repuestos, setRepuestos] = useState<Repuesto[]>([])
  const [repuestosQuery, setRepuestosQuery] = useState('')

  const form = useForm<FormValues>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: {
      nombre_proveedor: '',
      nit: '',
      telefono: '',
      asesor: '',
      fecha_vencimiento: '',
      repuestos: [],
    },
  })

  const { reset, control } = form

  useEffect(() => {
    if (proveedor) {
      reset({
        nombre_proveedor: proveedor.nombre_proveedor || '',
        nit: proveedor.nit || '',
        telefono: proveedor.telefono || '',
        asesor: proveedor.asesor || '',
        fecha_vencimiento: proveedor.fecha_vencimiento
          ? new Date(proveedor.fecha_vencimiento).toISOString().split('T')[0]
          : '',
        repuestos: proveedor.repuestos?.map((r) => r.id_repuesto) || [],
      })
    }
  }, [proveedor, reset])

  useEffect(() => {
    const fetchRepuestos = async () => {
      try {
        const data = await fetchFilteredRepuestos(repuestosQuery, 1, 50)
        setRepuestos(data)
      } catch (error) {
        console.error('Error fetching repuestos:', error)
        toast({
          title: 'Error',
          description:
            'No se pudieron cargar los repuestos. Por favor, intente nuevamente.',
          variant: 'destructive',
        })
      }
    }

    fetchRepuestos()
  }, [repuestosQuery, toast])

  async function onSubmit(values: FormValues) {
    setIsLoading(true)
    try {
      const updatedValues = {
        ...values,
        nombre_proveedor: formatName(values.nombre_proveedor),
        asesor: formatName(values.asesor),
        fecha_vencimiento: values.fecha_vencimiento,
      }

      if (proveedor) {
        await updateProveedor(proveedor.id_proveedor, updatedValues)
        toast({
          title: 'Proveedor actualizado',
          description: 'El proveedor fue actualizado correctamente. ✅',
        })
      } else {
        await createProveedor(updatedValues)
        toast({
          title: 'Proveedor creado',
          description: 'El proveedor fue creado correctamente. ✅',
        })
      }

      router.push('/dashboard/proveedores')
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Ocurrió un error, intenta nuevamente.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>
              {proveedor ? 'Editar Proveedor' : 'Agregar Proveedor'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={control}
                  name="nombre_proveedor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Proveedor</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese el nombre del proveedor"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="nit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIT</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el NIT" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el teléfono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="asesor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asesor</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese el nombre del asesor"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="fecha_vencimiento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Vencimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="repuestos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repuestos</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            placeholder="Buscar repuestos..."
                            onChange={(e) => setRepuestosQuery(e.target.value)}
                          />
                          <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                            {repuestos.map((repuesto) => (
                              <div
                                key={repuesto.id_repuesto}
                                className="flex items-center space-x-2 mb-2"
                              >
                                <Checkbox
                                  id={`repuesto-${repuesto.id_repuesto}`}
                                  checked={field.value.includes(
                                    repuesto.id_repuesto
                                  )}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          repuesto.id_repuesto,
                                        ])
                                      : field.onChange(
                                          field.value.filter(
                                            (id) => id !== repuesto.id_repuesto
                                          )
                                        )
                                  }}
                                />
                                <label
                                  htmlFor={`repuesto-${repuesto.id_repuesto}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {repuesto.nombre_repuesto}
                                </label>
                              </div>
                            ))}
                          </ScrollArea>
                        </div>
                      </FormControl>
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
                    ? proveedor
                      ? 'Actualizando...'
                      : 'Creando...'
                    : proveedor
                    ? 'Actualizar Proveedor'
                    : 'Agregar Proveedor'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => router.push('/dashboard/proveedores')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
