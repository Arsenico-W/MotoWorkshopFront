// src/hooks/useEmail.ts
import { useState, useCallback } from 'react';

export interface SendEmailParams {
  emailCliente: string;
  nombreCliente: string;
  servicio: string;
  placaMoto: string;
  precio: number | string;
}

export function useEmail() {
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const sendEmail = useCallback(async (params: SendEmailParams) => {
    setIsSending(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailCliente: params.emailCliente,
          nombreCliente: params.nombreCliente,
          servicio: params.servicio,
          placaMoto: params.placaMoto,
          precio: params.precio,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error || 'Error enviando correo');
      }

      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSending(false);
    }
  }, []);

  return {
    sendEmail,
    isSending,
    success,
    error,
  };
}
