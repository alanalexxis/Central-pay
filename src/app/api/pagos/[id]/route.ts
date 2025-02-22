import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  console.log(params.id);
  try {
    const pago = await prisma.pago.findFirst({
      where: {
        idpago: Number(params.id)
      }
    });

    if (!pago)
      return NextResponse.json(
        { message: 'Pago no encontrado' },
        { status: 404 }
      );

    return NextResponse.json(pago);
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

export async function DELETE(request: Request, { params }: Params) {
  try {
    const deletedPago = await prisma.pago.delete({
      where: {
        idpago: Number(params.id)
      }
    });
    if (!deletedPago)
      return NextResponse.json(
        { message: 'Pago no encontrado' },
        { status: 404 }
      );

    return NextResponse.json(deletedPago);
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            message: 'Pago no encontrado'
          },
          {
            status: 404
          }
        );
      }

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

export async function PUT(request: Request, { params }: Params) {
  try {
    const { idalumno, nota_venta } = await request.json();

    const updatedPago = await prisma.pago.update({
      where: {
        idpago: Number(params.id)
      },
      data: {
        idalumno,
        nota_venta
      }
    });

    return NextResponse.json(updatedPago);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            message: 'Pago no encontrado'
          },
          {
            status: 404
          }
        );
      }

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
