'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MyFormData } from '@/../types/table';

const formSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().nonempty('El campo nombre no puede estar vacío'),
  telefono: z.string().nonempty('El campo teléfono no puede estar vacío'),
  fecha_nacimiento: z
    .string()
    .nonempty('Selecciona la fecha de nacimiento del alumno')
});
// Add an interface for user form props
interface MyFormProps {
  onSubmit: (data: MyFormData) => void;
  initialData?: MyFormData | null;
}

export default function MyForm({ onSubmit, initialData }: MyFormProps) {
  // Set default values for the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nombre: '',
      telefono: '',
      fecha_nacimiento: ''
    }
  });

  //Add onSubmit on HandleSubmit function
  function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      onSubmit(values as MyFormData);
      form.reset();
      toast.success('¡Éxito! Información guardada con éxito.');
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Error al guardar la información.');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='mx-auto max-w-3xl space-y-8 py-10'
      >
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='nombre'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder='Juan Pérez' type='text' {...field} />
                  </FormControl>
                  <FormDescription>
                    Introduce el nombre del alumno.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='telefono'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ejemplo: 5551234567'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Introduce el teléfono del alumno.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='fecha_nacimiento'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de nacimiento</FormLabel>
                  <FormControl>
                    <Input placeholder='shadcn' type='date' {...field} />
                  </FormControl>
                  <FormDescription>
                    Introduce la fecha de nacimiento del alumno.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type='submit'>{initialData ? 'Actualizar' : 'Guardar'}</Button>
      </form>
    </Form>
  );
}
