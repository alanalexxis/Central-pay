import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { Prisma } from '@prisma/client';

interface Params {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { imagen, tipoImagen } = await request.json();

    // Extraer la extensión del archivo a partir del tipo MIME
    const extension = tipoImagen.split('/')[1]; // 'image/png' -> 'png'

    // Convertir la imagen de base64 a archivo
    const base64Data = imagen.replace(/^data:image\/[a-z]+;base64,/, ''); // eliminar el encabezado base64
    const filePath = path.join(
      process.cwd(),
      'public',
      'images',
      `${params.id}.${extension}` // Usar la extensión original
    );

    // Asegurarse de que el directorio exista
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Guardar la imagen como archivo
    fs.writeFileSync(filePath, base64Data, 'base64');

    // Actualizar la imagen en la base de datos
    const updatedUsuario = await prisma.usuario.update({
      where: {
        idusuario: Number(params.id)
      },
      data: {
        imagen: `/images/${params.id}.${extension}` // Guardar la ruta pública de la imagen
      }
    });

    return NextResponse.json(updatedUsuario);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { message: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
