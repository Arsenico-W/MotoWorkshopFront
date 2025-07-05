import nodemailer from 'nodemailer';
import { servicioCompletadoTemplate, ServicioCompletadoData } from './emailTemplates';

export interface SendEmailOptions extends ServicioCompletadoData {
  to: string;
  subject?: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendServicioCompletadoEmail(options: SendEmailOptions) {
  const { to, cliente, servicio, placaMoto, precio, subject } = options;
  const html = servicioCompletadoTemplate({ cliente, servicio, placaMoto, precio });

  return transporter.sendMail({
    from: `"MotoWorkshop" <${process.env.SMTP_USER}>`,
    to,
    subject: subject ?? 'Tu servicio ha sido completado ✅',
    html,
  });
}
