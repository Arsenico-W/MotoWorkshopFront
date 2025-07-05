import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { PlusCircleIcon } from 'lucide-react'

interface AddBtnProps {
    url: string
    }

function AddBtn(props: AddBtnProps) {
  const router = useRouter()
  const { url } = props
  return <Button onClick={() => router.push(url)}>
    <PlusCircleIcon size={24} />
    Agregar</Button>
}

export default AddBtn
