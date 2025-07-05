'use client'
// React and state management
import { useState } from 'react'

// Next.js router
import { useRouter } from 'next/navigation'

// UI components
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Alert, AlertDescription } from '@/components/ui/alert'

// Icons
import {
  Search,
  Users,
  Bike,
  Package,
  FileText,
  Wrench,
  BarChart,
  Info,
  Bell,
  Menu,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react'

export default function UserManual() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSection, setSelectedSection] = useState('introduccion')
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const sections = [
    {
      id: 'introduccion',
      title: '1. Introducción',
      icon: Info,
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">
            Manual de Usuario - MotoWorkShop
          </h2>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">1.1 Acceso al Sistema</h3>
            <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
              <p>Para comenzar a utilizar el sistema, siga estos pasos:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Ingrese al enlace proporcionado del sistema</li>
                <li>
                  Localice el botón naranja de inicio de sesión en la esquina
                  superior derecha
                </li>
                <li>Ingrese sus credenciales proporcionadas</li>
                <li>Haga clic en "Iniciar Sesión"</li>
              </ol>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'clientes',
      title: '2. Gestión de Clientes',
      icon: Users,
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Gestión de Clientes</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="vista-general">
              <AccordionTrigger>2.1 Vista General</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <p>La página de clientes presenta:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Tabla con información de clientes</li>
                    <li>Barra de búsqueda (filtrado por cédula o nombre)</li>
                    <li>Botón para agregar nuevos clientes</li>
                    <li>Selector de cantidad de registros por página</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="agregar-cliente">
              <AccordionTrigger>2.2 Agregar Cliente</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <p>Para agregar un nuevo cliente:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Haga clic en el botón "Agregar"</li>
                    <li>Complete el formulario con los datos del cliente</li>
                    <li>Presione "Agregar Cliente"</li>
                  </ol>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Cédula, correo y teléfono deben ser únicos
                    </AlertDescription>
                  </Alert>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
    },
    {
      id: 'motos',
      title: '3. Gestión de Motos',
      icon: Bike,
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Gestión de Motos</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="registro-motos">
              <AccordionTrigger>3.1 Registro de Motos</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <p>Para registrar una nueva moto:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Haga clic en "Agregar"</li>
                    <li>
                      Complete el formulario con la información de la moto
                    </li>
                    <li>Asigne un cliente existente</li>
                    <li>Confirme la operación</li>
                  </ol>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      La placa debe ser única para cada moto
                    </AlertDescription>
                  </Alert>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
    },
    {
      id: 'repuestos',
      title: '4. Gestión de Repuestos',
      icon: Package,
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Gestión de Repuestos</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="marcas">
              <AccordionTrigger>4.1 Marcas de Repuestos</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <p>Para agregar una marca:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Navegue a la sección de marcas</li>
                    <li>Haga clic en "Agregar"</li>
                    <li>Ingrese el nombre de la marca</li>
                    <li>Confirme la creación</li>
                  </ol>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No pueden crearse marcas duplicadas
                    </AlertDescription>
                  </Alert>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="inventario">
              <AccordionTrigger>4.2 Gestión de Inventario</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <p>Al agregar repuestos, debe especificar:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Marca del repuesto</li>
                    <li>Proveedores que lo surten</li>
                    <li>Motos compatibles</li>
                    <li>Stock inicial (no puede ser negativo)</li>
                    <li>Código de barras (único)</li>
                    <li>Ubicación en tienda</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
    },
    {
      id: 'facturas',
      title: '5. Facturación',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Facturación</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="tipos">
              <AccordionTrigger>5.1 Tipos de Facturación</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <p>Existen dos formas de generar facturas:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Venta directa de repuestos</li>
                    <li>Orden de servicio completada</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="impresion">
              <AccordionTrigger>5.2 Opciones de Impresión</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <ul className="list-disc list-inside space-y-2">
                    <li>Impresión estándar</li>
                    <li>Impresión térmica (formato voucher)</li>
                    <li>Generación de XML (cumple normativa fiscal)</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
    },
    {
      id: 'ordenes',
      title: '6. Órdenes de Servicio',
      icon: Wrench,
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Órdenes de Servicio</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="estados">
              <AccordionTrigger>6.1 Estados de la Orden</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>Pendiente:</strong> Estado inicial al crear
                    </li>
                    <li>
                      <strong>En proceso:</strong> Trabajo iniciado
                    </li>
                    <li>
                      <strong>Completado:</strong> Servicio finalizado y pagado
                    </li>
                    <li>
                      <strong>Cancelado:</strong> Orden anulada, stock retornado
                    </li>
                  </ul>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Evite cambiar de Completado a Cancelado. Siga la
                      secuencia: Pendiente → En proceso → Completado/Cancelado
                    </AlertDescription>
                  </Alert>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
    },
    {
      id: 'reportes',
      title: '7. Reportes',
      icon: BarChart,
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Reportes</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="cierre">
              <AccordionTrigger>7.1 Cierre de Caja</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <p>Consulta diaria de ingresos por método de pago:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Efectivo</li>
                    <li>Tarjeta</li>
                    <li>Transferencia</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ),
    },
    {
      id: 'notificaciones',
      title: '8. Notificaciones',
      icon: Bell,
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Sistema de Notificaciones</h2>
          <div className="space-y-4">
            <p>
              Las notificaciones se actualizan cada 5 minutos y alertan sobre:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Repuestos con stock menor o igual a 10 unidades</li>
              <li>Créditos próximos a vencer (5 días o menos)</li>
            </ul>
          </div>
        </div>
      ),
    },
  ]

  const Navigation = ({ className = '' }) => (
    <div className={className}>
      <div className="justify-between">
        <Button onClick={() => router.push('/')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <h1 className="text-2xl font-bold mb-6">Manual de Usuario</h1>
      </div>
      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar en el manual..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-2 pr-4">
          {sections
            .filter((section) =>
              section.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((section) => (
              <Button
                key={section.id}
                variant={selectedSection === section.id ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  setSelectedSection(section.id)
                  setIsOpen(false)
                }}
              >
                <section.icon className="mr-2 h-4 w-4" />
                {section.title}
              </Button>
            ))}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <Navigation className="mt-6" />
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className="w-80 border-r bg-card hidden md:block p-6">
        <Navigation />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <ScrollArea className="h-[calc(100vh-2rem)]">
            {sections.find((s) => s.id === selectedSection)?.content}
          </ScrollArea>
        </div>
      </div>

      {/* Quick Navigation Buttons */}
      <div className="fixed bottom-4 right-4 space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            const currentIndex = sections.findIndex(
              (s) => s.id === selectedSection
            )
            if (currentIndex > 0) {
              setSelectedSection(sections[currentIndex - 1].id)
            }
          }}
          disabled={sections.findIndex((s) => s.id === selectedSection) === 0}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const currentIndex = sections.findIndex(
              (s) => s.id === selectedSection
            )
            if (currentIndex < sections.length - 1) {
              setSelectedSection(sections[currentIndex + 1].id)
            }
          }}
          disabled={
            sections.findIndex((s) => s.id === selectedSection) ===
            sections.length - 1
          }
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
