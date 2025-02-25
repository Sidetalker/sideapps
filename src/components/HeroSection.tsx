'use client';

import { motion } from 'framer-motion';
import ModernIPhone from './ModernIPhone';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Content */}
      <div className="relative z-0 h-full min-h-screen flex flex-col md:justify-start md:items-start items-center p-8 md:p-16 lg:p-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:max-w-[50%] pt-12 md:pt-24"
        >
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-center md:text-left"
          >
            Welcome to SideApps
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 text-center md:text-left"
          >
            Exploring the intersection of innovation and technology through personal projects
          </motion.p>
        </motion.div>
      </div>

      {/* iPhone Container */}
      <div className="absolute inset-0 z-10">
        <div className="relative w-full h-full">
          <div className="absolute bottom-[5%] md:bottom-[10%] md:right-[10%] left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0">
            <ModernIPhone />
          </div>
        </div>
      </div>
    </section>
  );
} 