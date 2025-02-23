'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ImagePlus, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size !== 0, 'Please upload an image')
    .refine((file) => file.size <= 5000000, 'Image must be less than 5MB')
    .refine(
      (file) => ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type),
      'Only .jpg, .jpeg, and .png formats are supported'
    )
});

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [preview, setPreview] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: new File([], '')
    }
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPreview(result);
          onImageUpload(result);
        };
        reader.readAsDataURL(file);
        form.setValue('image', file, { shouldValidate: true });
      }
    },
    [form, onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Simulating an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(values);
      toast.success(`Image uploaded successfully: ${values.image.name}`);
      form.reset();
      setPreview(null);
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='image'
          render={() => (
            <FormItem>
              <FormLabel>
                <h2 className='text-2xl font-bold tracking-tight'>
                  Upload your image
                </h2>
              </FormLabel>
              <FormControl>
                <div
                  {...getRootProps()}
                  className={cn(
                    'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors',
                    isDragActive
                      ? 'border-primary bg-primary/10'
                      : 'border-muted-foreground/25 hover:bg-muted/25'
                  )}
                >
                  <Input {...getInputProps()} />
                  <AnimatePresence mode='wait'>
                    {preview ? (
                      <motion.img
                        key='preview'
                        src={preview}
                        alt='Preview'
                        className='max-h-[300px] rounded-lg object-contain'
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <motion.div
                        key='placeholder'
                        className='text-muted-foreground'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ImagePlus className='mx-auto h-16 w-16' />
                        <p className='mt-4 text-sm font-medium'>
                          Drag and drop your image here, or click to select
                        </p>
                        <p className='mt-2 text-xs'>
                          PNG, JPG or JPEG (max. 5MB)
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          disabled={form.formState.isSubmitting}
          className='w-full'
        >
          {form.formState.isSubmitting ? (
            <>
              <Upload className='mr-2 h-4 w-4 animate-spin' />
              Uploading...
            </>
          ) : (
            'Upload Image'
          )}
        </Button>
      </form>
    </Form>
  );
}
