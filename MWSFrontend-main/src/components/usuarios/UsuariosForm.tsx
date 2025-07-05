'use client'

// React and Next.js hooks
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// React Hook Form and Zod for form handling and validation
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// UI components
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Types and schemas
import { User } from '@/lib/interfaces'
import { userSchema } from '@/lib/zodSchemas'

// API actions and utilities
import { createUser, updateUser } from '@/lib/actions'
import { formatName } from '@/lib/utils'

export default function UserForm({ user }: { user: User | null }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nombre_usuario: '',
      email: '',
      password: '',
      rol: 'VENDEDOR',
    },
  })

  const { reset } = form

  useEffect(() => {
    if (user) {
      reset({
        nombre_usuario: user.nombre_usuario || '',
        email: user.email || '',
        password: '',
        rol: user.rol || 'VENDEDOR',
      })
    }
  }, [user, reset])

  async function onSubmit(values: z.infer<typeof userSchema>) {
    console.log('Intentando enviar el formulario con los datos:', values)
    setIsLoading(true)

    try {
      const data = {
        ...values,
        nombre_usuario: formatName(values.nombre_usuario),
        email: values.email.toLowerCase(),
      }
      if (user) {
        await updateUser(user.id_usuario, data)
        toast({
          title: 'Usuario actualizado',
          description: 'El usuario fue actualizado correctamente. ✅',
        })
      } else {
        await createUser(data)
        toast({
          title: 'Usuario creado',
          description: 'El usuario fue creado correctamente. ✅',
        })
      }

      router.push('/dashboard/usuarios')
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

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{user ? 'Editar Usuario' : 'Agregar Usuario'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  console.log('Intentando enviar el formulario')

                  await form.handleSubmit(onSubmit)()

                  const errors = form.formState.errors
                  console.log('Errores de validación:', errors)
                }}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="nombre_usuario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de Usuario</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingresa el nombre de usuario"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Ingresa el email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {user && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Ingresa la contraseña"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="rol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un rol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ADMINISTRADOR">
                            Administrador
                          </SelectItem>
                          <SelectItem value="VENDEDOR">Vendedor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />

                <Button
                  variant="outline"
                  type="submit"
                  className="w-full bg-orange-500 text-white hover:bg-orange-700"
                  disabled={isLoading}
                >
                  {isLoading
                    ? user
                      ? 'Actualizando...'
                      : 'Creando...'
                    : user
                    ? 'Actualizar Usuario'
                    : 'Agregar Usuario'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/dashboard/usuarios')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
