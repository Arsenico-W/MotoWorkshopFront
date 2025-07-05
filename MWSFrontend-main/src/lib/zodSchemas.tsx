import { z } from 'zod'

export const clienteSchema = z.object({
  nombre_cliente: z.string().min(1, { message: 'El nombre es obligatorio' }),
  cedula: z
    .string()
    .min(1, { message: 'La cédula es obligatoria' })
    .max(10, { message: 'La cédula no puede tener más de 10 caracteres' }),
  correo: z.string().email({ message: 'Email no válido' }),
  telefono: z.string().min(1, { message: 'El teléfono es obligatorio' }),
})

export const motoSchema = z.object({
  placa: z
    .string()
    .min(1, { message: 'La placa es obligatoria' })
    .max(6, { message: 'La placa no puede tener más de 6 caracteres' }),
  marca: z.string().min(1, { message: 'La marca es obligatoria' }),
  modelo: z.string().min(1, { message: 'El modelo es obligatorio' }),
  ano: z.number().min(1, { message: 'El año es obligatorio' }),
})

export const marcaRepuestoSchema = z.object({
  nombre_marca: z.string().min(1, 'El nombre de la marca es requerido'),
})

export const motoClienteSchema = z.object({
  id_cliente: z.preprocess((value) => {
    // Intentamos convertir el valor a número
    const parsed = Number(value)
    if (isNaN(parsed)) {
      return null // Si no es un número válido, devolverá null
    }
    return parsed
  }, z.number().min(0, { message: 'Debe seleccionar un propietario.' })),
  placa: z
    .string()
    .min(1, { message: 'La placa es obligatoria' })
    .max(6, { message: 'La placa no puede tener más de 6 caracteres' }),
  marca: z.string().min(1, { message: 'La marca es obligatoria' }),
  modelo: z.string().min(1, { message: 'El modelo es obligatorio' }),
  ano: z.preprocess((value) => {
    // Intentamos convertir el valor a número
    const parsed = Number(value)
    if (isNaN(parsed)) {
      return null // Si no es un número válido, devolverá null
    }
    return parsed
  }, z.number().min(1900, { message: 'El año debe ser mayor a 1900' })),
})

export const repuestoSchema = z.object({
  codigo_barras: z.string().nonempty('El código de barras es requerido'),
  nombre_repuesto: z.string().nonempty('El nombre del repuesto es requerido'),
  valor_compra: z.coerce.number().min(0, 'El valor debe ser positivo'),
  valor_unitario: z.coerce.number().min(0, 'El valor debe ser positivo'),
  ubicacion: z.string().nonempty('La ubicación es requerida'),
  stock: z.coerce.number().min(0, 'El stock debe ser un número positivo'),
  id_marca: z.number().nullable(),
  proveedores: z.array(z.number()).optional(),
  motos_mercado: z.array(z.number()).optional(),
})

export const proveedorSchema = z.object({
  nombre_proveedor: z.string().min(1, 'El nombre del proveedor es requerido'),
  nit: z.string().min(1, 'El NIT es requerido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  asesor: z.string().min(1, 'El nombre del asesor es requerido'),
  fecha_vencimiento: z.string().min(1, 'La fecha de vencimiento es requerida'),
  repuestos: z.array(z.number()).optional(),
})

export const motoMercadoSchema = z.object({
  modelo: z.string().min(1, 'El modelo es obligatorio'),
  repuestos: z.array(z.number()).min(0).optional(),
})

export const servicioSchema = z.object({
  nombre_servicio: z.string().min(1, 'El nombre del servicio es requerido'),
})

export const userSchema = z.object({
  nombre_usuario: z
    .string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Email no válido' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  rol: z.enum(['ADMINISTRADOR', 'VENDEDOR'], {
    required_error: 'Por favor seleccione un rol',
  }),
})

