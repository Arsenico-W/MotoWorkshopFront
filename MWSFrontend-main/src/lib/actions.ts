import { number, z } from "zod";
import { fetchWithToken } from "./data";
import {
  Cliente,
  MarcaRepuesto,
  Mecanico,
  MotoCliente,
  MotoMercado,
  Proveedor,
  Repuesto,
  Reserva,
  Servicio,
  User,
} from "./interfaces";
import {
  clienteSchema,
  marcaRepuestoSchema,
  motoClienteSchema,
  motoMercadoSchema,
  proveedorSchema,
  repuestoSchema,
  servicioSchema,
  userSchema,
  mecanicoSchema,
  reservaSchema,
} from "./zodSchemas";
import ReservaForm from "@/app/dashboard/reserva/page";

export async function createCliente(
  values: z.infer<typeof clienteSchema>
): Promise<Cliente> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/clientes`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear el cliente");
  }

  const data = await response.json();
  return data; // Asume que la API retorna el cliente creado
}

export async function updateCliente(
  id: number,
  values: z.infer<typeof clienteSchema>
): Promise<Cliente> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/clientes/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al actualizar el cliente");
  }

  const data = await response.json();
  return data; // Asume que la API retorna el cliente actualizado
}

export async function createMotoMercado(
  values: z.infer<typeof motoMercadoSchema>
): Promise<MotoMercado> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/moto-mercado`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear la moto cliente");
  }

  const data = await response.json();
  return data; // Asume que la API retorna la moto creada
}

export async function updateMotoMercado(
  id: number,
  values: z.infer<typeof motoMercadoSchema>
): Promise<MotoMercado> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/moto-mercado/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al actualizar la moto cliente");
  }

  const data = await response.json();
  return data; // Asume que la API retorna la moto actualizada
}
export async function createMotoCliente(
  values: z.infer<typeof motoClienteSchema>
): Promise<MotoCliente> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/moto-cliente`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear la moto cliente");
  }

  const data = await response.json();
  return data; // Asume que la API retorna la moto creada
}

export async function updateMotoCliente(
  id: number,
  values: z.infer<typeof motoClienteSchema>
): Promise<MotoCliente> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/moto-cliente/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al actualizar la moto cliente");
  }

  const data = await response.json();
  return data; // Asume que la API retorna la moto actualizada
}
export async function createMarcaRepuesto(
  values: z.infer<typeof marcaRepuestoSchema>
): Promise<MarcaRepuesto> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/marca-repuesto/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear la marca");
  }

  const data = await response.json();
  return data; // Asume que la API retorna la moto actualizada
}
export async function updateMarcaRepuesto(
  id: number,
  values: z.infer<typeof marcaRepuestoSchema>
): Promise<MarcaRepuesto> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/marca-repuesto/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al actualizar la marca");
  }

  const data = await response.json();
  return data; // Asume que la API retorna la moto actualizada
}
export async function createRepuesto(
  values: z.infer<typeof repuestoSchema>
): Promise<Repuesto> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/repuesto/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear el repuesto");
  }

  const data = await response.json();
  return data; // Asume que la API retorna la moto actualizada
}
export async function updateRepuesto(
  id: number,
  values: z.infer<typeof repuestoSchema>
): Promise<Repuesto> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/repuesto/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al actualizar el repuesto");
  }

  const data = await response.json();
  return data;
}

export async function createProveedor(values: any): Promise<undefined> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/proveedor/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear el proveedor");
  }

  const data = await response.json();
  return data;
}

export async function updateProveedor(
  id: number,
  values: any
): Promise<undefined> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/proveedor/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al actualizar el proveedor");
  }

  const data = await response.json();
  return data;
}

export async function createServicio(
  values: z.infer<typeof servicioSchema>
): Promise<Servicio> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/servicio`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear el servicio");
  }

  const data = await response.json();
  return data;
}

export async function updateServicio(
  id: number,
  values: z.infer<typeof servicioSchema>
): Promise<Servicio> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/servicio/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al actualizar el servicio");
  }

  const data = await response.json();
  return data;
}

export async function createUser(
  values: z.infer<typeof userSchema>
): Promise<User> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear el usuario");
  }

  const data = await response.json();
  return data;
}

export async function updateUser(
  id: number,
  values: z.infer<typeof userSchema>
): Promise<User> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al actualizar el usuario");
  }

  const data = await response.json();
  return data;
}

export async function createMecanico(
  values: z.infer<typeof mecanicoSchema>
): Promise<Mecanico> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/mecanico`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear el mecanico");
  }

  const data = await response.json();
  return data; 
}

export async function updateMecanico(
  id: number,
  values: z.infer<typeof mecanicoSchema>
): Promise<Mecanico> {
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/mecanico/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al actualizar el mecanico");
  }

  const data = await response.json();
  return data;
}

export async function createReserva(
  values: z.infer<typeof reservaSchema>
): Promise<Reserva> {

  const dataReserva = {
    id_cliente: Number(values.id_cliente),
    id_servicio: values.id_servicio ? Number(values.id_servicio) : null,
    fecha_reserva: new Date(values.fecha_reserva),
  }
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/reservas`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataReserva),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear la reserva");
  }

  const data = await response.json();
  return data; 
}

export async function updateReserva(
  id: number,
  values: z.infer<typeof reservaSchema>
): Promise<Reserva> {
  const dataReserva = {
    id_cliente: Number(values.id_cliente),
    id_servicio: values.id_servicio ? Number(values.id_servicio) : null,
    fecha_reserva: new Date(values.fecha_reserva),
  }
  const response = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_API_URL}/reservas/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataReserva),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al actualizar la reserva");
  }

  const data = await response.json();
  return data;
}

