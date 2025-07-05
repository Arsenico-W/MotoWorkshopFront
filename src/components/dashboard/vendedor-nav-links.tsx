'use client'
// React and Next.js hooks
import { useCallback, useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Next.js components
import Link from 'next/link'

// Animation libraries
import { motion, AnimatePresence } from 'framer-motion'

// Utility libraries
import clsx from 'clsx'

// Heroicons icons
import {
  UserGroupIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  BriefcaseIcon,
  WrenchIcon,
  ChevronDownIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline'

// Lucide-react icons
import {
  Bike,
  Receipt,
  UsersRound,
  ClipboardList,
  ReceiptText,
  Package,
  Origami,
  ClipboardCheckIcon,
  Notebook,
} from 'lucide-react'

// Custom components
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

type NavLink = {
  name: string
  href: string
  icon: React.ElementType
  subItems?: NavLink[]
}

const links: NavLink[] = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Facturación',
    href: '/dashboard/facturas',
    icon: ReceiptText,
    subItems: [
      { name: 'Facturas', href: '/dashboard/facturas', icon: Receipt },
      {
        name: 'Generar venta',
        href: '/dashboard/facturas/ventas/add',
        icon: BanknotesIcon,
      },
      {
        name: 'Ventas',
        href: '/dashboard/facturas/ventas',
        icon: ClipboardList,
      },
    ],
  },
  {
    name: 'Orden de servicio',
    href: '/dashboard/ordenServicio',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Cotizaciones',
    href: '/dashboard/cotizaciones',
    icon: ClipboardCheckIcon,
  },
  {
    name: 'Clientes',
    href: '/dashboard/clientes',
    icon: UserGroupIcon,
    subItems: [
      { name: 'Clientes', href: '/dashboard/clientes', icon: UsersRound },
      {
        name: 'Motos de clientes',
        href: '/dashboard/clientes/motos',
        icon: Bike,
      },
    ],
  },
  {
    name: 'Mecánico',
    href: '/dashboard/mecanico',
    icon: UserGroupIcon,
  },
  { name: 'Servicios', 
    href: '/dashboard/servicios', 
    icon: Origami },
  {
    name: 'Reservas',
    href: '/dashboard/reserva',
    icon: ClipboardCheckIcon,
  },
  {
    name: 'Inventario',
    href: '/dashboard/repuestos',
    icon: Package,
    subItems: [
      { name: 'Repuestos', href: '/dashboard/repuestos', icon: WrenchIcon },
      { name: 'Marcas', href: '/dashboard/repuestos/marcas', icon: WrenchIcon },
      {
        name: 'Motos para repuestos',
        href: '/dashboard/repuestos/motos',
        icon: Bike,
      },
    ],
  },
  { name: 'Proveedores', href: '/dashboard/proveedores', icon: BriefcaseIcon },
  {
    name: 'Manual de usuario',
    href: '/manual',
    icon: Notebook,
  },
]

export default function VendedorNavLinks() {
  const pathname = usePathname()
  const [openCollapsibles, setOpenCollapsibles] = useState<
    Record<string, boolean>
  >({})
  const navRef = useRef<HTMLElement>(null)

  const toggleCollapsible = useCallback((name: string) => {
    setOpenCollapsibles((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }, [])

  const isActive = useCallback(
    (href: string) => {
      if (href === '/dashboard') {
        return pathname === href
      }
      return pathname.includes(href)
    },
    [pathname]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenCollapsibles({})
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const renderLink = useCallback(
    (link: NavLink, isSubItem = false) => {
      const LinkIcon = link.icon
      const active = isActive(link.href)

      return (
        <Link
          key={link.name}
          href={link.href}
          className={clsx(
            'flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out hover:bg-sky-100 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
            {
              'bg-sky-100 text-orange-600': active,
              'h-12': !isSubItem,
              'h-10 pl-9': isSubItem,
            }
          )}
          aria-current={active ? 'page' : undefined}
        >
          <LinkIcon className="h-5 w-5" aria-hidden="true" />
          <span className={isSubItem ? '' : ' md:inline'}>{link.name}</span>
        </Link>
      )
    },
    [isActive]
  )

  const renderCollapsible = useCallback(
    (link: NavLink) => (
      <Collapsible
        key={link.name}
        open={openCollapsibles[link.name]}
        onOpenChange={() => toggleCollapsible(link.name)}
      >
        <CollapsibleTrigger
          className={clsx(
            'flex h-12 w-full items-center justify-between rounded-md bg-gray-50 px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out hover:bg-sky-100 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
            {
              'bg-sky-100 text-orange-600': isActive(link.href),
            }
          )}
          aria-expanded={openCollapsibles[link.name]}
        >
          <div className="flex items-center gap-3">
            <link.icon className="h-5 w-5" aria-hidden="true" />
            <span className=" md:inline">{link.name}</span>
          </div>
          <motion.div
            initial={false}
            animate={{ rotate: openCollapsibles[link.name] ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
          </motion.div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <AnimatePresence>
            {openCollapsibles[link.name] && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-1 space-y-1"
              >
                {link.subItems?.map((subItem) => renderLink(subItem, true))}
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    ),
    [openCollapsibles, isActive, toggleCollapsible, renderLink]
  )

  return (
    <nav className="space-y-1" ref={navRef} aria-label="Admin navigation">
      {links.map((link) =>
        link.subItems && link.subItems.length > 0
          ? renderCollapsible(link)
          : renderLink(link)
      )}
    </nav>
  )
}
