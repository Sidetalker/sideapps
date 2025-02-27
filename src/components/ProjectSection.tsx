'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import { getBasePath } from '@/utils/paths';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';

interface ProjectSectionProps {
  title: string;
  description: string;
  imageUrl?: string;
  isReversed?: boolean;
  isWashLoft?: boolean;
}

export default function ProjectSection({ title, description, imageUrl = '', isReversed = false, isWashLoft = false }: ProjectSectionProps) {
  const [mounted, setMounted] = useState(false);

  const washLoftImages = [
    `${getBasePath()}/washloft/screenshot1.png?v=2`,
    `${getBasePath()}/washloft/screenshot2.png?v=2`,
    `${getBasePath()}/washloft/screenshot3.png?v=2`,
    `${getBasePath()}/washloft/screenshot4.png?v=2`
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

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
            style={{ overflow: 'hidden' }}
            priority={true}
            loading="eager"
          />
        </div>
      );
    }

    return (
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        loop={true}
        speed={1000}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[EffectCoverflow, Autoplay]}
        className="h-[600px] w-full swiper-container"
      >
        {washLoftImages.map((img, index) => (
          <SwiperSlide key={img} className="!w-[80%] !max-w-[800px] swiper-slide-container">
            <div className="relative w-full h-[90%] mx-auto my-auto">
              <Image
                src={img}
                alt={`WashLoft Screenshot ${index + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ 
                  overflow: 'hidden',
                  maxHeight: '100%',
                  width: '100%',
                  height: '100%'
                }}
                priority={index === 0}
                loading="eager"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  if (!mounted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 min-h-[80vh] items-center justify-center p-8 md:p-16`}
      >
        <div className="flex-1 space-y-4">
          <motion.h2 className="text-3xl md:text-4xl font-bold">{title}</motion.h2>
          <motion.p className="text-lg text-gray-600 dark:text-gray-300">{description}</motion.p>
        </div>
        <motion.div className="flex-1 w-full">
          <div className="relative h-[600px] w-full overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse" />
          </div>
        </motion.div>
      </motion.div>
    );
  }

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
          className="text-3xl md:text-4xl font-bold text-white"
        >
          {title}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-gray-300"
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