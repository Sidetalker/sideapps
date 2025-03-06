import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoughNotation } from 'react-rough-notation';

interface HandDrawnElementsProps {
  hasInteracted: boolean;
}

export default function HandDrawnElements({ hasInteracted }: HandDrawnElementsProps) {
  const [isMobile, setIsMobile] = useState(true); // Start with mobile true to prevent flicker
  const [isVisible, setIsVisible] = useState(false); // Start hidden until we confirm desktop
  const [windowWidth, setWindowWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Check if mobile and handle resize
  useEffect(() => {
    // Helper function to determine if mobile
    const checkIfMobile = () => {
      return window.innerWidth < 1024; // Using a larger threshold to be safe
    };
    
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      const mobileCheck = checkIfMobile();
      setIsMobile(mobileCheck);
      
      // Only show if desktop and not interacted
      setIsVisible(!mobileCheck && !hasInteracted);
      
      // Hide animation if browser was resized
      if (width !== windowWidth && !hasInteracted && !mobileCheck) {
        setIsVisible(false);
        // Reappear after a short delay
        setTimeout(() => {
          setIsVisible(!mobileCheck && !hasInteracted);
        }, 500);
      }
    };
    
    // Initial check
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [hasInteracted, windowWidth]);
  
  // Don't render anything if mobile or interacted
  if (isMobile || hasInteracted) return null;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="absolute z-10 w-[450px] h-[200px] left-[calc(50%-275px)] top-1/2 -translate-y-1/2 pointer-events-none hidden md:block"
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ pointerEvents: 'none' }}
        >
          {/* Hand-drawn text using inline style for font-family as a fallback */}
          <motion.div
            className="absolute top-[40%] -translate-y-1/2 left-[0%] pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { duration: 0.8, delay: 0.5 }
            }}
            style={{ pointerEvents: 'none' }}
          >
            <div 
              className="text-3xl font-bold text-white rotate-[-5deg] pointer-events-none" 
              style={{ fontFamily: "'Caveat', cursive", pointerEvents: 'none' }}
            >
              <RoughNotation 
                type="highlight" 
                color="rgba(255, 255, 255, 0.15)" 
                show={true}
                animationDuration={1500}
              >
                It works!
              </RoughNotation>
            </div>
          </motion.div>
          
          {/* Hand-drawn arrow with separate animated parts */}
          <svg width="100%" height="100%" viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 pointer-events-none" style={{ pointerEvents: 'none' }}>
            {/* Main curved path with loop */}
            <motion.path
              d="M140,80 C180,30 180,120 230,80 S280,30 340,80"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="6,6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                transition: { 
                  pathLength: { delay: 1.5, duration: 2.2, ease: "easeInOut" },
                  opacity: { delay: 1.5, duration: 0.3 }
                }
              }}
            />
            
            {/* First arrowhead line */}
            <motion.path
              d="M340,80 L315,81"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                transition: { 
                  pathLength: { delay: 3.7, duration: 0.3, ease: "easeOut" },
                  opacity: { delay: 3.7, duration: 0.1 }
                }
              }}
            />
            
            {/* Second arrowhead line */}
            <motion.path
              d="M340,80 L335,50"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                transition: { 
                  pathLength: { delay: 4.0, duration: 0.3, ease: "easeOut" },
                  opacity: { delay: 4.0, duration: 0.1 }
                }
              }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 