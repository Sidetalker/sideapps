'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import ModernIPhone from './ModernIPhone';

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  
  const contentOpacity = useTransform(scrollY, 
    [0, 300], 
    [1, 0]
  );
  
  const contentY = useTransform(scrollY,
    [0, 300],
    [0, -50]
  );

  const elementOpacity = useTransform(scrollY,
    [0, 650, 651],
    [1, 1, 0]
  );

  return (
    <section ref={ref} className="relative min-h-[150vh] w-full overflow-hidden">
      {/* Background */}
      <motion.div 
        style={{ opacity: elementOpacity }}
        className="fixed top-0 left-0 right-0 z-10 h-[200px] bg-gradient-to-b from-[rgb(var(--background-rgb))] via-[rgb(var(--background-rgb))] to-transparent pointer-events-none max-w-[100vw]"
      />
      
      {/* Content */}
      <motion.div 
        style={{ opacity: contentOpacity, y: contentY }}
        className="fixed top-0 left-0 right-0 z-20 pointer-events-none max-w-[100vw]"
      >
        <div className="flex flex-col md:justify-start md:items-start items-center p-8 md:p-16 lg:p-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:max-w-[50%] pt-8 md:pt-16 pointer-events-auto w-full"
          >
            <div className="flex flex-col items-center md:items-start w-full">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-1 text-center md:text-left"
              >
                SideApps
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-4"
              >
                by Kevin Sullivan
              </motion.p>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="hidden md:block text-base text-gray-600 dark:text-gray-300 text-center md:text-left max-w-[300px]"
              >
                A personal and professional portfolio of apps created over the last 10 years
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* iPhone Container */}
      <motion.div 
        style={{ opacity: elementOpacity }}
        className="sticky md:top-[20vh] top-[180px] w-full h-screen mt-0 z-[5] md:z-30"
      >
        <div className="relative w-full h-full flex md:block justify-center">
          <div className="relative md:absolute md:right-[10%] md:-translate-x-0 h-[600px] w-[300px] overflow-hidden">
            <ModernIPhone />
          </div>
        </div>
      </motion.div>
    </section>
  );
} 