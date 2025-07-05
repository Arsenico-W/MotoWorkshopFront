"use client";

// React and Next.js hooks
import { useState } from "react";
import { useRouter } from "next/navigation";

// Form handling and validation
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// UI components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

// Icons
import { Eye, EyeOff, User, Mail, Lock, UserCog } from "lucide-react";

// Image and animations
import Image from "next/image";
import { motion } from "framer-motion";

// Utility functions
import { formatName } from "@/lib/utils";

const formSchema = z.object({
  nombre_usuario: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede exceder los 50 caracteres" }),
  email: z.string().email({ message: "Email no válido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial",
      }
    ),
  rol: z.enum(["ADMINISTRADOR", "VENDEDOR"], {
    required_error: "Por favor seleccione un rol",
  }),
});

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre_usuario: "",
      email: "",
      password: "",
      rol: "VENDEDOR",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const data = {
        ...values,
        email: values.email.toLowerCase(),
        nombre_usuario: formatName(values.nombre_usuario),
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Registro exitoso",
          description:
            "La cuenta ha sido creada. Serás redirigido al dashboard.",
          duration: 5000,
        });
        setTimeout(() => router.push("/dashboard"), 5000);
      } else {
        const error = await response.json();
        toast({
          title: "Error de registro",
          description: error.message || "Ocurrió un error durante el registro.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error de conexión",
        description:
          "No se pudo conectar con el servidor. Por favor, intenta de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
         <div className="bg-white rounded-lg shadow-2xl overflow-x-hidden overflow-y-auto max-h-[90vh] flex flex-col md:pb-4 sm:pb-4 ">
         <div className="p-8 overflow-y-auto flex-grow">
            <div className="flex justify-center mb-6 sm:mb-8">
              <Image
                src="/logo.svg"
                alt="MotoTaller Logo"
                width={180}
                height={60}
                className="drop-shadow-md"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
              Crear Cuenta
            </h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-6"
              >
                <FormField
                  control={form.control}
                  name="nombre_usuario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Nombre</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
                          <Input
                            placeholder="Tu nombre completo"
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
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
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
                <FormField
                  control={form.control}
                  name="rol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Rol</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <div className="relative">
                            <UserCog className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 z-10" />
                            <SelectTrigger className="pl-10 bg-gray-50 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm">
                              <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ADMINISTRADOR">
                            Administrador
                          </SelectItem>
                          <SelectItem value="VENDEDOR">Vendedor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-orange-500 text-white hover:bg-orange-600 transition-colors rounded-md py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Registrando..." : "Crear Cuenta"}
                </Button>
              </form>
            </Form>
          </div>
          <div className="bg-orange-100 p-4 sm:p-6">
            <p className="text-center text-sm text-gray-600">
              <a
                href="/dashboard/usuarios"
                className="text-orange-500 hover:underline font-medium"
              >
                Volver
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

