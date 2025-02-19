import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Correo", type: "text", placeholder: "jsmith" },
        password: {
          label: "Contrasena",
          type: "password",
          placeholder: "*****",
        },
      },
      async authorize(credentials, req) {
        console.log(credentials);

        const userFound = await db.usuario.findUnique({
          where: {
            correo: credentials.correo,
          },
        });

        if (!userFound)
          throw new Error(
            "No pudimos encontrar tu cuenta. Revisa tu correo o contraseña."
          );

        console.log(userFound);

        const matchPassword = await bcrypt.compare(
          credentials.contrasena,
          userFound.contrasena
        );

        if (!matchPassword)
          throw new Error("Contraseña incorrecta. Inténtalo de nuevo.");

        return {
          id: userFound.idusuario,
          nombre: userFound.nombre,
          correo: userFound.correo,
          name: userFound.nombre, // Cambia 'nombre' a 'name'
          email: userFound.correo, // Cambia 'correo' a 'email'
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
