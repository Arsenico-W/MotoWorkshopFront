'use client'

import React, { useEffect, useState } from 'react'

import MecanicoForm from '@/components/mecanicos/MecanicoForm'
import { useToast } from '@/components/ui/use-toast'
import { fetchOneMecanico } from '@/lib/data'
import {Mecanico, PageProps} from '@/lib/interfaces'


function Page({ params }: PageProps ){

    const [mecanico, setMecanico] = useState<Mecanico | null>(null)
    const { toast } = useToast()

    useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await fetchOneMecanico(Number(params.id))
            setMecanico(data)
        } catch (error) {
        console.log(error)
        toast({
            title: 'Error',
            description: 'No se pudo obtener el mecánico. Intenta de nuevo.',
            variant: 'destructive',
        })
        }
    }
    fetchData()
    }, [params.id])
    if (mecanico === null) {
    }

    console.log("mecanico", mecanico)
    return <MecanicoForm mecanico={mecanico} />
}

export default Page