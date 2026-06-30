import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// Game constants
const GRAVITY = 0.1; // Reduced from 0.5 to make the bird fall more slowly
const JUMP_FORCE = -4; // Reduced from -8 to make jumps more gentle
const PIPE_WIDTH = 64;
const PIPE_GAP = 180; // Increased from 150 to make gaps between pipes larger
const PIPE_SPEED = 1.5; // Reduced from 2 to make pipes move slower
const BIRD_WIDTH = 32;
const BIRD_HEIGHT = 26;
const GROUND_HEIGHT = 56;

// Game dimensions - maintain a fixed aspect ratio
const GAME_WIDTH = 320;
const GAME_HEIGHT = 480;

// Initial bird position - start higher in the screen
const INITIAL_BIRD_X = 80; // Moved further right to give more reaction time
const INITIAL_BIRD_Y = 200; // Start in the middle of the screen

// Modern color palette
const COLORS = {
  sky: {
    top: '#5eead4',    // Soft teal at the top
    mid: '#38bdf8',    // Sky blue
    bottom: '#6366f1', // Soft indigo glow near the horizon
  },
  sun: 'rgba(255, 255, 255, 0.85)',
  hills: {
    far: 'rgba(255, 255, 255, 0.14)',
    near: 'rgba(255, 255, 255, 0.22)',
  },
  bird: {
    top: '#fde68a',    // Light amber (top of body)
    bottom: '#f59e0b', // Deeper amber (bottom of body)
    belly: '#fffbeb',  // Soft cream belly
    eye: '#1f2937',    // Charcoal eye
    beak: '#fb7185',   // Coral beak
    wing: '#fbbf24',   // Wing tone
  },
  pipe: {
    main: '#10b981',      // Emerald
    highlight: '#6ee7b7', // Light mint highlight
    shadow: '#047857',    // Deep emerald shadow
    cap: '#059669',       // Cap base
  },
  ground: {
    top: '#fcd34d',    // Warm sand top edge
    bottom: '#f59e0b', // Deeper sand
    grass: '#34d399',  // Grass strip
  },
  particle: 'rgba(255, 255, 255, 0.9)',
  text: {
    main: '#ffffff',
    muted: 'rgba(255, 255, 255, 0.75)',
    score: '#ffffff',
  },
};

