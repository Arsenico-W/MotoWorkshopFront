'use client'

// React and Next.js hooks
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Form handling with react-hook-form and zod
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Cookie management
import { setCookie } from 'nookies'

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
import { Checkbox } from '@/components/ui/checkbox'

// Icons
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

// Image component
import Image from 'next/image'

// Animation library
import { motion } from 'framer-motion'

const formSchema = z.object({
  email: z.string().email({
    message: 'Email no válido',
  }),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
  rememberMe: z.boolean().optional(),
})

export default function Login() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const data = {
        ...values,
        email: values.email.toLowerCase(),
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )

      if (response.ok) {
        const data = await response.json()

        localStorage.setItem('token', data.access_token)
        localStorage.setItem('rol', data.rol)
        localStorage.setItem('userName', data.userName)

        const cookieOptions = {
          maxAge: values.rememberMe ? 30 * 24 * 60 * 60 : undefined, // 30 days if remember me is checked
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        }

        setCookie(null, 'token', data.access_token, cookieOptions)
        setCookie(null, 'rol', data.rol, cookieOptions)

        toast({
          title: 'Inicio de sesión exitoso',
          description: 'Bienvenido de vuelta.',
        })
        router.push('/dashboard')
      } else {
        throw new Error('Login failed')
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error de inicio de sesión',
        description: 'Credenciales inválidas. Por favor, intenta de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg shadow-2xl overflow-x-hidden overflow-y-auto max-h-[90vh] flex flex-col md:pb-4 sm:pb-4 ">
          <div className="p-8 overflow-y-auto flex-grow">
            <div className="flex justify-center mb-8">
              <Image
                src="/logo.svg"
                alt="MotoTaller Logo"
                width={180}
                height={60}
                className="drop-shadow-md"
              />
            </div>
            <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
              Iniciar sesión
            </h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
                          <Input
                            placeholder="tu@email.com"
                            {...field}
                            className="pl-10 bg-gray-50 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Contraseña
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="******"
                            {...field}
                            className="pl-10 pr-10 bg-gray-50 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-orange-500 text-orange-500 focus:ring-orange-500"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal text-gray-600">
                          Recordarme
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-orange-500 text-white hover:bg-orange-600 transition-colors rounded-md py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

