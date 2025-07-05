export interface ServicioCompletadoData {
  cliente: string;
  servicio: string;
  placaMoto: string;
  precio: number | string;
}

const baseWrapper = (bodyHtml: string) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Servicio completado</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <table style="max-width: 600px; margin: auto; background-color: #ffffff;
                padding: 20px; border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    ${bodyHtml}
  </table>
</body>
</html>`;

function servicioCompletadoBody(data: ServicioCompletadoData): string {
  const { cliente, servicio, placaMoto, precio } = data;
  return `
    <tr>
      <td style="text-align: center;">
        <h2 style="color: #2c3e50;">Servicio Completado</h2>
      </td>
    </tr>
    <tr>
      <td>
        <p>Hola ${cliente},</p>
        <p>Te informamos que el <strong>servicio ${servicio}</strong> para tu motocicleta
          con número de placa <strong>${placaMoto}</strong> ha sido completado exitosamente.</p>
        <p>El valor total del servicio fue de <strong>$${precio}</strong>.</p>
        <p>Gracias por confiar en nosotros.</p>
        <p>Saludos,<br><strong>Moto Workshop</strong></p>
      </td>
    </tr>`;
}

export function servicioCompletadoTemplate(data: ServicioCompletadoData): string {
  const body = servicioCompletadoBody(data);
  return baseWrapper(body);
}
