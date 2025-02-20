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
import { DateTimePickerV2 } from './calendar-date.picker';

const formSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().nonempty('El campo nombre no puede estar vacío'),
  telefono: z.string().nonempty('El campo teléfono no puede estar vacío'),
  fecha_nacimiento: z.string().nonempty('Selecciona una fecha de nacimiento')
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

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Enviar datos a la API usando fetch
      const res = await fetch('/api/alumnos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values) // Los datos del formulario se envían como JSON
      });

      // Verificar si la respuesta es exitosa
      if (res.ok) {
        toast.success('¡Éxito! Información guardada con éxito.');
        const data = await res.json(); // Obtener los datos de la respuesta
        onSubmit(data); // Pasar los datos a onSubmit en el componente padre
        form.reset(); // Limpiar el formulario
      } else {
        toast.error('Error al guardar la información.');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
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
        <FormField
          control={form.control}
          name='fecha_nacimiento'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de nacimiento</FormLabel>
              <DateTimePickerV2 onChange={(date) => field.onChange(date)} />
              <FormDescription>
                Selecciona la fecha de nacimiento del alumno.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>{initialData ? 'Actualizar' : 'Guardar'}</Button>
      </form>
    </Form>
  );
}
