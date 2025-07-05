"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { User, Calendar } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { fetchOneMecanico } from '@/lib/data'
import { Mecanico } from '@/lib/interfaces'
import { staticGenerationAsyncStorage } from 'next/dist/client/components/static-generation-async-storage-instance'

export default function ViewMecanicoPage({ params }: { params: { id: number } }) {
const [mecanico, setMecanico] = useState<Mecanico | null>(null)
const [loading, setLoading] = useState(true)
const router = useRouter()
const { id } = params
const { toast } = useToast()

useEffect(() => {
    const fetchData = async () => {
    try {
        setLoading(true)
        const data = await fetchOneMecanico(id)
        setMecanico(data)
    } catch (error) {
        console.error(error)
        toast({
        title: 'Error',
        description: 'No se pudieron obtener los datos del mecánico.',
        variant: 'destructive',
        })
    } finally {
        setLoading(false)
    }
    }
    fetchData()
}, [id, toast])

const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    })

if (loading) {
    return (
    <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[300px] w-full" />
    </div>
    )
}

if (!mecanico) {
    return (
    <div className="flex justify-center items-center h-screen">
        No se encontraron datos del mecánico.
    </div>
    )
}

return (
    <div className="container mx-auto py-6 space-y-6">
    <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Detalles del Mecánico</h1>
        <Button onClick={() => router.push('/dashboard/mecanico')}>
        Volver a la lista de mecánicos
        </Button>
    </div>
    <Separator />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
        <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
                <h2 className="text-2xl font-semibold">
                {mecanico.nombre} {mecanico.apellido}
                </h2>
                <p className="text-muted-foreground">
                    {mecanico.cedula}</p>
            </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
                <strong>Correo: </strong> 
                {mecanico.correo || 'N/A'}
            </div>
            <div>
                <strong>Teléfono: </strong> 
                {mecanico.telefono || 'N/A'}
            </div>
            <div>
                <strong>Dirección: </strong> 
                {mecanico.direccion || 'N/A'}
            </div>
            <div>
                <strong>Servicios Realizados: </strong>{' '}
                {mecanico.mecanicodetalle?.[0]?.servicios_realizados ?? 'N/A'}
            </div>
            <div>
                <strong>Experiencia (años): </strong>{' '}
                {mecanico.mecanicodetalle?.[0]?.experiencia_anhos ?? 'N/A'}
            </div>
            <div>
                <strong>Tipo (conocimiento): </strong> 
                {mecanico.mecanicodetalle?.[0]?.tipo_mecanico ?? 'N/A'}
            </div>
            <div>
                <strong>Salario: $</strong> 
                { mecanico.mecanicodetalle?.[0]?.salario ?? 'N/A'}
            </div>
            <div>
                <strong>Horario: </strong> 
                {mecanico.mecanicodetalle?.[0]?.horario ?? 'N/A'}
            </div>
            </div>
        </CardContent>
        </Card>
    </div>
    </div>
)
}
