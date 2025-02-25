'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getBasePath } from '@/utils/paths';

interface ProjectApp {
  name: string;
  color: string;
  icon: string | React.ReactNode;
  sectionId: string;
}

const projectApps: ProjectApp[] = [
  {
    name: 'WashLoft',
    color: '',
    icon: <Image 
            src={`${getBasePath()}/washloft/icon.png`}
            alt="WashLoft" 
            width={56} 
            height={56} 
            className="w-full h-full object-cover rounded-2xl"
          />,
    sectionId: 'project-one'
  },
  {
    name: 'Project Two',
    color: 'from-blue-500 to-blue-600',
    icon: 'P2',
    sectionId: 'project-two'
  },
  {
    name: 'Project Three',
    color: 'from-emerald-500 to-emerald-600',
    icon: 'P3',
    sectionId: 'project-three'
  }
];

export default function ModernIPhone() {
  const [currentTime, setCurrentTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const dynamicIslandControls = useAnimation();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    setMounted(true);
    return () => clearInterval(interval);
  }, []);

  const scrollToProject = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pulseIsland = async () => {
    await dynamicIslandControls.start({
      width: 104,
      height: 30,
      transition: { duration: 0.3 }
    });
    await dynamicIslandControls.start({
      width: 96,
      height: 28,
      transition: { duration: 0.2 }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{ opacity: 0.9, scale: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="transform rotate-[-15deg] md:rotate-[-25deg] scale-[0.55] md:scale-[0.65] lg:scale-75 pointer-events-auto"
    >
      {/* Dynamic Island */}
      <motion.div 
        initial={{ width: 96, height: 28 }}
        animate={dynamicIslandControls}
        onClick={pulseIsland}
        className="absolute left-1/2 -translate-x-1/2 top-[14px] bg-black rounded-[16px] z-20 shadow-lg cursor-pointer"
      >
        <div className="absolute inset-[2px] bg-black rounded-[14px] overflow-hidden">
          <div className="w-full h-full bg-gradient-to-b from-gray-800/50 to-transparent" />
        </div>
      </motion.div>
      
      {/* Phone Frame */}
      <div className="relative w-[300px] h-[600px] bg-[#1a1a1a] rounded-[55px] p-[5px] shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-gray-700">
        {/* Inner Border */}
        <div className="absolute inset-0 rounded-[55px] border border-gray-600/30" />
        
        {/* Screen */}
        <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-[50px] relative overflow-hidden">
          {/* Status Bar */}
          <div className="h-8 w-full flex items-center px-8 pt-2">
            <div className="text-[12px] text-white font-medium">
              {mounted ? currentTime : ''}
            </div>
            <div className="ml-auto flex items-center space-x-1.5">
              <div className="flex space-x-px">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-[3px] bg-white rounded-sm ${
                      i === 3 ? 'h-2' : i === 2 ? 'h-2.5' : i === 1 ? 'h-3' : 'h-3.5'
                    }`}
                  />
                ))}
              </div>
              <div className="w-4 h-2.5 border border-white rounded-[3px] relative">
                <div className="absolute inset-[2px] bg-white rounded-sm" />
              </div>
            </div>
          </div>

          {/* App Grid */}
          <div className="grid grid-cols-4 gap-6 p-6 mt-2">
            {projectApps.map((app) => (
              <motion.button
                key={app.name}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.85 }}
                transition={{ duration: 0.2 }}
                onClick={() => scrollToProject(app.sectionId)}
                className="flex flex-col items-center focus:outline-none group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 group-hover:shadow-xl overflow-hidden ${app.color ? `bg-gradient-to-br ${app.color}` : ''}`}>
                  {typeof app.icon === 'string' ? (
                    <div className="text-[14px] text-white font-bold">{app.icon}</div>
                  ) : (
                    app.icon
                  )}
                </div>
                <div className="text-[10px] text-white/90 mt-1">{app.name}</div>
              </motion.button>
            ))}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
        </div>

        {/* Screen Reflection Overlay */}
        <div className="absolute inset-0 rounded-[50px] bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none z-10" />
      </div>

      {/* Outer Frame Reflection */}
      <div className="absolute inset-0 rounded-[55px] bg-gradient-to-t from-transparent via-white/10 to-transparent pointer-events-none z-10" />
    </motion.div>
  );
} 