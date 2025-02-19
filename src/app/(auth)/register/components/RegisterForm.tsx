import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    if (data.contrasena !== data.confirmContrasena) {
      return alert("Las contraseñas no coinciden");
    }
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        nombre: data.nombre,
        correo: data.correo,
        contrasena: data.contrasena,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resJSON = await res.json();
    console.log(resJSON);
  });
  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Registrarse</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Ingrese su información para crear una cuenta
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            type="text"
            placeholder="Juan Pérez"
            {...register("nombre", {
              required: {
                value: true,
                message: "Este campo es requerido",
              },
            })}
          />
          {errors.nombre && (
            <span className="text-red-500 text-xs">
              {errors.nombre.message as string}
            </span>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="correo">Correo</Label>
          <Input
            id="correo"
            type="email"
            placeholder="m@example.com"
            {...register("correo", {
              required: {
                value: true,
                message: "Este campo es requerido",
              },
            })}
          />
          {errors.correo && (
            <span className="text-red-500 text-xs">
              {errors.correo.message as string}
            </span>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            {...register("contrasena", {
              required: {
                value: true,
                message: "Este campo es requerido",
              },
            })}
          />
          {errors.contrasena && (
            <span className="text-red-500 text-xs">
              {errors.contrasena.message as string}
            </span>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="ConfirmPassword">Confirmar contraseña</Label>
          </div>
          <Input
            id="ConfirmContrasena"
            type="password"
            {...register("confirmContrasena", {
              required: {
                value: true,
                message: "Este campo es requerido",
              },
            })}
          />
          {errors.confirmContrasena && (
            <span className="text-red-500 text-xs">
              {errors.confirmContrasena.message as string}
            </span>
          )}
        </div>
        <Button type="submit" className="w-full">
          Crear cuenta
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground"></span>
        </div>
      </div>
      <div className="text-center text-sm">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Iniciar sesión
        </Link>
      </div>
    </form>
  );
}
