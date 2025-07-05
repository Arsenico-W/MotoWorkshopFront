import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Edit, Eye, Trash2, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ViewEditDeleteBtnProps {
  url: string
  id: number
  apiUrl: string
  onDelete?: () => void
}

export function ViewEditDeleteBtn(props: ViewEditDeleteBtnProps) {
  const { url, id, apiUrl, onDelete } = props
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    router.push(`${url}/edit/${id}`)
  }

  const handleDelete = async () => {
    const rol = localStorage.getItem('rol')
    if (rol !== 'ADMINISTRADOR') {
      toast({
        title: 'Error',
        description: 'No tienes permisos para borrar.',
        variant: 'destructive',
      })
      return
    }

    setIsDeleting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No se encontró el token de autenticación')
      }

      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Error al eliminar el registro')
      }

      toast({
        title: 'Éxito',
        description: 'Registro eliminado correctamente. ✅',
      })

      // Si hay callback, usarlo para actualizar la lista
      if (onDelete) {
        onDelete()
      } else {
        // Fallback: refrescar la página después de un breve retraso
        setTimeout(() => {
          router.refresh()
        }, 1000)
      }
    } catch (error) {
      console.error('Error al eliminar:', error)
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo borrar, intenta nuevamente.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex justify-end space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`${url}/view/${id}`} passHref>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ver detalles</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Editar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isDeleting}>
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Eliminar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de que quieres eliminar este registro?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el registro y todos los datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
