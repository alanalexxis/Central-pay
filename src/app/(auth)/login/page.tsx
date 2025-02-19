'use client';
import { GalleryVerticalEnd } from 'lucide-react';
import { LoginForm } from '@/app/(auth)/login/components/LoginForm';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import LoginImage from '@/../public/login-image.jpg';
import LoginImage2 from '@/../public/login-image2.jpg';
import LoginImage3 from '@/../public/login-image3.jpg';
import LoginImage4 from '@/../public/login-image4.jpg';
import LoginImage5 from '@/../public/login-image5.jpg';
export default function LoginPage() {
  // Lista de imágenes para la transición
  const images = [
    LoginImage,
    LoginImage2,
    LoginImage3,
    LoginImage4,
    LoginImage5
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Cambiar la imagen cada 5 segundos
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2 md:justify-start'>
          <a href='#' className='flex items-center gap-2 font-medium'>
            <div className='flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground'>
              <GalleryVerticalEnd className='size-4' />
            </div>
            CentralPay.
          </a>
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <LoginForm />
          </div>
        </div>
      </div>
      <div className='relative hidden bg-muted lg:block'>
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: index === currentImageIndex ? 1 : 0,
              transition: { duration: 1 }
            }}
            exit={{ opacity: 0 }}
            className='absolute inset-0'
          >
            <Image
              src={image}
              alt='Imagen'
              width='1920'
              height='1080'
              className='h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
