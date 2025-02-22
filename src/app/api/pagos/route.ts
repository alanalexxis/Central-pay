import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const pagos = await prisma.pago.findMany({
      include: {
        alumno: true // Incluye todos los campos del modelo 'alumno' relacionados con 'pago'
      }
    });
    return NextResponse.json(pagos);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message
        },
        {
          status: 500
        }
      );
    }
  }
}

export async function POST(request: Request) {
  try {
    const { idalumno } = await request.json();

    // Obtener la última nota de venta
    const ultimoPago = await prisma.pago.findFirst({
      orderBy: {
        nota_venta: 'desc'
      }
    });

    // Generar la nueva nota de venta
    const ultimoNumero = ultimoPago
      ? parseInt(ultimoPago.nota_venta.split('-Y')[1])
      : 0;
    const nuevoNumero = (ultimoNumero + 1).toString().padStart(3, '0');
    const nuevaNotaVenta = `2025A-Y${nuevoNumero}`;

    // Crear el pago y obtener los datos del alumno relacionado
    const nuevoPago = await prisma.pago.create({
      data: {
        idalumno,
        nota_venta: nuevaNotaVenta
      },
      include: {
        alumno: true // Incluye los datos del alumno (suponiendo que hay una relación entre 'pago' y 'alumno')
      }
    });

    // Retorna el pago junto con el nombre del alumno
    return NextResponse.json({
      ...nuevoPago,
      alumno: {
        nombre: nuevoPago.alumno.nombre // Asumiendo que 'nombre' es el campo del alumno
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message
        },
        {
          status: 500
        }
      );
    }
  }
}
