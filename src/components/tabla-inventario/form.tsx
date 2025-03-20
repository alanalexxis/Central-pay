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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MyFormDataInventario } from '@/../types/table';

const formSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().nonempty('El campo nombre no puede estar vacío'),
  detalles: z.string().nonempty('El campo detalles no puede estar vacío'),
  estado: z.string().nonempty('Selecciona un estado del objeto')
});

interface MyFormProps {
  onSubmit: (data: MyFormDataInventario) => void;
  initialData?: MyFormDataInventario | null;
}

export default function MyForm({ onSubmit, initialData }: MyFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nombre: '',
      detalles: '',
      estado: ''
    }
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Asegurar que el ID sea tomado correctamente
      const id = values.idinventario || initialData?.idinventario;
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(`/api/inventarios${id ? `/${id}` : ''}`, {
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
              name='nombre'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder='Desarmador' type='text' {...field} />
                  </FormControl>
                  <FormDescription>
                    Introduce el nombre del objeto.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='detalles'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalles</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Desarmador de punta plana de 6 pulgadas'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Introduce los detalles del objeto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-8'>
            <FormField
              control={form.control}
              name='estado'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecciona un estado para el objeto' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Bueno'>Bueno</SelectItem>
                      <SelectItem value='Regular'>Regular</SelectItem>
                      <SelectItem value='Malo'>Malo</SelectItem>
                    </SelectContent>
                  </Select>

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
