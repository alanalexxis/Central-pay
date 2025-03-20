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
import { MyFormData } from '@/../types/table';
import { DateTimePickerV2 } from '../calendar-date.picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { es } from 'date-fns/locale';

const formSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().nonempty('El campo nombre no puede estar vacío'),
  telefono: z.string().nonempty('El campo teléfono no puede estar vacío'),
  fecha_nacimiento: z.string().nonempty('Selecciona una fecha de nacimiento'),
  sexo: z.string().nonempty('Seleccione un género'),
  domicilio: z.string().nonempty('El campo domicilio no puede estar vacío'),
  barrio: z.string().nonempty('El campo barrio no puede estar vacío'),
  tutor: z.string().nonempty('El campo tutor no puede estar vacío'),
  escolaridad: z.string().nonempty('El campo escolaridad no puede estar vacío'),
  sede: z.string().nonempty('Seleccione una sede')
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
      fecha_nacimiento: '',
      sede: '',
      sexo: '',
      domicilio: '',
      barrio: '',
      tutor: '',
      escolaridad: ''
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
    <div className='h-[80vh] overflow-y-auto'>
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
                name='sexo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Género</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecciona un género' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Masculino'>Masculino</SelectItem>
                        <SelectItem value='Femenino'>Femenino</SelectItem>
                      </SelectContent>
                    </Select>

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
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='domicilio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Calle Vicente Guerrero #28'
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Introduce la dirección del alumno.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='barrio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barrio</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Barrio centro'
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Introduce el barrio del alumno.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name='sede'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Municipio</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona un municipio para el alumno' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='Yajalón'>Yajalón</SelectItem>
                    <SelectItem value='Tila'>Tila</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='escolaridad'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escolaridad</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Preparatoria'
                        type='text'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Introduce la escolaridad del alumno.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='tutor'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tutor</FormLabel>
                    <FormControl>
                      <Input placeholder='Juán Pérez' type='text' {...field} />
                    </FormControl>
                    <FormDescription>
                      Introduce el tutor del alumno.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type='submit'>
            {initialData ? 'Actualizar' : 'Guardar'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
