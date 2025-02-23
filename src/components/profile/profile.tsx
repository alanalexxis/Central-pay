'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useDropzone } from 'react-dropzone';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useProfileImageStore } from '@/store/image-store';

export default function Component() {
  const { data: session } = useSession();
  const { profileImage, setProfileImage } = useProfileImageStore();
  const [name, setName] = useState(session?.user?.name ?? '');
  const [email, setEmail] = useState(session?.user?.email ?? '');
  const [password, setPassword] = useState('');

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const result = e.target?.result as string;
          setProfileImage(result);

          const fileType = file.type;

          const response = await fetch(
            `/api/image-upload/${session?.user.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                imagen: result,
                tipoImagen: fileType
              })
            }
          );

          if (response.ok) {
            toast.success('Imagen de perfil actualizada con éxito');
          } else {
            toast.error('Error al actualizar la imagen de perfil');
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [session, setProfileImage, name, email, password]
  );

  const handleSave = async () => {
    const response = await fetch(`/api/usuarios/${session?.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: name
      })
    });

    if (response.ok) {
      toast.success('Información actualizada con éxito');
    } else {
      toast.error('Error al actualizar la información');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  if (session) {
    return (
      <div className='space-y-6 px-4 md:px-6'>
        <header className='space-y-1.5'>
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <Avatar className='h-24 w-24 cursor-pointer' {...getRootProps()}>
                <AvatarImage
                  src={(profileImage || session.user?.image) ?? ''}
                  alt={session?.user?.name ?? ''}
                />
                <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                <input {...getInputProps()} />
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity hover:opacity-100'>
                  <Camera className='h-8 w-8 text-white' />
                </div>
              </Avatar>
            </div>
            <div className='space-y-1.5'>
              <h1 className='text-2xl font-bold'>
                {session?.user?.name ?? ''}
              </h1>
              <p className='text-gray-500 dark:text-gray-400'>Administrador</p>
            </div>
          </div>
        </header>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <h2 className='text-lg font-semibold'>Información personal</h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <Label htmlFor='name'>Nombre</Label>
                <Input
                  id='name'
                  placeholder='Ingresa tu nombre'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor='email'>Correo</Label>
                <Input
                  id='email'
                  placeholder='Ingresa tu correo'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
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
          <div className='space-y-2'>
            <h2 className='text-lg font-semibold'>Cambiar contraseña</h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <Label htmlFor='current-password'>Contraseña actual</Label>
                <Input
                  id='current-password'
                  placeholder='Ingresa tu contraseña actual'
                  type='password'
                />
              </div>
              <div>
                <Label htmlFor='new-password'>Nueva contraseña</Label>
                <Input
                  id='new-password'
                  placeholder='Ingresa tu nueva contraseña'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor='confirm-password'>Confirmar contraseña</Label>
                <Input
                  id='confirm-password'
                  placeholder='Confirma tu nueva contraseña'
                  type='password'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='mt-8'>
          <Button size='lg' onClick={handleSave}>
            Guardar
          </Button>
        </div>
      </div>
    );
  }
}