// Soft cloud positions for parallax background
const CLOUDS = [
  { x: 40, y: 70, size: 26, speed: 0.15 },
  { x: 170, y: 110, size: 34, speed: 0.1 },
  { x: 270, y: 60, size: 22, speed: 0.2 },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface FlappyBirdProps {
  onClose: () => void;
  onGameStateChange?: (isPlaying: boolean) => void;
}

const FlappyBird: React.FC<FlappyBirdProps> = ({ onGameStateChange }) => {
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
    rotation: 0,
    wingUp: false,
    wingCounter: 0,
  });

  const pipesRef = useRef<Array<{
    x: number;
    topHeight: number;
    scored: boolean;
  }>>([]);

  // Particles for flap + score feedback
  const particlesRef = useRef<Particle[]>([]);

  // Background scroll offsets for parallax
  const cloudOffsetRef = useRef(0);
  const hillOffsetRef = useRef(0);

  // Use a ref for the score to ensure synchronous updates
  const scoreRef = useRef(0);

  const animationFrameRef = useRef<number>(0);
  const lastPipeTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const groundOffsetRef = useRef(0);
  const timeRef = useRef(0);

  // Helper: rounded rectangle path
  const roundRect = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ) => {
    const radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }, []);

  const spawnParticles = useCallback((x: number, y: number, count: number, spread: number) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * spread;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        life: 1,
        maxLife: 1,
        size: 2 + Math.random() * 2.5,
      });
    }
  }, []);

  const drawCloud = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.arc(x + size * 0.6, y - size * 0.4, size * 0.75, 0, Math.PI * 2);
    ctx.arc(x + size * 1.2, y, size * 0.85, 0, Math.PI * 2);
    ctx.arc(x + size * 1.8, y, size * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, []);

  // Soft rolling hill silhouettes for depth
  const drawHill = useCallback((
    ctx: CanvasRenderingContext2D,
    offset: number,
    baseY: number,
    amplitude: number,
    color: string,
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, GAME_HEIGHT);
    for (let x = 0; x <= GAME_WIDTH; x += 8) {
      const y = baseY + Math.sin((x + offset) * 0.02) * amplitude;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(GAME_WIDTH, GAME_HEIGHT);
    ctx.closePath();
    ctx.fill();
  }, []);

  const drawBird = useCallback((ctx: CanvasRenderingContext2D, bird: typeof birdRef.current) => {
    ctx.save();
    ctx.translate(bird.x + BIRD_WIDTH / 2, bird.y + BIRD_HEIGHT / 2);
    ctx.rotate((bird.rotation * Math.PI) / 180);

    // Soft drop shadow under the bird
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    // Body with vertical gradient
    const bodyGradient = ctx.createLinearGradient(0, -BIRD_HEIGHT / 2, 0, BIRD_HEIGHT / 2);
    bodyGradient.addColorStop(0, COLORS.bird.top);
    bodyGradient.addColorStop(1, COLORS.bird.bottom);
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_WIDTH / 2, BIRD_HEIGHT / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cream belly
    ctx.fillStyle = COLORS.bird.belly;
    ctx.beginPath();
    ctx.ellipse(-2, 5, BIRD_WIDTH / 3.2, BIRD_HEIGHT / 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    ctx.fillStyle = COLORS.bird.wing;
    ctx.beginPath();
    if (bird.wingUp) {
      ctx.ellipse(-3, -4, 9, 5, Math.PI / 5, 0, Math.PI * 2);
    } else {
      ctx.ellipse(-3, 4, 9, 5, -Math.PI / 5, 0, Math.PI * 2);
    }
    ctx.fill();

    // Eye white + pupil
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(8, -4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.bird.eye;
    ctx.beginPath();
    ctx.arc(9.5, -4, 2.6, 0, Math.PI * 2);
    ctx.fill();
    // Eye glint
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(8.5, -5, 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Beak (rounded coral)
    ctx.fillStyle = COLORS.bird.beak;
    roundRect(ctx, 12, -3, 9, 7, 2.5);
    ctx.fill();

    ctx.restore();
  }, [roundRect]);

  const drawPipe = useCallback((ctx: CanvasRenderingContext2D, x: number, height: number, isTop: boolean) => {
    const capHeight = 22;
    const capWidth = PIPE_WIDTH + 10;
    const bodyRadius = 6;

    // Body gradient (left highlight -> right shadow for a glossy tube feel)
    const gradient = ctx.createLinearGradient(x, 0, x + PIPE_WIDTH, 0);
    gradient.addColorStop(0, COLORS.pipe.highlight);
    gradient.addColorStop(0.25, COLORS.pipe.main);
    gradient.addColorStop(0.85, COLORS.pipe.main);
    gradient.addColorStop(1, COLORS.pipe.shadow);

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 2;

    ctx.fillStyle = gradient;
    if (isTop) {
      // Body
      roundRect(ctx, x, -20, PIPE_WIDTH, height + 20 - capHeight + 4, bodyRadius);
      ctx.fill();
      // Cap
      roundRect(ctx, x - 5, height - capHeight, capWidth, capHeight, 7);
      ctx.fill();
    } else {
      const bottomY = height + PIPE_GAP;
      const bodyLen = GAME_HEIGHT - bottomY - GROUND_HEIGHT + 40;
      // Body
      roundRect(ctx, x, bottomY + capHeight - 4, PIPE_WIDTH, bodyLen, bodyRadius);
      ctx.fill();
      // Cap
      roundRect(ctx, x - 5, bottomY, capWidth, capHeight, 7);
      ctx.fill();
    }
    ctx.restore();

    // Glossy vertical highlight stripe
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(x + 8, isTop ? -20 : height + PIPE_GAP + capHeight, 5, isTop ? height + 10 : GAME_HEIGHT);
  }, [roundRect]);

  const drawGround = useCallback((ctx: CanvasRenderingContext2D, offset: number) => {
    const groundY = GAME_HEIGHT - GROUND_HEIGHT;

    // Grass strip
    ctx.fillStyle = COLORS.ground.grass;
    ctx.fillRect(0, groundY, GAME_WIDTH, 8);

    // Sand gradient
    const gradient = ctx.createLinearGradient(0, groundY + 8, 0, GAME_HEIGHT);
    gradient.addColorStop(0, COLORS.ground.top);
    gradient.addColorStop(1, COLORS.ground.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, groundY + 8, GAME_WIDTH, GROUND_HEIGHT - 8);

    // Subtle moving dash texture
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (let i = 0; i < GAME_WIDTH + 30; i += 30) {
      const x = ((i + offset) % (GAME_WIDTH + 30)) - 30;
      ctx.beginPath();
      ctx.moveTo(x, groundY + 24);
      ctx.lineTo(x + 14, groundY + 24);
      ctx.stroke();
    }
  }, []);

  const drawSky = useCallback((ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    gradient.addColorStop(0, COLORS.sky.top);
    gradient.addColorStop(0.55, COLORS.sky.mid);
    gradient.addColorStop(1, COLORS.sky.bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Soft sun glow
    const sun = ctx.createRadialGradient(250, 90, 8, 250, 90, 70);
    sun.addColorStop(0, COLORS.sun);
    sun.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sun;
    ctx.beginPath();
    ctx.arc(250, 90, 70, 0, Math.PI * 2);
    ctx.fill();

    // Parallax hills
    drawHill(ctx, hillOffsetRef.current * 0.5, GAME_HEIGHT - GROUND_HEIGHT - 40, 18, COLORS.hills.far);
    drawHill(ctx, hillOffsetRef.current, GAME_HEIGHT - GROUND_HEIGHT - 10, 26, COLORS.hills.near);

    // Drifting clouds
    CLOUDS.forEach((cloud) => {
      const x = ((cloud.x - cloudOffsetRef.current * cloud.speed) % (GAME_WIDTH + 80) + (GAME_WIDTH + 80)) % (GAME_WIDTH + 80) - 40;
      drawCloud(ctx, x, cloud.y, cloud.size);
    });
  }, [drawCloud, drawHill]);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    for (const p of particlesRef.current) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = COLORS.particle;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }, []);

  const updateParticles = useCallback(() => {
    const arr = particlesRef.current;
    for (let i = arr.length - 1; i >= 0; i--) {
      const p = arr[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.life -= 0.025;
      if (p.life <= 0) arr.splice(i, 1);
    }
  }, []);

  // Modern score display (large, centered, with soft shadow)
  const drawScore = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.font = '700 44px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = COLORS.text.score;
    ctx.fillText(`${scoreRef.current}`, GAME_WIDTH / 2, 64);
    ctx.restore();
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
      birdRef.current = {
        x: INITIAL_BIRD_X,
        y: INITIAL_BIRD_Y,
        velocity: 0,
        rotation: 0,
        wingUp: false,
        wingCounter: 0,
      };
      pipesRef.current = [];
      particlesRef.current = [];
      scoreRef.current = 0;
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
      birdRef.current.rotation = -22;
      birdRef.current.wingUp = true;
      // Flap puff of particles behind the bird
      spawnParticles(birdRef.current.x, birdRef.current.y + BIRD_HEIGHT / 2, 4, 1.5);
    }
  }, [gameOver, gameStarted, startGame, spawnParticles]);

  const addPipe = useCallback(() => {
    const minHeight = 40;
    const maxHeight = GAME_HEIGHT - PIPE_GAP - minHeight - GROUND_HEIGHT;
    const randomFactor = Math.sin(Math.random() * Math.PI) * 0.7 + 0.5;
    const topHeight = Math.floor(minHeight + randomFactor * (maxHeight - minHeight));
    pipesRef.current.push({ x: GAME_WIDTH, topHeight, scored: false });
  }, []);

  const checkCollision = useCallback((bird: { x: number; y: number }, pipes: Array<{ x: number; topHeight: number }>) => {
    if (bird.y + BIRD_HEIGHT >= GAME_HEIGHT - GROUND_HEIGHT) return true;
    if (bird.y <= 0) return true;

    const forgiveness = 4;
    for (const pipe of pipes) {
      if (
        bird.x + BIRD_WIDTH - forgiveness > pipe.x &&
        bird.x + forgiveness < pipe.x + PIPE_WIDTH
      ) {
        if (bird.y + forgiveness < pipe.topHeight) return true;
        if (bird.y + BIRD_HEIGHT - forgiveness > pipe.topHeight + PIPE_GAP) return true;
      }
    }
    return false;
  }, []);

  const updateScore = useCallback(() => {
    for (const pipe of pipesRef.current) {
      if (!pipe.scored && pipe.x + PIPE_WIDTH < birdRef.current.x) {
        pipe.scored = true;
        scoreRef.current += 1;
        // Celebratory particles at the bird
        spawnParticles(birdRef.current.x + BIRD_WIDTH / 2, birdRef.current.y + BIRD_HEIGHT / 2, 8, 2.5);
        if (scoreRef.current > highScore) {
          setHighScore(scoreRef.current);
          localStorage.setItem('flappyBirdHighScore', scoreRef.current.toString());
        }
      }
    }
  }, [highScore, spawnParticles]);

  const gameLoop = useCallback((timestamp: number) => {
    if (!canvasRef.current || !gameStarted || gameOver) return;

    const ctx = canvasRef.current.getContext('2d')!;
    const deltaTime = timestamp - (lastFrameTimeRef.current || timestamp);
    lastFrameTimeRef.current = timestamp;
    timeRef.current += deltaTime;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Parallax background scroll
    cloudOffsetRef.current += PIPE_SPEED;
    hillOffsetRef.current += PIPE_SPEED;
    drawSky(ctx);

    if (timestamp - lastPipeTimeRef.current > 2500) {
      addPipe();
      lastPipeTimeRef.current = timestamp;
    }

    // Update bird
    birdRef.current.velocity += GRAVITY;
    birdRef.current.y += birdRef.current.velocity;
    if (birdRef.current.velocity > 8) birdRef.current.velocity = 8;

    if (birdRef.current.velocity > 0) {
      birdRef.current.rotation += 2;
      if (birdRef.current.rotation > 70) birdRef.current.rotation = 70;
    }

    birdRef.current.wingCounter += deltaTime;
    if (birdRef.current.wingCounter > 150) {
      birdRef.current.wingUp = !birdRef.current.wingUp;
      birdRef.current.wingCounter = 0;
    }

    if (checkCollision(birdRef.current, pipesRef.current)) {
      // Impact burst
      spawnParticles(birdRef.current.x + BIRD_WIDTH / 2, birdRef.current.y + BIRD_HEIGHT / 2, 16, 3.5);
      setGameOver(true);
      return;
    }

    updateScore();

    groundOffsetRef.current = (groundOffsetRef.current + PIPE_SPEED) % 30;

    // Pipes
    for (let i = 0; i < pipesRef.current.length; i++) {
      const pipe = pipesRef.current[i];
      pipe.x -= PIPE_SPEED;
      drawPipe(ctx, pipe.x, pipe.topHeight, true);
      drawPipe(ctx, pipe.x, pipe.topHeight, false);
      if (pipe.x + PIPE_WIDTH < 0) {
        pipesRef.current.splice(i, 1);
        i--;
      }
    }

    drawGround(ctx, groundOffsetRef.current);

    updateParticles();
    drawParticles(ctx);

    drawBird(ctx, birdRef.current);
    drawScore(ctx);

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [addPipe, checkCollision, drawBird, drawGround, drawParticles, drawPipe, drawScore, drawSky, gameOver, gameStarted, spawnParticles, updateParticles, updateScore]);

  // Glassmorphism panel helper for overlays
  const drawGlassPanel = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
    roundRect(ctx, x, y, w, h, 22);
    ctx.fill();
    ctx.restore();

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, w, h, 22);
    ctx.stroke();
  }, [roundRect]);

  const drawPillButton = useCallback((ctx: CanvasRenderingContext2D, cx: number, y: number, label: string) => {
    const w = 180;
    const h = 46;
    const x = cx - w / 2;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, x, y, w, h, h / 2);
    ctx.fill();
    ctx.restore();

    ctx.font = '700 17px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0f766e';
    ctx.fillText(label, cx, y + h / 2 + 1);
  }, [roundRect]);

  const drawGameOverScreen = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;

    drawSky(ctx);
    for (const pipe of pipesRef.current) {
      drawPipe(ctx, pipe.x, pipe.topHeight, true);
      drawPipe(ctx, pipe.x, pipe.topHeight, false);
    }
    drawGround(ctx, groundOffsetRef.current);
    drawBird(ctx, birdRef.current);

    // Dim backdrop
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Glass card
    const panelW = 240;
    const panelH = 230;
    const panelX = (GAME_WIDTH - panelW) / 2;
    const panelY = (GAME_HEIGHT - panelH) / 2 - 10;
    drawGlassPanel(ctx, panelX, panelY, panelW, panelH);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    ctx.font = '700 28px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial';
    ctx.fillStyle = COLORS.text.main;
    ctx.fillText('Game Over', GAME_WIDTH / 2, panelY + 48);

    const isNewHigh = scoreRef.current >= highScore && scoreRef.current > 0;
    ctx.font = '700 52px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial';
    ctx.fillStyle = COLORS.text.main;
    ctx.fillText(`${scoreRef.current}`, GAME_WIDTH / 2, panelY + 108);

    ctx.font = '600 14px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial';
    ctx.fillStyle = COLORS.text.muted;
    if (isNewHigh) {
      ctx.fillStyle = '#fde68a';
      ctx.fillText('New High Score!', GAME_WIDTH / 2, panelY + 134);
    } else {
      ctx.fillText(`Best  ${highScore}`, GAME_WIDTH / 2, panelY + 134);
    }

    drawPillButton(ctx, GAME_WIDTH / 2, panelY + 156, 'Play Again');
  }, [drawBird, drawGlassPanel, drawGround, drawPillButton, drawPipe, drawSky, highScore]);

  const drawInitialScreen = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;

    drawSky(ctx);
    drawGround(ctx, 0);
    drawBird(ctx, birdRef.current);

    if (!gameOver) {
      // Glass card
      const panelW = 240;
      const panelH = 150;
      const panelX = (GAME_WIDTH - panelW) / 2;
      const panelY = GAME_HEIGHT / 2 - 80;
      drawGlassPanel(ctx, panelX, panelY, panelW, panelH);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';

      ctx.font = '700 26px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial';
      ctx.fillStyle = COLORS.text.main;
      ctx.fillText('Flappy Bird', GAME_WIDTH / 2, panelY + 46);

      ctx.font = '600 14px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial';
      ctx.fillStyle = COLORS.text.muted;
      const subtitle = highScore > 0 ? `Best  ${highScore}` : 'Tap to flap';
      ctx.fillText(subtitle, GAME_WIDTH / 2, panelY + 70);

      drawPillButton(ctx, GAME_WIDTH / 2, panelY + 86, 'Tap to Start');
    }
  }, [drawBird, drawGlassPanel, drawGround, drawPillButton, drawSky, gameOver, highScore]);

  // Set up canvas and game
  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      canvasRef.current.width = GAME_WIDTH;
      canvasRef.current.height = GAME_HEIGHT;

      const updateCanvasScale = () => {
        if (containerRef.current && canvasRef.current) {
          const containerWidth = containerRef.current.clientWidth;
          const containerHeight = containerRef.current.clientHeight;
          const scaleX = containerWidth / GAME_WIDTH;
          const scaleY = containerHeight / GAME_HEIGHT;
          setScale(Math.min(scaleX, scaleY));
        }
      };

      updateCanvasScale();
      drawInitialScreen();

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
      drawGameOverScreen();
    }
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameStarted, gameOver, gameLoop, drawGameOverScreen]);

  // Notify parent component when game is opened
  useEffect(() => {
    onGameStateChange?.(true);
    return () => {
      onGameStateChange?.(false);
    };
  }, [onGameStateChange]);

  return (
    <motion.div
      initial={{ scale: 1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1, opacity: 0 }}
      className="absolute inset-0 z-50 bg-slate-900 flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
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
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
            borderRadius: '16px',
          }}
        />
      </div>
    </motion.div>
  );
};

export default FlappyBird;
