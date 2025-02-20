'use client';
import { useState, useEffect } from 'react';
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

interface MyFormProps {
  onSubmit: (data: MyFormData) => void;
  initialData?: MyFormData | null;
}

export default function MyForm({ onSubmit, initialData }: MyFormProps) {
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
      // Asegurar que el ID sea tomado correctamente
      const id = values.idalumno || initialData?.idalumno;
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(`/api/alumnos${id ? `/${id}` : ''}`, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (res.ok) {
        const data = await res.json();
        onSubmit(data);
        form.reset(data); // Asegurar que el formulario se actualice con los nuevos valores
      } else {
        console.error('Error al enviar los datos:', await res.text());
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
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
              <DateTimePickerV2
                onChange={(date) => field.onChange(date)}
                initialDate={field.value}
              />
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
