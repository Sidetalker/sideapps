import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// Game constants
const GRAVITY = 0.1; // Reduced from 0.5 to make the bird fall more slowly
const JUMP_FORCE = -4; // Reduced from -8 to make jumps more gentle
const PIPE_WIDTH = 60;
const PIPE_GAP = 180; // Increased from 150 to make gaps between pipes larger
const PIPE_SPEED = 1.5; // Reduced from 2 to make pipes move slower
const BIRD_WIDTH = 30;
const BIRD_HEIGHT = 24;
const GROUND_HEIGHT = 50;

// Game dimensions - maintain a fixed aspect ratio
const GAME_WIDTH = 320;
const GAME_HEIGHT = 480;

// Initial bird position - start higher in the screen
const INITIAL_BIRD_X = 80; // Moved further right to give more reaction time
const INITIAL_BIRD_Y = 200; // Start in the middle of the screen

// Enhanced colors
const COLORS = {
  sky: {
    top: '#64b5f6',    // Lighter blue at the top
    bottom: '#1976d2', // Darker blue at the bottom
  },
  bird: {
    body: '#ffeb3b',   // Yellow body
    wing: '#fdd835',   // Slightly darker yellow for wing
    eye: '#000000',    // Black eye
    beak: '#ff9800',   // Orange beak
  },
  pipe: {
    main: '#4caf50',   // Main pipe color
    highlight: '#81c784', // Lighter green for highlights
    shadow: '#2e7d32',    // Darker green for shadows
    cap: '#388e3c',       // Cap color
  },
  ground: {
    top: '#8d6e63',    // Brown for ground top
    bottom: '#5d4037', // Darker brown for ground bottom
  },
  text: {
    main: '#ffffff',   // White text
    shadow: '#000000', // Black shadow
    score: '#ffeb3b',  // Yellow score
  },
  ui: {
    overlay: 'rgba(0, 0, 0, 0.7)', // Darker overlay for game over
    button: '#2196f3',  // Blue button
    buttonHover: '#1976d2', // Darker blue for hover
  }
};

// Cloud positions for background
const CLOUDS = [
  { x: 30, y: 40, size: 30 },
  { x: 130, y: 80, size: 40 },
  { x: 250, y: 60, size: 25 },
];

interface FlappyBirdProps {
  onClose: () => void;
}

