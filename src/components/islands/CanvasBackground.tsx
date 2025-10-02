import { useCallback, useEffect, useRef, useState } from 'react';

interface CanvasBackgroundProps {
  className?: string;
  fallbackColor?: string;
  config?: {
    width?: number;
    height?: number;
    animationSpeed?: number;
    colorPalette?: string[];
  };
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export default function CanvasBackground({
  className = '',
  fallbackColor = 'rgb(251, 113, 133)',
  config = {},
}: CanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  const defaultConfig = {
    width: 800,
    height: 600,
    animationSpeed: 1,
    colorPalette: [
      'rgb(251, 113, 133)', // pink-400
      'rgb(236, 72, 153)', // pink-500
      'rgb(219, 39, 119)', // pink-600
      'rgb(20, 184, 166)', // teal-500
      'rgb(6, 182, 212)', // cyan-500
    ],
    ...config,
  };

  const createParticle = (x?: number, y?: number): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return {} as Particle;

    return {
      x: x ?? Math.random() * canvas.width,
      y: y ?? Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      color:
        defaultConfig.colorPalette[
          Math.floor(Math.random() * defaultConfig.colorPalette.length)
        ],
      alpha: Math.random() * 0.5 + 0.1,
      life: 0,
      maxLife: Math.random() * 200 + 100,
    };
  };

  const initializeParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);

    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = particlesRef.current.filter((particle) => {
      // Update position
      particle.x += particle.vx * defaultConfig.animationSpeed;
      particle.y += particle.vy * defaultConfig.animationSpeed;
      particle.life++;

      // Fade out over time
      particle.alpha = Math.max(0, 1 - particle.life / particle.maxLife);

      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      return particle.life < particle.maxLife;
    });

    // Add new particles occasionally
    if (Math.random() < 0.02 && particlesRef.current.length < 50) {
      particlesRef.current.push(createParticle());
    }
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    particlesRef.current.forEach((particle) => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      // Add a subtle glow effect
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = particle.size * 2;
      ctx.fill();
      ctx.restore();
    });

    // Draw connections between nearby particles
    ctx.save();
    ctx.strokeStyle = fallbackColor;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.1;

    for (let i = 0; i < particlesRef.current.length; i++) {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const dx = particlesRef.current[i].x - particlesRef.current[j].x;
        const dy = particlesRef.current[i].y - particlesRef.current[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
          ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx || !isVisible) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    updateParticles();
    drawParticles(ctx);

    animationRef.current = requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    // Add particles near mouse occasionally
    if (Math.random() < 0.3) {
      particlesRef.current.push(
        createParticle(mouseRef.current.x, mouseRef.current.y)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeParticles();
  }, [initializeParticles]);

  const handleVisibilityChange = () => {
    setIsVisible(!document.hidden);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set initial size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    initializeParticles();

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Event listeners
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [animate, handleMouseMove, handleResize, initializeParticles]);

  // Pause/resume based on visibility
  useEffect(() => {
    if (!animationRef.current && isVisible) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isVisible, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={`canvas-background pointer-events-none fixed inset-0 z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
