'use client'
// React and Next.js imports
import { useState } from 'react'
import Link from 'next/link'

// UI components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Icons
import {
  Users,
  FileText,
  Bike,
  Wrench,
  Package,
  Truck,
  ArrowRight,
  ClipboardCheckIcon,
  Origami,
} from 'lucide-react'
import { title } from 'process'
import { link } from 'fs'

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('')

  const cards = [
    {
      title: 'Clientes',
      description: 'Maneja la información de los clientes.',
      icon: Users,
      link: '/dashboard/clientes',
    },
    {
      title: 'Mecánicos',
      description: 'Maneja la información de los mecanicos',
      icon: Users,
      link: '/dashboard/mecanico',
    },
    {
      title: 'Facturas',
      description: 'Ver y crear facturas.',
      icon: FileText,
      link: '/dashboard/facturas',
    },
    {
      title: 'Motos',
      description: 'Maneja la información de las motos de los clientes.',
      icon: Bike,
      link: '/dashboard/clientes/motos',
    },
    {
      title: 'Órdenes de Servicio',
      description: 'Crea órdenes de servicio para los mecánicos.',
      icon: Wrench,
      link: '/dashboard/ordenServicio',
    },
    {
      title: 'Repuestos',
      description: 'Maneja la información de los repuestos.',
      icon: Package,
      link: '/dashboard/repuestos',
    },
    {
      title: 'Proveedores',
      description: 'Maneja tus proveedores de repuestos.',
      icon: Truck,
      link: '/dashboard/proveedores',
    },
    {
      title: 'Cotizaciones',
      description: 'Cotiza repuestos y servicios.',
      icon: ClipboardCheckIcon,
      link: '/dashboard/cotizaciones',
    },
    {
      title: 'Servicios',
      description: 'Maneja los servicios que brindas.',
      icon: Origami,
      link: '/dashboard/servicios',
    },
    {
      title: 'Reservas',
      description: 'Crea reservas para servicios',
      icon: ClipboardCheckIcon,
      link: '/dashboard/reserva'
    },
  ]

  const filteredCards = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-primary">
        Bienvenido a MotoWorkShop
      </h1>
      <p className="text-xl mb-8 text-muted-foreground">
        Gestiona todos los aspectos de tu taller de motos desde un solo lugar.
      </p>

      <div className="mb-8">
        <Input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card, index) => (
          <Card
            key={index}
            className="transition-all duration-300 hover:shadow-lg"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">{card.title}</CardTitle>
              <card.icon className="h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{card.description}</p>
              <Link href={`${card.link}`}>
                <Button variant="outline" className="w-full">
                  Ir a {card.title} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
