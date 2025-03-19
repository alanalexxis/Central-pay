import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const inventarios = await prisma.inventario.findMany();
    return NextResponse.json(inventarios);
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
    const { nombre, detalles, estado } = await request.json();

    const nuevoInventario = await prisma.inventario.create({
      data: {
        nombre,
        detalles,
        estado
      }
    });

    return NextResponse.json(nuevoInventario);
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
