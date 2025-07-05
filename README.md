# Manual de Usuario - MotoWorkShop

## 1. Introducción

### 1.1 Acceso al Sistema
Para comenzar a utilizar el sistema, siga estos pasos:
1. Ingrese al enlace proporcionado del sistema
2. Localice el botón naranja de inicio de sesión en la esquina superior derecha
3. Ingrese sus credenciales proporcionadas
4. Haga clic en "Iniciar Sesión"

### 1.2 Acerca del Sistema
En esta sección encontrará información general del software y acceso a este manual de usuario.

## 2. Gestión de Clientes

### 2.1 Vista General
La página de clientes presenta:
- Tabla con información de clientes
- Barra de búsqueda (filtrado por cédula o nombre)
- Botón para agregar nuevos clientes
- Selector de cantidad de registros por página

### 2.2 Agregar Cliente
Para agregar un nuevo cliente:
1. Haga clic en el botón "Agregar"
2. Complete el formulario con los datos del cliente
3. Importante: Cédula, correo y teléfono deben ser únicos
4. Presione "Agregar Cliente"
5. Verificar el mensaje de éxito

## 3. Gestión de Motos

### 3.1 Acceso y Vista General
- Acceda desde el botón "Ir a la sección de motos"
- Visualice la lista de motos registradas

### 3.2 Registro de Motos
Para registrar una nueva moto:
1. Haga clic en "Agregar"
2. Complete el formulario
3. Asigne un cliente existente
4. Importante: La placa debe ser única
5. Confirme la operación

## 4. Gestión de Repuestos

### 4.1 Marcas de Repuestos
1. Acceda a "Sección de marcas"
2. Para agregar una marca:
   - Haga clic en "Agregar"
   - Ingrese el nombre (no puede duplicarse)
   - Confirme la creación

### 4.2 Modelos Compatibles
1. Acceda a "Sección de motos"
2. Para agregar compatibilidad:
   - Registre el modelo (debe ser único)
   - Opcionalmente, asocie repuestos existentes

### 4.3 Gestión de Inventario
Para agregar repuestos:
1. Complete el formulario incluyendo:
   - Marca del repuesto
   - Proveedores
   - Motos compatibles
   - Stock inicial (no negativo)
   - Código de barras (único)
   - Ubicación en tienda

## 5. Facturación

### 5.1 Tipos de Facturación
Existen dos formas de generar facturas:
1. Venta directa de repuestos
2. Orden de servicio completada

### 5.2 Proceso de Venta Directa
1. Haga clic en "Generar Venta"
2. Seleccione el cliente
3. Agregue los repuestos deseados
4. Confirme la venta

### 5.3 Opciones de Impresión
- Impresión estándar
- Impresión térmica (formato voucher)
- Generación de XML (cumple normativa fiscal)

### 5.4 Gestión de Stock
- El stock se actualiza automáticamente
- Se generan notificaciones de bajo stock (≤ 10 unidades)

## 6. Gestión de Proveedores

### 6.1 Registro de Proveedores
Para agregar un proveedor:
1. Complete el formulario
2. Importante: Nombre, NIT y teléfono deben ser únicos
3. Gestione los días de crédito

### 6.2 Seguimiento de Créditos
- Sistema de notificaciones para créditos próximos a vencer
- Alerta cuando faltan 5 días o menos

## 7. Órdenes de Servicio

### 7.1 Estados de Orden
- Pendiente: Estado inicial al crear
- En proceso: Trabajo iniciado
- Completado: Servicio finalizado y pagado
- Cancelado: Orden anulada, stock retornado

IMPORTANTE: Evite cambiar de Completado a Cancelado. Siga la secuencia:
Pendiente → En proceso → Completado/Cancelado

### 7.2 Creación de Orden
1. Registre servicios y precios
2. Agregue repuestos necesarios
3. Complete detalles financieros
4. Registre información adicional:
   - Casco
   - Documentos
   - Observaciones

### 7.3 Finalización
- Imprima la orden para el mecánico
- Complete el servicio actualizando el estado
- Verifique la generación automática de factura

## 8. Reportes

### 8.1 Cierre de Caja
- Consulta diaria de ingresos
- Desglose por método de pago:
  - Efectivo
  - Tarjeta
  - Transferencia

### 8.2 Generación de Reportes
1. Seleccione rango de fechas
2. Genere reporte CSV
3. Información incluida:
   - Facturas
   - Métodos de pago
   - Subtotales
   - IVA
   - Totales

## 9. Funciones Generales

### 9.1 Acciones en Tablas
Cada registro cuenta con tres opciones:
1. Ver: Consulta detallada de información
2. Editar: Modificación de datos existentes
3. Eliminar: Eliminación permanente del registro

### 9.2 Sistema de Notificaciones
- Ubicación: Campanita en esquina superior derecha
- Actualización: Cada 5 minutos
- Tipos de alertas:
  1. Stock bajo (≤ 10 unidades)
  2. Créditos próximos a vencer (≤ 5 días)


Icono:
<a href="https://iconscout.com/icons/motocicleta" class="text-underline font-size-sm" target="_blank">motocicleta</a> by <a href="https://iconscout.com/es/contributors/triangle-squad/:assets" class="text-underline font-size-sm">Triangle Squad</a> on <a href="https://iconscout.com" class="text-underline font-size-sm">IconScout</a>