const FlappyBird: React.FC<FlappyBirdProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [scale, setScale] = useState(1);
  const [highScore, setHighScore] = useState(0);
  
  // Game state
  const birdRef = useRef({
    x: INITIAL_BIRD_X,
    y: INITIAL_BIRD_Y,
    velocity: 0,
    rotation: 0, // Add rotation for bird animation
    wingUp: false, // Track wing position for animation
    wingCounter: 0, // Counter for wing flapping
  });
  
  const pipesRef = useRef<Array<{
    x: number;
    topHeight: number;
    scored: boolean;
  }>>([]);
  
  // Use a ref for the score to ensure synchronous updates
  const scoreRef = useRef(0);
  
  const animationFrameRef = useRef<number>(0);
  const lastPipeTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const groundOffsetRef = useRef(0);
  
  // Define drawing functions with useCallback to include them in dependency arrays
  const drawCloud = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.arc(x + size * 0.5, y - size * 0.4, size * 0.7, 0, Math.PI * 2);
    ctx.arc(x + size, y, size * 0.8, 0, Math.PI * 2);
    ctx.arc(x + size * 1.5, y, size * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }, []);
  
  const drawBird = useCallback((ctx: CanvasRenderingContext2D, bird: typeof birdRef.current) => {
    ctx.save();
    
    // Move to bird center for rotation
    ctx.translate(bird.x + BIRD_WIDTH / 2, bird.y + BIRD_HEIGHT / 2);
    
    // Rotate bird based on velocity
    ctx.rotate((bird.rotation * Math.PI) / 180);
    
    // Draw bird body
    ctx.fillStyle = COLORS.bird.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_WIDTH / 2, BIRD_HEIGHT / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw wing
    ctx.fillStyle = COLORS.bird.wing;
    ctx.beginPath();
    if (bird.wingUp) {
      // Wing up position
      ctx.ellipse(-2, -5, 10, 5, Math.PI / 4, 0, Math.PI * 2);
    } else {
      // Wing down position
      ctx.ellipse(-2, 5, 10, 5, -Math.PI / 4, 0, Math.PI * 2);
    }
    ctx.fill();
    
    // Draw eye
    ctx.fillStyle = COLORS.bird.eye;
    ctx.beginPath();
    ctx.arc(8, -3, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw beak
    ctx.fillStyle = COLORS.bird.beak;
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(18, -2);
    ctx.lineTo(18, 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }, []);
  
  const drawPipe = useCallback((ctx: CanvasRenderingContext2D, x: number, height: number, isTop: boolean) => {
    const pipeLength = isTop ? height : GAME_HEIGHT - height - GROUND_HEIGHT;
    
    // Create gradient for pipe
    const gradient = ctx.createLinearGradient(x, 0, x + PIPE_WIDTH, 0);
    gradient.addColorStop(0, COLORS.pipe.shadow);
    gradient.addColorStop(0.3, COLORS.pipe.main);
    gradient.addColorStop(0.7, COLORS.pipe.main);
    gradient.addColorStop(1, COLORS.pipe.highlight);
    
    // Draw main pipe
    ctx.fillStyle = gradient;
    
    if (isTop) {
      ctx.fillRect(x, 0, PIPE_WIDTH, height);
    } else {
      ctx.fillRect(x, height + PIPE_GAP, PIPE_WIDTH, pipeLength);
    }
    
    // Draw pipe cap
    ctx.fillStyle = COLORS.pipe.cap;
    const capWidth = PIPE_WIDTH + 10;
    const capHeight = 20;
    
    if (isTop) {
      ctx.fillRect(x - 5, height - capHeight, capWidth, capHeight);
      
      // Add highlight to cap
      ctx.fillStyle = COLORS.pipe.highlight;
      ctx.fillRect(x - 5, height - capHeight, capWidth, 3);
    } else {
      ctx.fillRect(x - 5, height + PIPE_GAP, capWidth, capHeight);
      
      // Add highlight to cap
      ctx.fillStyle = COLORS.pipe.highlight;
      ctx.fillRect(x - 5, height + PIPE_GAP, capWidth, 3);
    }
  }, []);
  
  const drawGround = useCallback((ctx: CanvasRenderingContext2D, offset: number) => {
    // Create gradient for ground
    const gradient = ctx.createLinearGradient(0, GAME_HEIGHT - GROUND_HEIGHT, 0, GAME_HEIGHT);
    gradient.addColorStop(0, COLORS.ground.top);
    gradient.addColorStop(1, COLORS.ground.bottom);
    
    // Draw ground base
    ctx.fillStyle = gradient;
    ctx.fillRect(0, GAME_HEIGHT - GROUND_HEIGHT, GAME_WIDTH, GROUND_HEIGHT);
    
    // Draw ground texture (small lines)
    ctx.strokeStyle = COLORS.ground.bottom;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < GAME_WIDTH + 20; i += 20) {
      const x = (i + offset) % (GAME_WIDTH + 20) - 20;
      
      ctx.beginPath();
      ctx.moveTo(x, GAME_HEIGHT - GROUND_HEIGHT + 10);
      ctx.lineTo(x + 10, GAME_HEIGHT - GROUND_HEIGHT + 5);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x + 10, GAME_HEIGHT - GROUND_HEIGHT + 25);
      ctx.lineTo(x + 20, GAME_HEIGHT - GROUND_HEIGHT + 20);
      ctx.stroke();
    }
  }, []);
  
  const drawSky = useCallback((ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT - GROUND_HEIGHT);
    gradient.addColorStop(0, COLORS.sky.top);
    gradient.addColorStop(1, COLORS.sky.bottom);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT - GROUND_HEIGHT);
    
    // Draw clouds
    CLOUDS.forEach(cloud => {
      drawCloud(ctx, cloud.x, cloud.y, cloud.size);
    });
  }, [drawCloud]);
  
  const drawText = useCallback((ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, color: string = COLORS.text.main) => {
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    
    // Draw text shadow
    ctx.fillStyle = COLORS.text.shadow;
    ctx.fillText(text, x + 2, y + 2);
    
    // Draw main text
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }, []);
  
  // Check for high score in local storage on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('flappyBirdHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);
  
  const startGame = useCallback(() => {
    if (gameOver) {
      // Reset game
      birdRef.current = {
        x: INITIAL_BIRD_X,
        y: INITIAL_BIRD_Y,
        velocity: 0,
        rotation: 0,
        wingUp: false,
        wingCounter: 0,
      };
      pipesRef.current = [];
      scoreRef.current = 0; // Reset score ref
      setGameOver(false);
    }
    
    setGameStarted(true);
  }, [gameOver]);
  
  const jump = useCallback(() => {
    if (gameOver) {
      startGame();
      return;
    }
    
    if (!gameStarted) {
      startGame();
      return;
    }
    
    if (!gameOver) {
      birdRef.current.velocity = JUMP_FORCE;
      birdRef.current.rotation = -20; // Rotate bird up when jumping
      birdRef.current.wingUp = true; // Flap wing up on jump
    }
  }, [gameOver, gameStarted, startGame]);
  
  const addPipe = useCallback(() => {
    const minHeight = 40; // Reduced from 50 to make top pipes shorter
    const maxHeight = GAME_HEIGHT - PIPE_GAP - minHeight - GROUND_HEIGHT;
    
    // Make the height distribution favor middle values for easier gameplay
    // This creates more balanced pipe heights instead of extreme ones
    const randomFactor = Math.sin(Math.random() * Math.PI) * 0.7 + 0.5;
    const topHeight = Math.floor(minHeight + randomFactor * (maxHeight - minHeight));
    
    pipesRef.current.push({
      x: GAME_WIDTH,
      topHeight,
      scored: false
    });
  }, []);
  
  const checkCollision = useCallback((bird: { x: number; y: number }, pipes: Array<{ x: number; topHeight: number }>) => {
    // Check if bird hit the ground
    if (bird.y + BIRD_HEIGHT >= GAME_HEIGHT - GROUND_HEIGHT) {
      return true;
    }
    
    // Check if bird hit the ceiling
    if (bird.y <= 0) {
      return true;
    }
    
    // Check if bird hit any pipes - add a small forgiveness margin (3px)
    // This makes the hitbox slightly smaller than the visual representation
    const forgiveness = 3;
    for (const pipe of pipes) {
      // Bird is within pipe's x-range
      if (
        bird.x + BIRD_WIDTH - forgiveness > pipe.x &&
        bird.x + forgiveness < pipe.x + PIPE_WIDTH
      ) {
        // Check if bird hit top pipe
        if (bird.y + forgiveness < pipe.topHeight) {
          return true;
        }
        
        // Check if bird hit bottom pipe
        if (bird.y + BIRD_HEIGHT - forgiveness > pipe.topHeight + PIPE_GAP) {
          return true;
        }
      }
    }
    
    return false;
  }, []);
  
  const updateScore = useCallback(() => {
    for (const pipe of pipesRef.current) {
      if (!pipe.scored && pipe.x + PIPE_WIDTH < birdRef.current.x) {
        pipe.scored = true;
        scoreRef.current += 1; // Update score ref immediately
        
        // Check for new high score
        if (scoreRef.current > highScore) {
          setHighScore(scoreRef.current);
          localStorage.setItem('flappyBirdHighScore', scoreRef.current.toString());
        }
      }
    }
  }, [highScore]);
  
  const gameLoop = useCallback((timestamp: number) => {
    if (!canvasRef.current || !gameStarted || gameOver) return;
    
    const ctx = canvasRef.current.getContext('2d')!;
    const deltaTime = timestamp - (lastFrameTimeRef.current || timestamp);
    lastFrameTimeRef.current = timestamp;
    
    // Clear canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw sky background with gradient and clouds
    drawSky(ctx);
    
    // Add new pipe every 2.5 seconds (increased from 1.5s to give more time between pipes)
    if (timestamp - lastPipeTimeRef.current > 2500) {
      addPipe();
      lastPipeTimeRef.current = timestamp;
    }
    
    // Update bird position
    birdRef.current.velocity += GRAVITY;
    birdRef.current.y += birdRef.current.velocity;
    
    // Add a velocity cap to prevent the bird from falling too fast
    if (birdRef.current.velocity > 8) {
      birdRef.current.velocity = 8;
    }
    
    // Update bird rotation based on velocity
    if (birdRef.current.velocity > 0) {
      birdRef.current.rotation += 2;
      if (birdRef.current.rotation > 70) {
        birdRef.current.rotation = 70;
      }
    }
    
    // Animate bird wings
    birdRef.current.wingCounter += deltaTime;
    if (birdRef.current.wingCounter > 150) {
      birdRef.current.wingUp = !birdRef.current.wingUp;
      birdRef.current.wingCounter = 0;
    }
    
    // Check for collisions
    if (checkCollision(birdRef.current, pipesRef.current)) {
      setGameOver(true);
      return;
    }
    
    // Update score - moved before drawing to ensure the latest score is displayed
    updateScore();
    
    // Update ground offset for animation
    groundOffsetRef.current = (groundOffsetRef.current + PIPE_SPEED) % 20;
    
    // Draw and update pipes
    for (let i = 0; i < pipesRef.current.length; i++) {
      const pipe = pipesRef.current[i];
      
      // Move pipe
      pipe.x -= PIPE_SPEED;
      
      // Draw pipes with enhanced graphics
      drawPipe(ctx, pipe.x, pipe.topHeight, true); // Top pipe
      drawPipe(ctx, pipe.x, pipe.topHeight, false); // Bottom pipe
      
      // Remove pipes that are off screen
      if (pipe.x + PIPE_WIDTH < 0) {
        pipesRef.current.splice(i, 1);
        i--;
      }
    }
    
    // Draw ground with animation
    drawGround(ctx, groundOffsetRef.current);
    
    // Draw bird with enhanced graphics
    drawBird(ctx, birdRef.current);
    
    // Draw score with shadow and glow effect
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    drawText(ctx, `Score: ${scoreRef.current}`, GAME_WIDTH / 2, 40, 24, COLORS.text.score);
    ctx.restore();
    
    // Continue game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [addPipe, checkCollision, drawBird, drawGround, drawPipe, drawSky, drawText, gameOver, gameStarted, updateScore]);
  
  // Draw initial screen and handle game over screen
  const drawGameOverScreen = useCallback(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d')!;
    
    // Draw sky background
    drawSky(ctx);
    
    // Draw ground
    drawGround(ctx, 0);
    
    // Draw bird in current position
    drawBird(ctx, birdRef.current);
    
    // Draw pipes in their current positions
    for (const pipe of pipesRef.current) {
      drawPipe(ctx, pipe.x, pipe.topHeight, true);
      drawPipe(ctx, pipe.x, pipe.topHeight, false);
    }
    
    // Draw semi-transparent overlay
    ctx.fillStyle = COLORS.ui.overlay;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw game over text and score
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    drawText(ctx, 'Game Over', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, 32);
    drawText(ctx, `Score: ${scoreRef.current}`, GAME_WIDTH / 2, GAME_HEIGHT / 2, 24, COLORS.text.score);
    
    // Show high score
    if (scoreRef.current >= highScore) {
      drawText(ctx, 'New High Score!', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30, 18, '#ffeb3b');
    } else {
      drawText(ctx, `High Score: ${highScore}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30, 18);
    }
    
    drawText(ctx, 'Tap to Play Again', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 70, 16);
    ctx.restore();
  }, [drawBird, drawGround, drawPipe, drawSky, drawText, highScore]);
  
  const drawInitialScreen = useCallback(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d')!;
    
    // Draw sky background
    drawSky(ctx);
    
    // Draw ground
    drawGround(ctx, 0);
    
    // Draw bird in initial position
    drawBird(ctx, birdRef.current);
    
    // Draw start text with shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    if (!gameOver) {
      drawText(ctx, 'Tap to Start', GAME_WIDTH / 2, GAME_HEIGHT / 2, 24);
      
      // Draw high score
      if (highScore > 0) {
        drawText(ctx, `High Score: ${highScore}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, 16);
      }
    }
    
    ctx.restore();
  }, [drawBird, drawGround, drawSky, drawText, gameOver, highScore]);
  
  // Set up canvas and game
  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      // Set canvas dimensions to our fixed game size
      canvasRef.current.width = GAME_WIDTH;
      canvasRef.current.height = GAME_HEIGHT;
      
      // Calculate and apply the scale to maintain aspect ratio
      const updateCanvasScale = () => {
        if (containerRef.current && canvasRef.current) {
          const containerWidth = containerRef.current.clientWidth;
          const containerHeight = containerRef.current.clientHeight;
          
          // Calculate the scale factor to fit the game in the container
          // while maintaining aspect ratio
          const scaleX = containerWidth / GAME_WIDTH;
          const scaleY = containerHeight / GAME_HEIGHT;
          const newScale = Math.min(scaleX, scaleY);
          
          // Apply the scale
          setScale(newScale);
        }
      };
      
      // Initial setup
      updateCanvasScale();
      drawInitialScreen();
      
      // Handle window resize
      window.addEventListener('resize', updateCanvasScale);
      
      return () => {
        window.removeEventListener('resize', updateCanvasScale);
        cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [drawInitialScreen]);
  
  // Handle game state changes
  useEffect(() => {
    if (gameStarted && !gameOver) {
      lastPipeTimeRef.current = performance.now();
      lastFrameTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else if (gameOver) {
      // Make sure we draw the game over screen
      drawGameOverScreen();
    }
    
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameStarted, gameOver, gameLoop, drawGameOverScreen]);
  
  return (
    <motion.div
      initial={{ scale: 1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1, opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div 
        ref={containerRef} 
        className="w-full h-full flex items-center justify-center"
      >
        <canvas
          ref={canvasRef}
          onClick={jump}
          className="touch-none"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center',
            maxWidth: '100%',
            maxHeight: '100%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            borderRadius: '8px'
          }}
        />
      </div>
    </motion.div>
  );
};

export default FlappyBird;