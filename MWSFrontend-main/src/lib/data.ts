// data.ts
"use client"; // Si es necesario, dependiendo de tu uso

import {
  Cliente,
  Factura,
  MarcaRepuesto,
  MotoCliente,
  MotoMercado,
  OrdenServicio,
  Proveedor,
  Repuesto,
  Servicio,
  VentaDirecta,
  Mecanico,
  MecanicoDetalle,
  Notificaciones,
  Reserva,
  serviciodetalle,
} from "./interfaces";

// Función para obtener el valor de una cookie por su nombre
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export async function fetchWithToken(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getCookie("token"); // Obtener el token desde las cookies

  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : "",
  };

  return fetch(url, {
    ...options,
    headers, // Se agregan los headers con el token automáticamente
  });
}

export async function fetchClientesPages(
  query: string,
  limit: number
): Promise<number> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/clientes?search=${query}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching clientes pages");
  }

  const data = await response.json();
  return data.totalPages;
}

export async function fetchFilteredClientes(
  query: string,
  currentPage: number,
  limit: number
): Promise<Cliente[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/clientes?search=${query}&page=${currentPage}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching clientes");
  }

  const data = await response.json();
  return data.clientes;
}
export async function fetchOneCliente(id: number): Promise<Cliente[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/clientes/${id}`
  );

  if (!response.ok) {
    throw new Error("Error fetching cliente");
  }

  const data = await response.json();
  return data;
}

export async function fetchMotosClientesPages(
  query: string,
  limit: number
): Promise<number> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/moto-cliente?search=${query}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching motos clientes pages");
  }

  const data = await response.json();
  return data.totalPages;
}

export async function fetchFilteredMotosClientes(
  query: string,
  currentPage: number,
  limit: number
): Promise<MotoCliente[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/moto-cliente?search=${query}&page=${currentPage}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching motos clientes");
  }

  const data = await response.json();
  return data.motosCliente;
}

export async function fetchOneMotoCliente(id: number): Promise<MotoCliente[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/moto-cliente/${id}`
  );

  if (!response.ok) {
    throw new Error("Error fetching moto del cliente");
  }

  const data = await response.json();
  return data;
}

export async function fetchOrdenServicioPages(
  query: string,
  limit: number
): Promise<number> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/orden-servicio?search=${query}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching orden servicio pages");
  }

  const data = await response.json();
  return data.totalPages;
}

export async function fetchFilteredOrdenes(
  query: string,
  currentPage: number,
  limit: number
): Promise<OrdenServicio[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/orden-servicio?search=${query}&page=${currentPage}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Error fetching ordenes de servicio");
  }

  const data = await response.json();

  return data.ordenesServicio;
}
export async function fetchOneOrdenServicio(
  id: number
): Promise<OrdenServicio[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/orden-servicio/${id}`
  );

  if (!response.ok) {
    throw new Error("Error fetching orden");
  }

  const data = await response.json();

  return data;
}

export async function fetchProveedoresPages(
  query: string,
  limit: number
): Promise<number> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/proveedor?search=${query}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching proveedor pages");
  }

  const data = await response.json();
  return data.totalPages;
}

export async function fetchFilteredProveedores(
  query: string,
  currentPage: number,
  limit: number
): Promise<Proveedor[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/proveedor?search=${query}&page=${currentPage}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching proveedores");
  }

  const data = await response.json();

  return data.proveedores;
}
export async function fetchAllProveedores(): Promise<Proveedor[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/proveedor`
  );

  if (!response.ok) {
    throw new Error("Error fetching facturas");
  }

  const data = await response.json();
  return data.proveedores;
}
export async function fetchOneProveedor(id: number): Promise<Proveedor[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/proveedor/${id}`
  );

  if (!response.ok) {
    throw new Error("Error fetching proveedor");
  }

  const data = await response.json();

  return data;
}

export async function fetchRepuestosPages(
  query: string,
  limit: number
): Promise<number> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/repuesto?search=${query}&limit=${limit}`
  );

  if (!response.ok) {
    const error = await response.json();
    console.log("error ", error);
    throw new Error("Error fetching repuestos pages");
  }

  const data = await response.json();
  return data.totalPages;
}

export async function fetchFilteredRepuestos(
  query: string,
  currentPage: number,
  limit: number
): Promise<Repuesto[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/repuesto?search=${query}&page=${currentPage}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching repuestos");
  }

  const data = await response.json();

  return data.repuestos;
}
export async function fetchAllRepuestos(): Promise<Repuesto[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/repuesto`
  );

  if (!response.ok) {
    throw new Error("Error fetching facturas");
  }

  const data = await response.json();
  return data.repuestos;
}

export async function fetchOneRepuesto(id: number): Promise<Repuesto[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/repuesto/${id}`
  );

  if (!response.ok) {
    throw new Error("Error fetching repuestos");
  }

  const data = await response.json();

  return data;
}

export async function fetchMotosRepuestosPages(
  query: string,
  limit: number
): Promise<number> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/moto-mercado?search=${query}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching motos repuestos pages");
  }

  const data = await response.json();
  return data.totalPages;
}

export async function fetchFilteredMotosRepuestos(
  query: string,
  currentPage: number,
  limit: number
): Promise<MotoMercado[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/moto-mercado?search=${query}&page=${currentPage}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching motos");
  }

  const data = await response.json();
  return data.motos;
}

