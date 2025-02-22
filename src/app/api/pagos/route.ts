import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const pagos = await prisma.pago.findMany();
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
    const { idalumno, nota_venta } = await request.json();

    const nuevoPago = await prisma.pago.create({
      data: {
        idalumno,
        nota_venta
      }
    });

    return NextResponse.json(nuevoPago);
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
