'use client';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Alumno, searchAllUsers } from '@/components/tabla-pagos/action';
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
import { MyFormDataPago } from '@/../types/table';
import { AsyncSelect } from '../search';
import { useEffect, useState } from 'react';

const formSchema = z.object({
  id: z.string().optional(),
  idalumno: z.preprocess((val) => Number(val), z.number().positive()),
  nota_venta: z.string().optional()
});

interface MyFormProps {
  onSubmit: (data: MyFormDataPago) => void;
  initialData?: MyFormDataPago | null;
  lastNotaVenta?: string | null;
}

export default function MyForm({
  onSubmit,
  initialData,
  lastNotaVenta
}: MyFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      idalumno: initialData?.idalumno ?? 0,
      nota_venta: ''
    }
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      const id = values.idpago || initialData?.idpago;
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(`/api/pagos${id ? `/${id}` : ''}`, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (res.ok) {
        toast.success('¡Éxito! Información guardada con éxito.');
        const data = await res.json();
        onSubmit(data);
        form.reset(data);
      } else {
        console.error('Error al enviar los datos:', await res.text());
        toast.error('Error al guardar la información.');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  }

  // Dentro del componente MyForm
  const [selectedUser, setSelectedUser] = useState<string>('');

  // Actualiza el campo idalumno del formulario cuando se seleccione un alumno
  useEffect(() => {
    if (selectedUser) {
      // Se actualiza el valor de idalumno en el formulario con el id seleccionado
      form.setValue('idalumno', Number(selectedUser));
    }
  }, [selectedUser, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='mx-auto max-w-3xl space-y-8 py-10'
      >
        <div className='grid gap-4'>
          <div className='col-span-2'>
            <FormField
              control={form.control}
              name='nota_venta'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nota de venta</FormLabel>
                  <FormControl>
                    <Input value={lastNotaVenta ?? ''} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='idalumno'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alumno</FormLabel>
                  <FormControl>
                    <div className='w-full'>
                      <AsyncSelect<Alumno>
                        fetcher={searchAllUsers}
                        preload
                        filterFn={(alumno, query) =>
                          alumno.nombre
                            .toLowerCase()
                            .includes(query.toLowerCase())
                        }
                        renderOption={(alumno) => (
                          <div className='flex items-center gap-2'>
                            <div className='flex flex-col'>
                              <div className='font-medium'>{alumno.nombre}</div>
                            </div>
                          </div>
                        )}
                        getOptionValue={(alumno) => alumno.idalumno.toString()}
                        getDisplayValue={(alumno) => (
                          <div className='flex items-center gap-2 text-left'>
                            <div className='flex flex-col leading-tight'>
                              <div className='font-medium'>{alumno.nombre}</div>
                            </div>
                          </div>
                        )}
                        notFound={
                          <div className='py-6 text-center text-sm'>
                            No se encontraron alumnos
                          </div>
                        }
                        label='User'
                        placeholder='Seleccionar alumno...'
                        value={selectedUser}
                        onChange={setSelectedUser}
                        width='375px'
                      />
                    </div>
                  </FormControl>
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
