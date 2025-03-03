'use client';

import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { getBasePath } from '@/utils/paths';

interface ProjectApp {
  name: string;
  color: string;
  icon: string | React.ReactNode;
  sectionId: string;
  glowDelay?: number;
}

interface BottomRowApp {
  name: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface ModernIPhoneProps {
  onResumeClick: () => void;
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
    sectionId: 'project-one',
    glowDelay: 0
  },
  {
    name: 'Capital One',
    color: '',
    icon: <Image 
            src={`${getBasePath()}/capone/icon.png`}
            alt="Capital One" 
            width={56} 
            height={56} 
            className="w-full h-full object-cover rounded-2xl"
          />,
    sectionId: 'project-two',
    glowDelay: 1
  },
  {
    name: 'Chewy',
    color: '',
    icon: <Image 
            src={`${getBasePath()}/chewy/icon.png`}
            alt="Chewy" 
            width={56} 
            height={56} 
            className="w-full h-full object-cover rounded-2xl"
          />,
    sectionId: 'project-three',
    glowDelay: 2
  },
  {
    name: 'AAF',
    color: '',
    icon: <Image 
            src={`${getBasePath()}/aaf/icon.png`}
            alt="Alliance of American Football" 
            width={56} 
            height={56} 
            className="w-full h-full object-cover rounded-2xl"
          />,
    sectionId: 'project-four',
    glowDelay: 3
  },
  {
    name: 'Amwell',
    color: '',
    icon: <Image 
            src={`${getBasePath()}/amwell/icon.png`}
            alt="Amwell" 
            width={56} 
            height={56} 
            className="w-full h-full object-cover rounded-2xl"
          />,
    sectionId: 'project-five',
    glowDelay: 4
  }
];

// Matrix rain effect component
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const characters = '01';
    const fontSize = 14;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
      style={{ 
        mixBlendMode: 'screen',
        zIndex: 1
      }}
    />
  );
};

