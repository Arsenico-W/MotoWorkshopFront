"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { fetchOneReserva } from '@/lib/data'
import { Reserva } from '@/lib/interfaces'

export default function ViewReservaPage({ params }: { params: { id: number } }) {
const [reserva, setReserva] = useState<Reserva | null>(null)
const [loading, setLoading] = useState(true)
const router = useRouter()
const { id } = params
const { toast } = useToast()

useEffect(() => {
    const fetchData = async () => {
    try {
        setLoading(true)
        const data = await fetchOneReserva(id)
        setReserva(data)
    } catch (error) {
        console.error(error)
        toast({
        title: 'Error',
        description: 'No se pudieron obtener los datos de la reserva.',
        variant: 'destructive',
        })
    } finally {
        setLoading(false)
    }
    }
    fetchData()
}, [id, toast])

const formatDate = (date: string | Date) =>
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

if (!reserva) {
    return (
    <div className="flex justify-center items-center h-screen">
        No se encontraron datos de la reserva.
    </div>
    )
}

return (
    <div className="container mx-auto py-6 space-y-6">
    <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Detalles de la Reserva</h1>
        <Button onClick={() => router.push('/dashboard/reserva')}>
        Volver a la lista de reservas
        </Button>
    </div>
    <Separator />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
        <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
                <strong>Cliente:</strong> {reserva.Cliente.nombre_cliente}
            </div>
            <div>
                <strong>Servicio:</strong> {reserva.Servicio.nombre_servicio}
            </div>
            <div>
                <strong>Fecha de Reserva:</strong> {formatDate(reserva.fecha_reserva)}
            </div>
            </div>
        </CardContent>
        </Card>
        <Card>
        <CardHeader>
            <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span>Reserva ID:</span>
                <Badge variant="secondary">{reserva.id_reserva}</Badge>
            </div>
            </div>
        </CardContent>
        </Card>
    </div>
    </div>
)
}
