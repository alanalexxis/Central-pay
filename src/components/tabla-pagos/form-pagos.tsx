'use client';

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
import { MyFormDataPago } from '@/../types/table';

const formSchema = z.object({
  id: z.string().optional(),
  idalumno: z.preprocess((val) => Number(val), z.number().positive()),
  nota_venta: z.string().nonempty('El campo teléfono no puede estar vacío')
});

interface MyFormProps {
  onSubmit: (data: MyFormDataPago) => void;
  initialData?: MyFormDataPago | null;
}

export default function MyForm({ onSubmit, initialData }: MyFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      idalumno: initialData?.idalumno ?? 0,
      nota_venta: ''
    }
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Asegurar que el ID sea tomado correctamente
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
        form.reset(data); // Asegurar que el formulario se actualice con los nuevos valores
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
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='mx-auto max-w-3xl space-y-8 py-10'
      >
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='idalumno'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>idalumno</FormLabel>
                  <FormControl>
                    <Input placeholder='Juan Pérez' type='text' {...field} />
                  </FormControl>
                  <FormDescription>Introduce el id del alumno.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='nota_venta'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nota de venta</FormLabel>
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

        <Button type='submit'>{initialData ? 'Actualizar' : 'Guardar'}</Button>
      </form>
    </Form>
  );
}
