'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';

interface ProjectSectionProps {
  title: string;
  description: string;
  extendedDescription?: string;
  images?: string[];
  isReversed?: boolean;
  appStoreLink?: string;
}

export default function ProjectSection({ 
  title, 
  description, 
  extendedDescription,
  images = [], 
  isReversed = false,
  appStoreLink,
}: ProjectSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatText = (text: string) => {
    // First handle markdown bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    // Split by HTML bold tags
    const parts = text.split(/(<b>.*?<\/b>)/g);
    return parts.map((part, i) => {
      if (part.startsWith('<b>') && part.endsWith('</b>')) {
        // Extract content between tags and render as bold
        const content = part.slice(3, -4);
        return <b key={i} className="font-semibold">{content}</b>;
      }
      return part;
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderCarousel = () => {
    if (!mounted) {
      return (
        <div className="relative w-full h-[600px] overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse" />
          <Image
            src={images[0]}
            alt={`${title} Screenshot 1`}
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
        {images.map((img, index) => (
          <SwiperSlide key={img} className="!w-[80%] !max-w-[800px] swiper-slide-container">
            <div className="relative w-full h-[90%] mx-auto my-auto">
              <Image
                src={img}
                alt={`${title} Screenshot ${index + 1}`}
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

  const renderImage = () => {
    return (
      <div className="relative h-[600px] w-full overflow-hidden">
        <Image
          src={images[0]}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ borderRadius: '24px', overflow: 'hidden' }}
        />
      </div>
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
          <motion.h2 className="text-3xl md:text-4xl font-bold text-white">{title}</motion.h2>
          <motion.p className="text-lg text-gray-300">{description}</motion.p>
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
      className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 min-h-[80vh] items-center justify-center p-8 md:p-16 relative z-20`}
    >
      <div className="flex-1 space-y-4">
        <header className="flex flex-wrap items-center gap-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white motion-safe:animate-fade-in">
            {title}
          </h2>
          {appStoreLink && (
            <a
              href={appStoreLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-block"
            >
              <Image
                src="/misc/appStoreLink.png"
                alt="Download on App Store"
                width={135}
                height={40}
                className="h-10 w-auto transition-transform duration-200 group-hover:scale-110"
              />
            </a>
          )}
        </header>
        <div className="space-y-4">
          <motion.p 
            initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-300"
          >
            {description}
          </motion.p>
          {extendedDescription && (
            <>
              <div className="mt-4 hidden md:block space-y-2">
                {extendedDescription.split('\n').filter(line => line.trim()).map((line, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                  >
                    <span className="mr-2">•</span>
                    <span>{formatText(line.trim().replace(/^-\s*/, ''))}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="md:hidden">
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: isExpanded ? 1 : 0,
                      height: isExpanded ? "auto" : 0
                    }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-2 overflow-hidden"
                  >
                    {extendedDescription.split('\n').filter(line => line.trim()).map((line, index) => (
                      <div key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{formatText(line.trim().replace(/^-\s*/, ''))}</span>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-4 font-bold text-white hover:text-gray-300 transition-colors"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex-1 w-full"
      >
        {images.length > 1 ? renderCarousel() : renderImage()}
      </motion.div>
    </motion.div>
  );
} 