export const ordenServicioFormSchema = z.object({
  id_orden_servicio: z.number().optional(),
  fecha: z.date(),
  estado: z.enum(['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO']),
  subtotal: z
    .number()
    .min(0, 'El subtotal después del descuento debe ser mayor o igual a 0'),
  descuento: z.number().min(0),
  iva: z.number().min(0),
  total: z.number().min(0),
  guardar_cascos: z.boolean(),
  guardar_papeles: z.boolean(),
  observaciones: z.string().optional(),
  observaciones_mecanico: z.string().optional(),
  observaciones_factura: z.string().optional(),
  mecanico: z.string().min(1, 'El nombre del mecánico es requerido'),
  vendedor: z.string().optional(),
  id_moto_cliente: z
    .number()
    .int()
    .positive('La moto del cliente es requerida'),
  servicios: z.array(
    z.object({
      id_servicio: z.number().int().positive('El ID del servicio es requerido'),
      nombre_servicio: z.string(),
      precio: z.number().min(0, 'El precio del servicio es requerido'),
    })
  ),
  repuestos: z.array(
    z.object({
      id_repuesto: z.number().int().positive('El ID del repuesto es requerido'),
      nombre_repuesto: z.string(),
      cantidad: z.number().int().positive('La cantidad es requerida'),
      precio: z.number().min(0, 'El precio del repuesto es requerido'),
    })
  ),
  adelanto_efectivo: z.number().min(0),
  adelanto_tarjeta: z.number().min(0),
  adelanto_transferencia: z.number().min(0),
})

export const ventaFormSchema = z.object({
  id_venta: z.number().optional(),
  fecha: z.date(),
  pago_efectivo: z.number().min(0),
  pago_tarjeta: z.number().min(0),
  pago_transferencia: z.number().min(0),
  subtotal_sin_descuento: z.number().min(0),
  descuento: z.number().min(0),
  subtotal: z.number().min(0),
  iva: z.number().min(0),
  total: z.number().min(0),
  id_cliente: z.number().int().positive('El cliente es requerido'),
  repuestos: z.array(
    z.object({
      id_repuesto: z.number().int().positive('El ID del repuesto es requerido'),
      nombre_repuesto: z.string(),
      cantidad: z.number().int().positive('La cantidad es requerida'),
      precio: z.number().min(0, 'El precio del repuesto es requerido'),
    })
  ),
  vendedor: z.string().optional(),
})

export const mecanicoSchema = z.object({
  nombre: z.string().min(1, { message: 'El nombre es obligatorio' }),
  apellido: z.string().min(1, { message: 'El apellido es obligatorio' }),
  cedula: z
    .string()
    .min(6, { message: 'La cédula debe tener mínimo 6 caracteres' })
    .max(10, { message: 'La cédula no puede tener más de 10 caracteres' }),
  correo: z
    .string()
    .email({ message: 'Correo no válido' })
    .optional(),
  telefono: z
    .string()
    .min(7, { message: 'El teléfono debe tener al menos 7 dígitos' })
    .optional(),
  direccion: z.string().optional(),
  mecanicodetalle: z.object({
    id_mecanicodetalle: z.coerce.number({message: 'El id del mecanico detalle es obligatorio'}).optional(), 
    salario: z.coerce.number().positive({ message: 'El salario debe ser mayor a 0' }),
    horario: z.string().optional(),
    tipo_mecanico: z.string().optional(),
    servicios_realizados: z.coerce.number().min(0).optional(),
    experiencia_anhos: z.coerce.number().min(0).optional(),
  })
  
})

export const reservaSchema = z.object({
  fecha_reserva: z
    .string()
    .min(1, { message: 'La fecha de reserva es obligatoria' }), 
  // id_cliente: z .preprocess((val) => Number(val), z.
  //   number({ invalid_type_error: 'El ID del cliente debe ser numérico' }).
  //   positive({ message: 'Debe seleccionar un cliente' })),
  // id_servicio: z.preprocess((val) => val !== '' ? Number(val) : undefined, z.
  //   number({ invalid_type_error: 'El ID del servicio debe ser numérico' }).
  //   positive({ message: 'Debe seleccionar un servicio' }).optional()),
  id_cliente: z.string().min(1, { message: 'Siempre debes seleccionar un cliente' }),
  id_servicio: z.string().optional(),
})
