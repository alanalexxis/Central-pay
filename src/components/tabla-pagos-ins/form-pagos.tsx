'use client';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  type Alumno,
  searchAllUsers
} from '@/components/tabla-pagos-ins/action';
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
import type { MyFormDataPago } from '@/../types/table';
import { AsyncSelect } from '../search';
import { useEffect, useState } from 'react';

import { MapPin } from 'lucide-react';
import { DateTimePickerV2 } from '../calendar-date.picker-pago';

const formSchema = z.object({
  id: z.string().optional(),
  idalumno: z.preprocess(
    (val) => (val === '' ? undefined : val), // Si el valor es vacío, lo convierte en undefined
    z.number().positive({ message: 'Seleccione un alumno' }).optional() // Mensaje de error
  ),
  nota_venta: z.string().optional(),
  tipo_pago: z.string().default('Inscripción'),
  fecha_pago: z.string({
    required_error: 'La fecha de pago es obligatoria'
  }),
  fecha_inicio: z.string({
    required_error: 'La fecha de inicio es obligatoria'
  })
});

interface MyFormProps {
  onSubmit: (data: MyFormDataPago) => void;
  initialData?: MyFormDataPago | null;
}

export default function MyForm({ onSubmit, initialData }: MyFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      idalumno: initialData?.idalumno ?? 0
    }
  });

  const [selectedUser, setSelectedUser] = useState<string>('');

  useEffect(() => {
    if (selectedUser) {
      form.setValue('idalumno', Number(selectedUser));
    }
  }, [selectedUser, form]);

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-12'>
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='fecha_pago'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de pago de inscripción</FormLabel>
                <DateTimePickerV2
                  onChange={(date) => field.onChange(date)}
                  initialDate={field.value}
                />
                <FormDescription>
                  Selecciona la fecha de pago de inscripción.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
                        <div className='flex w-full items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <div className='flex flex-col'>
                              <div className='font-medium'>{alumno.nombre}</div>
                              <div className='text-xs text-muted-foreground'>
                                {alumno.telefono}
                              </div>
                            </div>
                          </div>
                          <div className='flex items-center text-xs text-muted-foreground'>
                            <MapPin className='mr-1 h-3 w-3' />
                            {alumno.sede}
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
                      width='475px'
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='fecha_inicio'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de inicio</FormLabel>
                <DateTimePickerV2
                  onChange={(date) => field.onChange(date)}
                  initialDate={field.value}
                />
                <FormDescription>
                  Selecciona la fecha de inicio.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type='submit' className='w-full'>
          {initialData ? 'Actualizar' : 'Guardar'}
        </Button>
      </form>
    </Form>
  );
}
