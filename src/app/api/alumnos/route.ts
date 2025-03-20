import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const alumnos = await prisma.alumno.findMany();
    return NextResponse.json(alumnos);
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

    const nuevoAlumno = await prisma.alumno.create({
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

    return NextResponse.json(nuevoAlumno);
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
