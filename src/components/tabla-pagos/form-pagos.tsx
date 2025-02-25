'use client';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type Alumno, searchAllUsers } from '@/components/tabla-pagos/action';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import type { MyFormDataPago } from '@/../types/table';
import { AsyncSelect } from '../search';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  id: z.string().optional(),
  idalumno: z.preprocess((val) => Number(val), z.number().positive()),
  nota_venta: z.string().optional()
});

interface MyFormProps {
  onSubmit: (data: MyFormDataPago) => void;
  initialData?: MyFormDataPago | null;
}

function incrementarNotaVenta(notaVenta: string | null, sede: string): string {
  if (!notaVenta) {
    const year = new Date().getFullYear();
    return `${year}A-${sede}001`;
  }

  const match = notaVenta.match(new RegExp(`(\\d{4}A-${sede})(\\d{3})`));
  if (!match) return notaVenta;

  const prefix = match[1];
  const number = Number.parseInt(match[2], 10) + 1;
  const incrementedNumber = number.toString().padStart(3, '0');

  return `${prefix}${incrementedNumber}`;
}

export default function MyForm({ onSubmit, initialData }: MyFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      idalumno: initialData?.idalumno ?? 0,
      nota_venta: ''
    }
  });

  const [selectedUser, setSelectedUser] = useState<string>('');
  const [incrementedNotaVenta, setIncrementedNotaVenta] = useState<string>('');

  useEffect(() => {
    async function fetchNotaVenta(idalumno: string) {
      const res = await fetch(`/api/alumnos/${idalumno}`);
      const alumno = await res.json();
      const sede = alumno.sede === 'Yajalón' ? 'Y' : 'T';

      const resPago = await fetch(`/api/pagos`);
      const pagos = await resPago.json();
      const ultimoPago = pagos
        .filter((pago: any) =>
          pago.nota_venta.startsWith(`${new Date().getFullYear()}A-${sede}`)
        )
        .sort((a: any, b: any) => b.nota_venta.localeCompare(a.nota_venta))[0];
      const nuevaNotaVenta = incrementarNotaVenta(
        ultimoPago?.nota_venta || null,
        sede
      );

      setIncrementedNotaVenta(nuevaNotaVenta);
    }

    if (selectedUser) {
      form.setValue('idalumno', Number(selectedUser));
      fetchNotaVenta(selectedUser);
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
      <div className='mb-4 flex items-center justify-between'>
        <FormLabel></FormLabel>
        <Badge variant='secondary' className='px-3 py-1 text-lg'>
          {incrementedNotaVenta}
        </Badge>
      </div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-12'>
        <div className='space-y-4'>
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
                            <div className='text-xs text-muted-foreground'>
                              {alumno.telefono}
                            </div>
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
        </div>

        <Button type='submit' className='w-full'>
          {initialData ? 'Actualizar' : 'Guardar'}
        </Button>
      </form>
    </Form>
  );
}
