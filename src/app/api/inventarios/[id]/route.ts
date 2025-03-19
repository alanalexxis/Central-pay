import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  console.log(params.id);
  try {
    const inventario = await prisma.inventario.findFirst({
      where: {
        idinventario: Number(params.id)
      }
    });

    if (!inventario)
      return NextResponse.json(
        { message: 'Inventario no encontrado' },
        { status: 404 }
      );

    return NextResponse.json(inventario);
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
    const deletedInventario = await prisma.inventario.delete({
      where: {
        idinventario: Number(params.id)
      }
    });
    if (!deletedInventario)
      return NextResponse.json(
        { message: 'Inventario no encontrado' },
        { status: 404 }
      );

    return NextResponse.json(deletedInventario);
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            message: 'Inventario no encontrado'
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
    const { nombre, detalles, estado } = await request.json();

    const updatedInventario = await prisma.inventario.update({
      where: {
        idinventario: Number(params.id)
      },
      data: {
        nombre,
        detalles,
        estado
      }
    });

    return NextResponse.json(updatedInventario);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            message: 'Inventario no encontrado'
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