export default function ModernIPhone({ onResumeClick }: ModernIPhoneProps) {
  const [currentTime, setCurrentTime] = useState('');
  const [mounted, setMounted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentGlowIndex, setCurrentGlowIndex] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const dynamicIslandControls = useAnimation();

  const bottomRowApps: BottomRowApp[] = [
    {
      name: 'Messages',
      icon: <Image 
              src={`${getBasePath()}/links/messages.png`}
              alt="Messages" 
              width={56} 
              height={56} 
              className="w-full h-full object-cover rounded-2xl"
            />,
      onClick: () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      name: 'GitHub',
      icon: <Image 
              src={`${getBasePath()}/links/github.png`}
              alt="GitHub" 
              width={56} 
              height={56} 
              className="w-full h-full object-cover rounded-2xl"
            />,
      onClick: () => window.open('https://github.com/Sidetalker', '_blank')
    },
    {
      name: 'LinkedIn',
      icon: <Image 
              src={`${getBasePath()}/links/linkedIn.png`}
              alt="LinkedIn" 
              width={56} 
              height={56} 
              className="w-full h-full object-cover rounded-2xl"
            />,
      onClick: () => window.open('https://www.linkedin.com/in/sideapps/', '_blank')
    },
    {
      name: 'Resume',
      icon: <Image 
              src={`${getBasePath()}/links/resume.png`}
              alt="Resume" 
              width={56} 
              height={56} 
              className="w-full h-full object-cover rounded-2xl"
            />,
      onClick: () => onResumeClick()
    },
  ];

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

  useEffect(() => {
    if (!hasInteracted) {
      const interval = setInterval(() => {
        setCurrentGlowIndex(prev => (prev + 1) % projectApps.length);
      }, 1500); // Just the duration, since we're not using repeatDelay anymore
      return () => clearInterval(interval);
    }
  }, [hasInteracted]);

  const scrollToProject = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pulseIsland = async () => {
    setTapCount(prev => {
      const newCount = prev + 1;
      
      // Reset tap count after 2 seconds of no taps
      setTimeout(() => setTapCount(0), 2000);
      
      // Check for developer mode activation (5 quick taps)
      if (newCount === 5) {
        const newDevMode = !isDeveloperMode;
        setIsDeveloperMode(newDevMode);
        
        // Trigger special animation for developer mode toggle
        dynamicIslandControls.start({
          rotate: [0, 360],
          scale: [1, 1.5, 1],
          transition: { duration: 0.8 }
        });
        return 0;
      }
      return newCount;
    });

    // Log easter egg state change only when tap count reaches 4
    if (tapCount === 4) {
      // We check for 4 because the state hasn't updated yet when we check
      const newDevMode = !isDeveloperMode;
      console.log(`🔓 Easter egg ${newDevMode ? 'activated' : 'deactivated'}!`);
    }

    // Regular pulse animation
    await dynamicIslandControls.start({
      width: isDeveloperMode ? 120 : 104,
      height: isDeveloperMode ? 35 : 30,
      backgroundColor: isDeveloperMode ? "#00ff00" : "#000000",
      transition: { duration: 0.3 }
    });
    await dynamicIslandControls.start({
      width: 96,
      height: 28,
      backgroundColor: "#000000",
      transition: { duration: 0.2 }
    });
  };

  const handleInteraction = () => {
    setIsHovered(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{ opacity: 0.9, scale: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      onHoverStart={handleInteraction}
      onTapStart={handleInteraction}
      className="transform rotate-[-15deg] md:rotate-[-25deg] scale-[0.55] md:scale-[0.65] lg:scale-75 pointer-events-auto"
    >
      {/* Dynamic Island */}
      <motion.div 
        initial={{ width: 96, height: 28 }}
        animate={dynamicIslandControls}
        onClick={() => {
          handleInteraction();
          pulseIsland();
        }}
        style={{ 
          position: 'absolute',
          left: '50%',
          top: '14px',
          transformOrigin: 'center',
          x: '-50%'
        }}
        className="bg-black rounded-[16px] z-20 shadow-lg cursor-pointer"
      >
        <div className={`absolute inset-[2px] bg-black rounded-[14px] overflow-hidden transition-all duration-300 ${
          isDeveloperMode ? 'bg-gradient-to-r from-green-900 to-black' : ''
        }`}>
          <div className="w-full h-full bg-gradient-to-b from-gray-800/50 to-transparent" />
        </div>
      </motion.div>
      
      {/* Phone Frame */}
      <div className="relative w-[300px] h-[600px] bg-[#1a1a1a] rounded-[55px] p-[5px] shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-gray-700">
        {/* Inner Border */}
        <div className="absolute inset-0 rounded-[55px] border border-gray-600/30" />
        
        {/* Screen */}
        <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black rounded-[50px] relative overflow-hidden">
          {isDeveloperMode && <MatrixRain />}
          
          {/* Status Bar */}
          <div className="h-8 w-full flex items-center px-8 pt-2">
            <div className="text-[12px] text-white font-medium">
              {mounted ? currentTime : ''}
            </div>
            <div className="ml-auto flex items-center space-x-1.5">
              <div className="flex space-x-px items-end h-2.5">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-[3px] bg-white rounded-sm ${
                      i === 3 ? 'h-2.5' : i === 2 ? 'h-[7.5px]' : i === 1 ? 'h-[5px]' : 'h-[2.5px]'
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
          <div className="grid grid-cols-4 gap-4 p-6 mt-2">
            {projectApps.map((app, index) => (
              <motion.button
                key={app.name}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ 
                  scale: 0.9,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.85 }}
                onClick={() => {
                  handleInteraction();
                  scrollToProject(app.sectionId);
                }}
                className="flex flex-col items-center focus:outline-none group relative"
              >
                <div className="relative">
                  <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 group-hover:shadow-xl overflow-hidden ${app.color ? `bg-gradient-to-br ${app.color}` : ''}`}>
                    {typeof app.icon === 'string' ? (
                      <div className="text-[14px] text-white font-bold">{app.icon}</div>
                    ) : (
                      app.icon
                    )}
                  </div>
                  <AnimatePresence mode="wait">
                    {!hasInteracted && currentGlowIndex === index && (
                      <motion.div
                        key={`glow-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: [0, 0.6, 0],
                          scale: [1, 1.2, 1]
                        }}
                        exit={{ 
                          opacity: 0,
                          scale: 1,
                          transition: { duration: 0.2 }
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: 0
                        }}
                        onAnimationComplete={() => {
                          if (isHovered) {
                            setHasInteracted(true);
                          }
                        }}
                        className="absolute inset-0 bg-white rounded-2xl"
                        style={{ filter: 'blur(10px)', zIndex: 0 }}
                      />
                    )}
                  </AnimatePresence>
                </div>
                <div className={`text-[10px] text-white/90 mt-1 ${app.name === 'Capital One' ? 'whitespace-nowrap' : ''}`}>
                  {app.name}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Bottom Row Apps */}
          <div className="absolute bottom-8 left-0 right-0 grid grid-cols-4 gap-6 px-6">
            {bottomRowApps.map((app) => (
              <motion.button
                key={app.name}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.85 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  handleInteraction();
                  if (app.name === 'Resume') {
                    onResumeClick();
                  } else {
                    app.onClick?.();
                  }
                }}
                className="flex flex-col items-center focus:outline-none group"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 group-hover:shadow-xl overflow-hidden">
                  {app.icon}
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