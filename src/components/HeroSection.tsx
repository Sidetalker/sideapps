'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import ModernIPhone from './ModernIPhone';
import PDFViewer from './PDFViewer';

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

  const [isPDFOpen, setIsPDFOpen] = useState(false);

  return (
    <>
      <section ref={ref} className="relative min-h-[150vh] w-full overflow-hidden">
        {/* Background */}
        <motion.div 
          style={{ opacity: elementOpacity }}
          className="fixed top-0 left-0 right-0 z-10 h-[200px] bg-gradient-to-b from-[rgb(var(--background-rgb))] via-[rgb(var(--background-rgb))] to-transparent pointer-events-none max-w-[100vw]"
        />
        
        {/* Content */}
        <motion.div 
          style={{ opacity: contentOpacity, y: contentY }}
          className="fixed top-0 left-0 right-0 z-30 pointer-events-none max-w-[100vw]"
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
                  className="hidden md:block text-base text-gray-600 dark:text-gray-300 text-center md:text-left max-w-[600px] mb-4"
                >
                  Seasoned iOS developer with 10+ years of experience crafting high-performance mobile applications. Expert in Swift, UI/UX design, and scalable architecture, delivering impactful solutions for top enterprises like Capital One and Chewy. Passionate about building seamless, user-centric experiences that drive results!
                </motion.p>
                
                <motion.a
                  href="#contact"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block bg-black hover:bg-zinc-900 border-2 border-white/20 rounded-xl text-white font-medium py-3 px-6 transition-colors duration-200 pointer-events-auto z-50 relative w-[200px] text-center"
                >
                  Get in Touch!
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* iPhone Container */}
        <motion.div 
          style={{ opacity: elementOpacity }}
          className="sticky md:top-[20vh] top-[215px] w-full h-screen mt-0 z-[5] md:z-20"
        >
          <div className="relative w-full h-full flex md:block justify-center">
            <div className="relative md:absolute md:right-[10%] md:-translate-x-0 h-[600px] w-[300px] overflow-hidden">
              <ModernIPhone onResumeClick={() => setIsPDFOpen(true)} />
            </div>
          </div>
        </motion.div>
      </section>

      <PDFViewer 
        isOpen={isPDFOpen}
        onClose={() => setIsPDFOpen(false)}
      />
    </>
  );
} 