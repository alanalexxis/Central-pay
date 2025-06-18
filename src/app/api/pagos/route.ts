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
    const { idalumno, tipo_pago, fecha_pago, fecha_inicio } =
      await request.json();

    // Obtener el año actual dinámicamente
    const year = new Date().getFullYear();

    // Obtener los datos del alumno
    const alumno = await prisma.alumno.findUnique({
      where: { idalumno }
    });

    if (!alumno) {
      return NextResponse.json(
        {
          message: 'Alumno no encontrado'
        },
        {
          status: 404
        }
      );
    }

    // Determinar la sede
    const sedeInicial = alumno.sede === 'Yajalón' ? 'Y' : 'T';

    // Obtener la última nota de venta de la sede correspondiente
    const ultimoPago = await prisma.pago.findFirst({
      where: {
        nota_venta: {
          startsWith: `${year}A-${sedeInicial}`
        }
      },
      orderBy: {
        nota_venta: 'desc'
      }
    });

    // Generar la nueva nota de venta
    const ultimoNumero = ultimoPago
      ? parseInt(ultimoPago.nota_venta.split('-')[1].substring(1))
      : 0;
    const nuevoNumero = (ultimoNumero + 1).toString().padStart(3, '0');
    const nuevaNotaVenta = `${year}A-${sedeInicial}${nuevoNumero}`;

    // Crear el pago y obtener los datos del alumno relacionado
    const nuevoPago = await prisma.pago.create({
      data: {
        idalumno,
        nota_venta: nuevaNotaVenta,
        tipo_pago,
        fecha_pago,
        fecha_inicio
      },
      include: {
        alumno: true // Incluye los datos del alumno
      }
    });

    // Retorna el pago junto con el nombre del alumno
    return NextResponse.json({
      ...nuevoPago,
      alumno: {
        nombre: nuevoPago.alumno.nombre
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