export async function fetchOneMotoRepuesto(id: number): Promise<MotoMercado[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/moto-mercado/${id}`
  );

  if (!response.ok) {
    throw new Error("Error fetching moto");
  }

  const data = await response.json();
  return data;
}

export async function fetchMarcasPages(
  query: string,
  limit: number
): Promise<number> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/marca-repuesto?search=${query}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching marcas repuestos pages");
  }

  const data = await response.json();
  return data.totalPages;
}

export async function fetchFilteredMarcasRepuestos(
  query: string,
  currentPage: number,
  limit: number
): Promise<MarcaRepuesto[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/marca-repuesto?search=${query}&page=${currentPage}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching marcas");
  }

  const data = await response.json();

  return data.marcas;
}

export async function fetchOneMarcaRepuesto(
  id: number
): Promise<MarcaRepuesto[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/marca-repuesto/${id}`
  );

  if (!response.ok) {
    throw new Error("Error fetching marca");
  }

  const data = await response.json();
  return data;
}

export async function fetchFacturasPages(
  query: string,
  limit: number
): Promise<number> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/factura?search=${query}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching facturas pages");
  }

  const data = await response.json();
  return data.totalPages;
}

export async function fetchFilteredFacturas(
  query: string,
  currentPage: number,
  limit: number
): Promise<Factura[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/factura?search=${query}&page=${currentPage}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching facturas");
  }

  const data = await response.json();
  return data.facturas;
}

export async function fetchAllFacturas(): Promise<Factura[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/factura`
  );

  if (!response.ok) {
    throw new Error("Error fetching facturas");
  }

  const data = await response.json();
  return data.facturas;
}

export async function fetchOneFactura(id: number): Promise<Factura[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/factura/${id}`
  );

  if (!response.ok) {
    throw new Error("Error fetching factura");
  }

  const data = await response.json();
  return data;
}

export async function fetchVentasPages(
  query: string,
  limit: number
): Promise<number> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/venta-directa?search=${query}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching facturas pages");
  }
  const data = await response.json();
  return data.totalPages;
}

export async function fetchFilteredVentas(
  query: string,
  currentPage: number,
  limit: number
): Promise<VentaDirecta[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/venta-directa?search=${query}&page=${currentPage}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching ventas");
  }

  const data = await response.json();
  return data.ventasDirectas;
}

export async function fetchOneVenta(id: number): Promise<VentaDirecta[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/venta-directa/${id}`
  );

  if (!response.ok) {
    throw new Error("Error fetching factura");
  }

  const data = await response.json();
  return data;
}

export async function fetchServiciosPages(
  query: string,
  limit: number
): Promise<number> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/servicio?search=${query}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching servicios pages");
  }
  const data = await response.json();
  return data.totalPages;
}

export async function fetchFilteredServicios(
  query: string,
  currentPage: number,
  limit: number
): Promise<Servicio[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/servicio?search=${query}&page=${currentPage}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching servicios");
  }

  const data = await response.json();
  return data.servicios;
}

export async function fetchOneServicio(id: number): Promise<Servicio[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/servicio/${id}`
  );

  if (!response.ok) {
    throw new Error("Error fetching factura");
  }

  const data = await response.json();
  return data;
}

export async function fetchUsuariosPages(
  query: string,
  limit: number
): Promise<number> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/users?search=${query}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching servicios pages");
  }
  const data = await response.json();
  return data.totalPages;
}

export async function fetchFilteredUsuarios(
  query: string,
  currentPage: number,
  limit: number
) {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/users?search=${query}&page=${currentPage}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Error fetching servicios");
  }

  const data = await response.json();
  return data.users;
}

export async function fetchOneUsuario(id: number) {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`
  );

  if (!response.ok) {
    throw new Error("Error fetching factura");
  }

  const data = await response.json();
  return data;
}

export async function fetchMecanicosPages(
  query: string,
  limit: number
): Promise<number> {

  const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/mecanico?search=${encodeURIComponent(query)}&limit=${limit}`)

  if (!response.ok) {
    throw new Error('Error fetching mecanicos pages')
  }

  const data = await response.json()
  return data.totalPages
}

export async function fetchFilteredMecanicos(
  query: string,
  currentPage: number,
  limit: number
): Promise<Mecanico[]> {
  const response = await 
  fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/mecanico?search=${encodeURIComponent(query)}&page=${currentPage}&limit=${limit}`)

  if (!response.ok) {
    throw new Error('Error fetching mecanicos')
  }

  const data = await response.json()
  return data.data ?? []
}

export async function fetchOneMecanico(id: number): Promise<Mecanico> {
  const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/mecanico/${id}`)

  if (!response.ok) {
    throw new Error('Error fetching mecanico')
  }

  const data = await response.json()

  console.log('Respuesta cruda de la API:', data)//borrar

if (typeof data !== 'object' || data === null || Array.isArray(data)) {
  throw new Error(`Respuesta inválida del backend: ${JSON.stringify(data)}`)
}

  return data
}

export async function fetchReservasPages(
  query: string,
  limit: number
): Promise<number> {
  const response = await 
  fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reservas?search=${encodeURIComponent(query)}&limit=${limit}`)

  if (!response.ok) {
    throw new Error('Error fetching reservas pages')
  }

  const data = await response.json()
  return data.totalPages
}

export async function fetchFilteredReservas(
  query: string,
  currentPage: number,
  limit: number
): Promise<Reserva[]> {
  const response = await 
  fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reservas?search=${encodeURIComponent(query)}&page=${currentPage}&limit=${limit}`)


  if (!response.ok) {
    throw new Error('Error fetching reservas')
  }

  const data = await response.json()
  return data.data ?? []
}

export async function fetchOneReserva(id: number): Promise<Reserva> {

  const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/reservas/${id}`)

  if (!response.ok) {
    throw new Error('Error fetching reserva')
  }

  const data = await response.json()
  return data
}

export async function fetchAllReservas(): Promise<Reserva[]> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/reservas`
  );

  if (!response.ok) {
    throw new Error("Error fetching reservas");
  }

  const data = await response.json();
  return data.data;
}
