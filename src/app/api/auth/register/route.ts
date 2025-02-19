import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/prisma';

export async function POST(request: { json: () => any }) {
  try {
    const data = await request.json();
    const userFound = await db.usuario.findUnique({
      where: {
        correo: data.correo
      }
    });

    if (userFound) {
      return NextResponse.json(
        {
          message: 'El correo ya existe'
        },
        {
          status: 400
        }
      );
    }
    console.log(data);
    const hashedPassword = await bcrypt.hash(data.contrasena, 10);
    const newUser = await db.usuario.create({
      data: {
        nombre: data.nombre,
        correo: data.correo,
        contrasena: hashedPassword
      }
    });
    const { contrasena: _, ...user } = newUser;
    return NextResponse.json(user);
  } catch (error) {
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
