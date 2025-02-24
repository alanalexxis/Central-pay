import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { nombre, correo } = await request.json();

    // Verificar si el correo ya está en uso por otro usuario
    const userFound = await prisma.usuario.findUnique({
      where: {
        correo: correo
      }
    });

    if (userFound && userFound.idusuario !== Number(params.id)) {
      return NextResponse.json(
        {
          message: 'El correo ya existe'
        },
        {
          status: 400
        }
      );
    }

    const updatedUsuario = await prisma.usuario.update({
      where: {
        idusuario: Number(params.id)
      },
      data: {
        nombre,
        correo
      }
    });

    return NextResponse.json(updatedUsuario);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            message: 'Usuario no encontrado'
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
