import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma'; // Asegúrate de tener configurado prisma en tu proyecto

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    const { userId, imageUrl } = req.body;

    try {
      const user = await prisma.usuario.update({
        where: { idusuario: userId },
        data: { imagen: imageUrl }
      });

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Error updating user image' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
