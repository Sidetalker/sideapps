'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { getBasePath } from '@/utils/paths';

interface ProjectSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  isReversed?: boolean;
  isWashLoft?: boolean;
}

export default function ProjectSection({ title, description, imageUrl, isReversed = false, isWashLoft = false }: ProjectSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    containScroll: "keepSnaps",
    align: "center"
  });

  const washLoftImages = [
    `${getBasePath()}/washloft/screenshot1.png`,
    `${getBasePath()}/washloft/screenshot2.png`,
    `${getBasePath()}/washloft/screenshot3.png`,
    `${getBasePath()}/washloft/screenshot4.png`
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isWashLoft && emblaApi && mounted) {
      const interval = setInterval(() => {
        emblaApi.scrollNext();
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isWashLoft, emblaApi, mounted]);

  const renderCarousel = () => {
    if (!mounted) {
      return (
        <div className="relative w-full h-[600px] overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse" />
          <Image
            src={washLoftImages[0]}
            alt="WashLoft Screenshot 1"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ borderRadius: '24px', overflow: 'hidden' }}
          />
        </div>
      );
    }

    return (
      <div 
        className="h-[600px] overflow-hidden shadow-lg" 
        ref={emblaRef}
      >
        <div className={`flex h-full touch-pan-y ${!mounted ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          {washLoftImages.map((img, index) => (
            <div 
              key={img}
              className="relative flex-[0_0_100%] min-w-0 h-full pl-4"
            >
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={img}
                  alt={`WashLoft Screenshot ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ borderRadius: '24px', overflow: 'hidden' }}
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 min-h-[80vh] items-center justify-center p-8 md:p-16`}
    >
      <div className="flex-1 space-y-4">
        <motion.h2 
          initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold"
        >
          {title}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-gray-600 dark:text-gray-300"
        >
          {description}
        </motion.p>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex-1 w-full"
      >
        {isWashLoft ? renderCarousel() : (
          <div className="relative h-[600px] w-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ borderRadius: '24px', overflow: 'hidden' }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
} 