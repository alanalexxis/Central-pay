import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  console.log(params.id);
  try {
    const alumno = await prisma.alumno.findFirst({
      where: {
        idalumno: Number(params.id)
      }
    });

    if (!alumno)
      return NextResponse.json(
        { message: 'Alumno no encontrado' },
        { status: 404 }
      );

    return NextResponse.json(alumno);
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
    const deletedAlumno = await prisma.alumno.delete({
      where: {
        idalumno: Number(params.id)
      }
    });
    if (!deletedAlumno)
      return NextResponse.json(
        { message: 'Alumno no encontrado' },
        { status: 404 }
      );

    return NextResponse.json(deletedAlumno);
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            message: 'Alumno no encontrado'
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
    const {
      nombre,
      telefono,
      fecha_nacimiento,
      sede,
      sexo,
      domicilio,
      barrio,
      tutor,
      escolaridad
    } = await request.json();

    const updatedAlumno = await prisma.alumno.update({
      where: {
        idalumno: Number(params.id)
      },
      data: {
        nombre,
        telefono,
        fecha_nacimiento,
        sede,
        sexo,
        domicilio,
        barrio,
        tutor,
        escolaridad
      }
    });

    return NextResponse.json(updatedAlumno);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            message: 'Alumno no encontrado'
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
