'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Wrench,
  Users,
  BarChart,
  Bell,
  Truck,
  FileText,
  Info,
  Book,
  ClipboardCheckIcon,
  ChartNoAxesCombined,
} from 'lucide-react'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: <Wrench className="h-6 w-6" />,
      title: 'Gestión de Inventario',
      description:
        'Controla tu stock de repuestos y herramientas con facilidad.',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Facturación Electrónica',
      description:
        'Genera y gestiona facturas electrónicas de manera rápida y eficiente.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Gestión de Clientes',
      description:
        'Mantén un registro detallado de tus clientes y sus vehículos.',
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: 'Reportes',
      description: 'Obtén reportes detallados de las ventas.',
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: 'Notificaciones',
      description:
        'Recibe alertas sobre stock bajo y créditos próximos a vencer.',
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: 'Gestión de Proveedores',
      description: 'Administra eficientemente tus proveedores y sus créditos.',
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      title: 'Órdenes de Servicio',
      description:
        'Crea y gestiona órdenes de servicio para un mejor control de reparaciones.',
    },
    {
      icon: <ClipboardCheckIcon className="h-6 w-6" />,
      title: 'Cotizaciones',
      description:
        'Genera cotizaciones de repuestos y servicios para tus clientes.',
    },
    {
      icon: <ChartNoAxesCombined className="h-6 w-6" />,
      title: 'Reportes',
      description:
        'Maneja tus finanzas con los reportes detallados de ventas .',
    },
  ]

  if (!mounted) return null

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <header className="bg-white shadow-sm z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="ml-2 text-xl font-bold text-orange-600">
                  MotoWorkShop
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="#about"
                className="text-gray-600 hover:text-orange-600"
              >
                Acerca de
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow overflow-y-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:text-center"
          >
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Software de Gestión para</span>
              <span className="block text-orange-600">
                Taller y venta de repuestos.
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Optimiza tus operaciones con nuestro sistema integral de gestión.
            </p>
          </motion.div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="pt-6"
                >
                  <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-orange-500 rounded-md shadow-lg">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Comenzar ahora
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>

          <motion.div
            id="about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-24 bg-white rounded-lg shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Acerca de MotoWorkShop
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center">
                  <Info className="mr-2" /> Información del Software
                </h3>
                <p className="text-gray-600 mb-4">
                  Es un software de gestión integral desarrollado específicamente
                  para MotoWorkShop, un taller de motocicletas y tienda de
                  repuestos. Nuestro objetivo principal es optimizar las
                  operaciones diarias del taller, incrementando su eficiencia y
                  proporcionando un control completo sobre áreas clave como el
                  inventario, la gestión de clientes y las finanzas.
                </p>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Autores:
                </h4>
                <ul className="list-disc list-inside text-gray-600 mb-4">
                  <li>Cristóbal Cabrera García</li>
                  <li>Juan Pablo López Isaza</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center">
                  <Book className="mr-2" /> Manual de Usuario
                </h3>
                <p className="text-gray-600 mb-4">
                  Nuestro manual de usuario detallado proporciona toda la
                  información necesaria para aprovechar al máximo MotoWorkShop.
                  Incluye guías paso a paso para todas las funcionalidades del
                  sistema.
                </p>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Contenido del Manual:
                </h4>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Guía uso del sistema</li>
                  <li>Gestión de inventario y repuestos</li>
                  <li>Creación y seguimiento de órdenes de servicio</li>
                  <li>Facturación electrónica</li>
                  <li>Generación de reportes</li>
                  <li>Administración de clientes y proveedores</li>
                </ul>
                <div className="mt-6">
                  <Link
                    href="/manual"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Acceder al Manual Completo
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="bg-white mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 MotoWorkShop. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
