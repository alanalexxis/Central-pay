'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useDropzone } from 'react-dropzone';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useProfileStore } from '@/store/image-store';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.'
  })
});

export default function ProfileForm() {
  const { data: session } = useSession();
  const { profileImage, setProfileImage, name, setName, email, setEmail } =
    useProfileStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: ''
    }
  });

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem('profile') || '{}');

    if (session) {
      if (!storedProfile.name) {
        const userProfile = {
          name: session.user?.name || '',
          email: session.user?.email || '',
          profileImage: session.user?.image || ''
        };
        localStorage.setItem('profile', JSON.stringify(userProfile));

        setName(userProfile.name);
        setEmail(userProfile.email);
        setProfileImage(userProfile.profileImage);
        form.setValue('name', userProfile.name);
        form.setValue('email', userProfile.email);
      } else {
        setName(storedProfile.name);
        setEmail(storedProfile.email);
        setProfileImage(storedProfile.profileImage);
        form.setValue('name', storedProfile.name);
        form.setValue('email', storedProfile.email);
      }
    }
  }, [session, setName, setEmail, setProfileImage, form]);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const result = e.target?.result as string;
          setProfileImage(result);

          const response = await fetch(
            `/api/image-upload/${session?.user.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                imagen: result,
                tipoImagen: file.type
              })
            }
          );

          if (response.ok) {
            toast.success('Imagen de perfil actualizada con éxito');
            const updatedProfile = { name, email, profileImage: result };
            localStorage.setItem('profile', JSON.stringify(updatedProfile));
          } else {
            toast.error('Error al actualizar la imagen de perfil');
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [session, setProfileImage, name, email]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetch(`/api/usuarios/${session?.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre: values.name, correo: values.email })
    });

    if (response.ok) {
      toast.success('Información actualizada con éxito');
      const updatedProfile = {
        name: values.name,
        email: values.email,
        profileImage
      };
      localStorage.setItem('profile', JSON.stringify(updatedProfile));
      setName(values.name);
      setEmail(values.email);
    } else {
      toast.error('Error al actualizar la información');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6 px-4 md:px-6'
      >
        <header className='space-y-1.5'>
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <Avatar className='h-24 w-24 cursor-pointer' {...getRootProps()}>
                <AvatarImage src={profileImage || ''} alt={name} />
                <AvatarFallback>{name?.[0]}</AvatarFallback>
                <input {...getInputProps()} />
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity hover:opacity-100'>
                  <Camera className='h-8 w-8 text-white' />
                </div>
              </Avatar>
            </div>
            <div className='space-y-1.5'>
              <h1 className='text-2xl font-bold'>{name}</h1>
              <p className='text-gray-500 dark:text-gray-400'>Administrador</p>
            </div>
          </div>
        </header>

        <div className='space-y-6'>
          <div className='space-y-2'>
            <h2 className='text-lg font-semibold'>Información personal</h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder='Ingresa tu nombre' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ingresa tu correo'
                        type='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Label htmlFor='phone'>Teléfono</Label>
                <Input
                  id='phone'
                  placeholder='Ingresa tu teléfono'
                  type='tel'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='mt-8'>
          <Button type='submit' size='lg'>
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
}
