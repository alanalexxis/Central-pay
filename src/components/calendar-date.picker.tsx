'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { es } from 'date-fns/locale';

import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useState } from 'react';

const FormSchema = z.object({
  datetime: z.date({
    required_error: 'Date & time is required!.'
  })
});

export function DateTimePickerV2({
  onChange
}: {
  onChange: (date: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  });

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      onChange(formattedDate);
    }
  };

  return (
    <>
      <div className='flex w-full gap-4'>
        <FormField
          control={form.control}
          name='datetime'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      className='ml-1 pl-3 text-left font-normal text-muted-foreground'
                    >
                      {date ? (
                        format(date, 'PPP', { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    captionLayout='dropdown'
                    selected={date || field.value}
                    onSelect={handleDateChange}
                    onDayClick={() => setIsOpen(false)}
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                    locale={es}
                    defaultMonth={field.value}
                    disabled={(day) => day > new Date()}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
