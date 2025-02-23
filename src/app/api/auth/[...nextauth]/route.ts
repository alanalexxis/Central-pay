import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import db from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Correo', type: 'text', placeholder: 'jsmith' },
        password: {
          label: 'Contrasena',
          type: 'password',
          placeholder: '*****'
        }
      },
      async authorize(credentials, req) {
        const userFound = await db.usuario.findUnique({
          where: { correo: credentials.correo }
        });

        if (!userFound)
          throw new Error(
            'No pudimos encontrar tu cuenta. Revisa tu correo o contraseña.'
          );

        const matchPassword = await bcrypt.compare(
          credentials.contrasena,
          userFound.contrasena
        );
        if (!matchPassword)
          throw new Error('Contraseña incorrecta. Inténtalo de nuevo.');

        return {
          id: userFound.idusuario,
          nombre: userFound.nombre,
          correo: userFound.correo,
          name: userFound.nombre,
          email: userFound.correo,
          image: userFound.imagen
        };
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      // Almacena la información del usuario en el JWT
      if (user) {
        token.id = user.id; // Asegúrate de que 'id' se esté almacenando correctamente
      }
      return token;
    },
    async session({ session, token }) {
      // Asegúrate de que 'id' se esté pasando correctamente a la sesión
      if (token.id) {
        session.user.id = token.id;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
