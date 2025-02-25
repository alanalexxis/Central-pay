'use server';

import { prisma } from '@/lib/prisma';

export interface Alumno {
  idalumno: number;
  nombre: string;
  telefono: string;
  fecha_nacimiento: string;
  sede: string;
}

export async function searchUsers(query?: string): Promise<Alumno[]> {
  // If there's a search query, filter the alumnos
  if (query) {
    const lowercaseQuery = query.toLowerCase();
    const alumnos = await prisma.alumno.findMany({
      where: {
        nombre: {
          contains: lowercaseQuery
        }
      },
      take: 10
    });
    return alumnos;
  }

  // Return first 10 alumnos if no query
  const alumnos = await prisma.alumno.findMany({
    take: 10
  });
  return alumnos;
}

export async function searchAllUsers(): Promise<Alumno[]> {
  const alumnos = await prisma.alumno.findMany({
    take: 200
  });
  return alumnos;
}
