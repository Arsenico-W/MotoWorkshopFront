import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sendServicioCompletadoEmail } from '@/lib/mailService';

export async function POST(request: NextRequest) {
  try {
    const {
      emailCliente,
      nombreCliente,
      servicio,
      placaMoto,
      precio
    } = await request.json();

    await sendServicioCompletadoEmail({
      to: emailCliente,
      cliente: nombreCliente,
      servicio,
      placaMoto,
      precio,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error en /api/send-email:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
