'use client'
// Import necessary libraries and components
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// Import UI components
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Import icons
import { ArrowLeft } from 'lucide-react'

// Import utility functions and schemas
import {
  fetchFilteredMarcasRepuestos,
  fetchFilteredProveedores,
  fetchFilteredMotosRepuestos,
} from '@/lib/data'
import { Repuesto } from '@/lib/interfaces'
import { createRepuesto, updateRepuesto } from '@/lib/actions'
import { formatCurrency, formatName } from '@/lib/utils'
import { repuestoSchema } from '@/lib/zodSchemas'

export default function RepuestoForm({
  repuesto,
}: {
  repuesto: Repuesto | null
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Estados para marcas, proveedores y motos mercado
  const [marcas, setMarcas] = useState<any[]>([]) // Marcas disponibles
  const [selectedMarca, setSelectedMarca] = useState<number | null>(null) // Marca seleccionada

  const [proveedores, setProveedores] = useState<any[]>([]) // Proveedores disponibles
  const [selectedProveedores, setSelectedProveedores] = useState<number[]>([]) // Proveedores seleccionados

  const [motosMercado, setMotosMercado] = useState<any[]>([]) // Motos mercado disponibles
  const [selectedMotosMercado, setSelectedMotosMercado] = useState<number[]>([]) // Motos mercado seleccionadas

  const [queryMarcas, setQueryMarcas] = useState('') // Estado para la barra de búsqueda de marcas
  const [queryProveedores, setQueryProveedores] = useState('') // Estado para la barra de búsqueda de proveedores
  const [queryMotosMercado, setQueryMotosMercado] = useState('') // Estado para la barra de búsqueda de motos mercado

  const [formattedCompra, setFormattedCompra] = useState<String>()
  const [formattedVenta, setFormattedVenta] = useState<String>()

  const form = useForm({
    resolver: zodResolver(repuestoSchema),
    defaultValues: {
      codigo_barras: '',
      nombre_repuesto: '',
      valor_compra: 0,
      valor_unitario: 0,
      ubicacion: '',
      stock: 0,
      id_marca: null, // Marca
      proveedores: [], // Proveedores seleccionados
      motos_mercado: [], // Motos mercado seleccionadas
    },
  })

  const handleCompraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    form.setValue('valor_compra', Number(value))
    setFormattedCompra(value ? formatCurrency(parseFloat(value)) : '')
  }

  const handleVentaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    form.setValue('valor_unitario', Number(value))
    setFormattedVenta(value ? formatCurrency(parseFloat(value)) : '')
  }

  const { reset } = form

  // Efecto para cargar marcas con búsqueda
  useEffect(() => {
    const fetchMarcas = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFilteredMarcasRepuestos(queryMarcas, 1, 50) // Filtrar marcas
        setMarcas(data)
      } catch (error) {
        console.error('Error fetching marcas:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarcas()
  }, [queryMarcas])

  // Efecto para manejar el filtrado de proveedores
  useEffect(() => {
    const fetchProveedores = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFilteredProveedores(queryProveedores, 1, 50) // Filtrar proveedores
        setProveedores(data)
      } catch (error) {
        console.error('Error fetching proveedores:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProveedores()
  }, [queryProveedores])

  // Efecto para manejar el filtrado de motos mercado
  useEffect(() => {
    const fetchMotosMercado = async () => {
      setIsLoading(true)
      try {
        const data = await fetchFilteredMotosRepuestos(queryMotosMercado, 1, 50) // Filtrar motos mercado
        setMotosMercado(data)
      } catch (error) {
        console.error('Error fetching motos mercado:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMotosMercado()
  }, [queryMotosMercado])

  // Si hay un repuesto cargado, setear valores
  useEffect(() => {
    if (repuesto) {
      reset({
        codigo_barras: repuesto.codigo_barras || '',
        nombre_repuesto: repuesto.nombre_repuesto || '',
        valor_compra: repuesto.valor_compra || 0,
        valor_unitario: repuesto.valor_unitario || 0,
        ubicacion: repuesto.ubicacion || '',
        stock: repuesto.stock || 0,
        id_marca: repuesto.id_marca || null,
        proveedores:
          repuesto.proveedores?.map((prov) => prov.id_proveedor) || [],
        motos_mercado:
          repuesto.motos_mercado?.map((moto) => moto.id_moto_mercado) || [],
      })
      setSelectedMarca(repuesto.id_marca || null)
      setSelectedProveedores(
        repuesto.proveedores?.map((prov) => prov.id_proveedor) || []
      )
      setSelectedMotosMercado(
        repuesto.motos_mercado?.map((moto) => moto.id_moto_mercado) || []
      )
    }
  }, [repuesto, reset])

  async function onSubmit(values: any) {
    setIsLoading(true)

    const data = {
      ...values,
      nombre_repuesto: formatName(values.nombre_repuesto),
      valor_compra: Number(values.valor_compra),
      valor_unitario: Number(values.valor_unitario),
      stock: Number(values.stock),
      ubicacion: values.ubicacion.toUpperCase(),
      id_marca: selectedMarca, // Enviar el ID de la marca seleccionada
      proveedores: selectedProveedores, // Enviar IDs de los proveedores seleccionados
      motos_mercado: selectedMotosMercado, // Enviar IDs de las motos mercado seleccionadas
    }
    if (data.id_marca === null) {
      toast({
        title: 'Error',
        description: 'Debe seleccionar una marca',
        variant: 'destructive',
      })
      return setIsLoading(false)
    }
    try {
      if (repuesto) {
        // Actualizar repuesto existente
        await updateRepuesto(repuesto.id_repuesto, data)
        toast({
          title: 'Repuesto actualizado',
          description: 'El repuesto fue actualizado correctamente. ✅',
        })
      } else {
        // Crear un nuevo repuesto
        await createRepuesto(data)
        toast({
          title: 'Repuesto creado',
          description: 'El repuesto fue creado correctamente. ✅',
        })
      }

      router.push('/dashboard/repuestos') // Redirige a la lista de repuestos
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

  const toggleProveedorSelection = (id: number) => {
    setSelectedProveedores((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((provId) => provId !== id)
        : [...prevSelected, id]
    )
  }

  const toggleMotoMercadoSelection = (id: number) => {
    setSelectedMotosMercado((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((motoId) => motoId !== id)
        : [...prevSelected, id]
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="justify-between">
              <CardTitle className="mb-2">
                {repuesto ? 'Editar Repuesto' : 'Agregar Repuesto'}
              </CardTitle>
              <Button
                onClick={() => router.push('/dashboard/repuestos')}
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="codigo_barras"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de Barras</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingresa el código de barras"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nombre_repuesto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Repuesto</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingresa el nombre del repuesto"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valor_compra"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor de compra</FormLabel>
                      <FormControl>
                        <div>
                          <Input
                            type="number"
                            placeholder="Ingresa el valor pagado por el repuesto"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              handleCompraChange(e)
                            }}
                          />
                          <div className="mt-1 text-sm text-gray-500">
                            {formattedCompra} COP
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valor_unitario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor de venta</FormLabel>
                      <FormControl>
                        <div>
                          <Input
                            type="number"
                            placeholder="Ingresa el valor de venta"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              handleVentaChange(e)
                            }}
                          />
                          <div className="mt-1 text-sm text-gray-500">
                            {formattedVenta} COP
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ubicacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingresa la ubicación del repuesto"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ingresa el stock disponible"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Barra de búsqueda para marcas */}

                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input
                      value={queryMarcas}
                      onChange={(e) => setQueryMarcas(e.target.value)}
                      placeholder="Buscar marcas..."
                    />
                  </FormControl>
                  <FormMessage />
                  <Select
                    onValueChange={(value) => setSelectedMarca(Number(value))}
                    value={selectedMarca?.toString() || ''}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {selectedMarca
                          ? marcas.find(
                              (marca) => marca.id_marca === selectedMarca
                            )?.nombre_marca
                          : 'Seleccionar marca'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {marcas.map((marca) => (
                        <SelectItem
                          key={marca.id_marca}
                          value={marca.id_marca.toString()}
                        >
                          {marca.nombre_marca}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>

                <Separator />

                {/* Barra de búsqueda para proveedores */}
                <FormItem>
                  <FormLabel>Proveedores</FormLabel>
                  <FormControl>
                    <Input
                      value={queryProveedores}
                      onChange={(e) => setQueryProveedores(e.target.value)}
                      placeholder="Buscar proveedores..."
                    />
                  </FormControl>
                  <ul className="mt-2 overflow-auto h-[200px]">
                    {proveedores.map((proveedor) => (
                      <li key={proveedor.id_proveedor}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedProveedores.includes(
                              proveedor.id_proveedor
                            )}
                            onChange={() =>
                              toggleProveedorSelection(proveedor.id_proveedor)
                            }
                          />
                          {proveedor.nombre_proveedor}
                        </label>
                      </li>
                    ))}
                  </ul>
                </FormItem>

                <Separator />

                {/* Barra de búsqueda para motos mercado */}
                <FormItem>
                  <FormLabel>Motos compatibles</FormLabel>
                  <FormControl>
                    <Input
                      value={queryMotosMercado}
                      onChange={(e) => setQueryMotosMercado(e.target.value)}
                      placeholder="Buscar motos compatibles..."
                    />
                  </FormControl>
                  <ul className="mt-2 overflow-auto h-[200px]">
                    {motosMercado.map((moto) => (
                      <li key={moto.id_moto_mercado}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedMotosMercado.includes(
                              moto.id_moto_mercado
                            )}
                            onChange={() =>
                              toggleMotoMercadoSelection(moto.id_moto_mercado)
                            }
                          />{' '}
                          {moto.modelo}
                        </label>
                      </li>
                    ))}
                  </ul>
                </FormItem>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Cargando...' : 'Guardar'}
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
