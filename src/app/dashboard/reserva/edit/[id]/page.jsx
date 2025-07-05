'use client'

import React, { useEffect, useState } from 'react'

import ReservaForm from '@/components/reserva/ReservaForm'
import { useToast } from '@/components/ui/use-toast'
import { fetchOneReserva } from '@/lib/data'
import {Reserva, PageProps} from '@/lib/interfaces'


function Page({ params }) {

    const [reserva, setReserva] = useState(null)
    const { toast } = useToast()

    useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await fetchOneReserva(Number(params.id))
            setReserva(data)
        } catch (error) {
        console.log(error)
        toast({
            title: 'Error',
            description: 'No se pudo obtener la reserva. Intenta de nuevo.',
            variant: 'destructive',
        })
        }
    }
    fetchData()
    }, [params.id])
    if (reserva === null) {
    }

    console.log("reserva", reserva)
    return <ReservaForm reserva={reserva} />
}

export default Page