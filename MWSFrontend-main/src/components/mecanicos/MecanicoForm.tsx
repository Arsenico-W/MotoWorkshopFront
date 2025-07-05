'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

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

import { mecanicoSchema } from '@/lib/zodSchemas'
import { Mecanico } from '@/lib/interfaces'
import { createMecanico, updateMecanico } from '@/lib/actions'

export default function MecanicoForm({ mecanico }: { mecanico: any | null }) {
const router = useRouter()
const { toast } = useToast()
const [isLoading, setIsLoading] = useState(false)

const form = useForm<z.infer<typeof mecanicoSchema>>({
    resolver: zodResolver(mecanicoSchema),
    defaultValues: {
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    direccion: '',
    cedula: '',
    mecanicodetalle: {
        salario: 0,
        horario: '',
        tipo_mecanico: '',
        servicios_realizados: 0,
        experiencia_anhos: 0,
        },
    },
})

const { reset } = form

useEffect(() => {
    if (mecanico) {
    reset({
        nombre: mecanico.nombre || '',
        apellido: mecanico.apellido || '',
        telefono: mecanico.telefono || '',
        correo: mecanico.correo || '',
        direccion: mecanico.direccion || '',
        cedula: mecanico.cedula || '',
        mecanicodetalle: {
            salario: mecanico.mecanicodetalle?.[0]?.salario || 0,
            horario: mecanico.mecanicodetalle?.[0]?.horario || '',
            tipo_mecanico: mecanico.mecanicodetalle?.[0]?.tipo_mecanico || '',
            servicios_realizados: mecanico.mecanicodetalle?.[0]?.servicios_realizados || 0,
            experiencia_anhos: mecanico.mecanicodetalle?.[0]?.experiencia_anhos || 0,
        }
    })
    }
}, [mecanico, reset])

async function onSubmit(values: z.infer<typeof mecanicoSchema>) {
    setIsLoading(true)
    try {
        const data = {
        nombre: values.nombre,
        apellido: values.apellido,
        telefono: values.telefono,
        correo: values.correo,
        direccion: values.direccion,
        cedula: values.cedula,
        detalle: {
            salario: values.mecanicodetalle.salario,
            horario: values.mecanicodetalle.horario,
            tipo_mecanico: values.mecanicodetalle.tipo_mecanico,
            servicios_realizados: values.mecanicodetalle.servicios_realizados,
            experiencia_anhos: values.mecanicodetalle.experiencia_anhos,
        },
    }
    if (mecanico) {
            await updateMecanico(mecanico.id_mecanico, data)
            toast({
            title: 'Mecánico actualizado',
            description: 'El mecánico fue actualizado correctamente. ✅',
            })
        } else {
            await createMecanico(data)
            toast({
            title: 'Mecánico creado',
            description: 'El mecánico fue creado correctamente. ✅',
            })
        }
    
        router.push('/dashboard/mecanico') 
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
            {mecanico ? 'Editar Mecánico' : 'Agregar Mecánico'}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="nombre" render={({ field }) => (
                <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />

                <FormField control={form.control} name="apellido" render={({ field }) => (
                <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />

                <FormField control={form.control} name="telefono" render={({ field }) => (
                <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />

                <FormField control={form.control} name="correo" render={({ field }) => (
                <FormItem>
                    <FormLabel>Correo</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />

                <FormField control={form.control} name="direccion" render={({ field }) => (
                <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />

                <FormField control={form.control} name="cedula" render={({ field }) => (
                <FormItem>
                    <FormLabel>Cédula</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />

                <hr />
                <h3 className="font-semibold text-lg">Detalle del mecánico</h3>

                <FormField control={form.control} name="mecanicodetalle.salario" render={({ field }) => (
                <FormItem>
                    <FormLabel>Salario</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />

                <FormField control={form.control} name="mecanicodetalle.horario" render={({ field }) => (
                <FormItem>
                    <FormLabel>Horario</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />

                <FormField control={form.control} name="mecanicodetalle.tipo_mecanico" render={({ field }) => (
                <FormItem>
                    <FormLabel>Tipo de Mecánico</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />

                <FormField control={form.control} name="mecanicodetalle.servicios_realizados" render={({ field }) => (
                <FormItem>
                    <FormLabel>Servicios Realizados</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />

                <FormField control={form.control} name="mecanicodetalle.experiencia_anhos" render={({ field }) => (
                <FormItem>
                    <FormLabel>Experiencia (años)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />

                <Button type="submit" className="w-full bg-orange-500 text-white hover:bg-orange-700 hover:text-white" disabled={isLoading}>
                {isLoading
                    ? mecanico
                    ? 'Actualizando...'
                    : 'Creando...'
                    : mecanico
                    ? 'Actualizar Mecánico'
                    : 'Agregar Mecánico'}
                </Button>
            </form>
            </Form>
        </CardContent>
        <CardFooter>
            <Button onClick={() => router.push('/dashboard/mecanico')}>Volver</Button>
        </CardFooter>
        </Card>
    </div>
    </div>
)
}