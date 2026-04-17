import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '@/context/theme-provider';

interface Sprinkle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;
  hue: number;
  saturation: number;
  lightness: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  opacity: number;
  gravity: number;
  wind: number;
  flickerSpeed: number;
  phase: number;
}

const MagicCursor = () => {
  const { theme } = useTheme();
  const cursorRef = useRef<HTMLDivElement>(null);
  const sprinklesCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const sprinkles = useRef<Sprinkle[]>([]);
  const sprinkleTimer = useRef<number | null>(null);
  const lastClickTime = useRef<number>(0);
  const clickCooldown = 300; // ms between sprinkle bursts

  // Create realistic sprinkle particle
  const createSprinkle = useCallback((x: number, y: number, isClick: boolean = false): Sprinkle => {
    const isGold = Math.random() > 0.4;
    const isStarShaped = Math.random() > 0.5;
    
    return {
      x: x + (Math.random() - 0.5) * 15,
      y: y + (Math.random() - 0.5) * 15,
      size: isClick ? 
        Math.random() * 5 + 3 : // Larger for clicks
        Math.random() * 3 + 1.5, // Smaller for movement
      speedX: (Math.random() - 0.5) * 2.5,
      speedY: (Math.random() - 0.5) * 1 - 1.5, // Upward initial velocity
      life: 0,
      maxLife: Math.random() * 80 + 120, // Longer life for falling effect
      hue: isGold ? 
        Math.random() * 10 + 40 : // Gold/Yellow range: 40-50
        Math.random() * 20 + 270, // Purple range: 270-290
      saturation: 0.8 + Math.random() * 0.2,
      lightness: 0.6 + Math.random() * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      scale: 1,
      opacity: 0.9 + Math.random() * 0.1,
      gravity: 0.08 + Math.random() * 0.05,
      wind: (Math.random() - 0.5) * 0.03,
      flickerSpeed: 3 + Math.random() * 5,
      phase: Math.random() * Math.PI * 2,
    };
  }, []);

  // Create sprinkle burst on click
  const createClickBurst = useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - lastClickTime.current < clickCooldown) return;
    lastClickTime.current = now;
    
    // Create burst of sprinkles
    const sprinkleCount = 18 + Math.floor(Math.random() * 12);
    for (let i = 0; i < sprinkleCount; i++) {
      sprinkles.current.push(createSprinkle(x, y, true));
    }
    
    // Limit total sprinkles
    if (sprinkles.current.length > 200) {
      sprinkles.current = sprinkles.current.slice(-150);
    }
  }, [createSprinkle]);

  // Create gentle sprinkle trail on movement
  const createMovementSprinkles = useCallback((x: number, y: number, velocity: { x: number; y: number }) => {
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    if (speed < 2) return; // Only create sprinkles when moving fast enough
    
    const sprinkleCount = Math.min(Math.floor(speed / 5), 3);
    for (let i = 0; i < sprinkleCount; i++) {
      sprinkles.current.push(createSprinkle(
        x + (Math.random() - 0.5) * 10,
        y + (Math.random() - 0.5) * 10,
        false
      ));
    }
    
    // Limit total sprinkles
    if (sprinkles.current.length > 150) {
      sprinkles.current = sprinkles.current.slice(-100);
    }
  }, [createSprinkle]);

  // Draw a star shape
  const drawStar = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    spikes: number,
    rotation: number,
    innerRadiusRatio: number = 0.5
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    ctx.beginPath();
    let rot = Math.PI / 2 * 3;
    ctx.moveTo(0, 0 - radius);
    
    for (let i = 0; i < spikes; i++) {
      // Outer point
      const x = Math.cos(rot) * radius;
      const y = Math.sin(rot) * radius;
      ctx.lineTo(x, y);
      rot += Math.PI / spikes;
      
      // Inner point
      const x2 = Math.cos(rot) * (radius * innerRadiusRatio);
      const y2 = Math.sin(rot) * (radius * innerRadiusRatio);
      ctx.lineTo(x2, y2);
      rot += Math.PI / spikes;
    }
    
    ctx.lineTo(0, 0 - radius);
    ctx.closePath();
    ctx.restore();
  }, []);

  // Draw a sparkle shape (crossed lines)
  const drawSparkle = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rotation: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    // Draw crossed lines
    ctx.lineWidth = size * 0.3;
    ctx.lineCap = 'round';
    
    // Main cross
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(size, 0);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);
    ctx.stroke();
    
    // Diagonal cross
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(-size * 0.7, 0);
    ctx.lineTo(size * 0.7, 0);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.7);
    ctx.lineTo(0, size * 0.7);
    ctx.stroke();
    
    ctx.restore();
  }, []);

  useEffect(() => {
    if (theme !== 'harry-potter') {
      // Remove cursor hiding when not in HP theme
      document.documentElement.style.cursor = '';
      document.body.style.cursor = '';
      return;
    }

    // Hide default cursor for HP theme
    document.documentElement.style.cursor = 'none';
    document.body.style.cursor = 'none';

    const cursor = cursorRef.current;
    const canvas = sprinklesCanvasRef.current;
    if (!cursor || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;
    let lastX = -100;
    let lastY = -100;
    let velocity = { x: 0, y: 0 };
    let mouseDown = false;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      
      // Calculate velocity for sprinkle creation
      velocity.x = x - lastX;
      velocity.y = y - lastY;
      
      lastX = x;
      lastY = y;
      setMousePos({ x, y });

      // Create sprinkles based on movement
      createMovementSprinkles(x, y, velocity);
    };

    const handleMouseDown = (e: MouseEvent) => {
      mouseDown = true;
      setIsClicking(true);
      createClickBurst(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      mouseDown = false;
      setIsClicking(false);
    };

    // Continuous sprinkle creation while mouse is down
    const handleMouseDownContinuous = () => {
      if (mouseDown) {
        createClickBurst(lastX, lastY);
        sprinkleTimer.current = window.setTimeout(handleMouseDownContinuous, 100);
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      // Clear canvas completely - no trails
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw sprinkles
      sprinkles.current = sprinkles.current.filter(sprinkle => {
        // Update physics
        sprinkle.life++;
        sprinkle.speedY += sprinkle.gravity; // Apply gravity
        sprinkle.speedX += sprinkle.wind; // Apply wind
        sprinkle.x += sprinkle.speedX;
        sprinkle.y += sprinkle.speedY;
        sprinkle.rotation += sprinkle.rotationSpeed;
        
        // Calculate life progress (0 to 1)
        const lifeProgress = sprinkle.life / sprinkle.maxLife;
        
        // Scale down over time
        sprinkle.scale = 1 - lifeProgress * 0.5;
        
        // Flickering opacity
        const flicker = Math.sin(sprinkle.life * 0.05 + sprinkle.phase) * 0.15 + 0.85;
        const currentOpacity = sprinkle.opacity * (1 - lifeProgress) * flicker;
        
        // Skip if invisible
        if (currentOpacity <= 0.01) return false;
        
        // Calculate current size
        const currentSize = sprinkle.size * sprinkle.scale;
        
        // Draw sprinkle based on type
        const isStar = Math.sin(sprinkle.life * 0.1) > 0;
        
        if (isStar) {
          // Draw star-shaped sprinkle
          ctx.save();
          ctx.fillStyle = `hsla(${sprinkle.hue}, ${sprinkle.saturation * 100}%, ${sprinkle.lightness * 100}%, ${currentOpacity})`;
          drawStar(ctx, sprinkle.x, sprinkle.y, currentSize, 5, sprinkle.rotation, 0.4 + Math.sin(sprinkle.life * 0.1) * 0.2);
          ctx.fill();
          ctx.restore();
        } else {
          // Draw sparkle-shaped sprinkle
          ctx.save();
          ctx.strokeStyle = `hsla(${sprinkle.hue}, ${sprinkle.saturation * 100}%, ${sprinkle.lightness * 100}%, ${currentOpacity})`;
          drawSparkle(ctx, sprinkle.x, sprinkle.y, currentSize * 0.7, sprinkle.rotation);
          ctx.restore();
        }
        
        // Add subtle glow
        const glowGradient = ctx.createRadialGradient(
          sprinkle.x, sprinkle.y, 0,
          sprinkle.x, sprinkle.y, currentSize * 2
        );
        glowGradient.addColorStop(0, `hsla(${sprinkle.hue}, ${sprinkle.saturation * 100}%, ${sprinkle.lightness * 100}%, ${currentOpacity * 0.3})`);
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(sprinkle.x, sprinkle.y, currentSize * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Remove if out of bounds or dead
        if (sprinkle.life >= sprinkle.maxLife) return false;
        if (sprinkle.x < -50 || sprinkle.x > canvas.width + 50) return false;
        if (sprinkle.y < -50 || sprinkle.y > canvas.height + 50) return false;
        
        return true;
      });

      animationId = requestAnimationFrame(animate);
    };

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);
    
    // Start continuous sprinkle creation on mouse down
    document.addEventListener('mousedown', handleMouseDownContinuous);
    
    // Start animation
    animate();

    return () => {
      // Clean up event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDownContinuous);
      window.removeEventListener('resize', handleResize);
      
      // Stop animation
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      // Clear sprinkle timer
      if (sprinkleTimer.current) {
        clearTimeout(sprinkleTimer.current);
      }
      
      // Restore cursor
      document.documentElement.style.cursor = '';
      document.body.style.cursor = '';
      
      // Clear sprinkles
      sprinkles.current = [];
    };
  }, [theme, createSprinkle, createClickBurst, createMovementSprinkles, drawStar, drawSparkle]);

  if (theme !== 'harry-potter') return null;

  return (
    <>
      <style>
        {`
          .harry-potter * {
            cursor: none !important;
          }
          
          @keyframes wandGlow {
            0%, 100% { 
              filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.8)) 
                      drop-shadow(0 0 4px rgba(251, 191, 36, 0.6));
            }
            50% { 
              filter: drop-shadow(0 0 16px rgba(251, 191, 36, 0.9)) 
                      drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))
                      drop-shadow(0 0 2px rgba(255, 255, 255, 0.5));
            }
          }
          
          @keyframes tipPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-2px); }
          }
          
          @keyframes rotateSlow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      {/* Sprinkles Canvas - NO TRAILS */}
      <canvas
        ref={sprinklesCanvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ 
          zIndex: 9998,
        }}
      />
      
      {/* Magic Wand Cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none transition-all duration-100"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: `translate(-50%, -50%) rotate(-45deg) ${isClicking ? 'scale(0.85)' : 'scale(1)'}`,
          zIndex: 9999,
        }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          className="animate-wandGlow"
          style={{
            animation: 'wandGlow 2s ease-in-out infinite',
          }}
        >
          {/* Wand handle with wood texture */}
          <g transform="translate(15, 22)">
            <rect width="6" height="9" rx="3" fill="#8B4513" />
            <rect width="6" height="9" rx="3" fill="url(#woodGrain)" opacity="0.7" />
            <rect width="6" height="9" rx="3" fill="url(#woodHighlight)" opacity="0.3" />
          </g>
          
          {/* Wand shaft with magical glow */}
          <g transform="translate(18, 4)">
            <line x1="0" y1="0" x2="0" y2="18" 
                  stroke="url(#magicGlow)" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  filter="url(#glowFilter)" />
            <line x1="0" y1="0" x2="0" y2="18" 
                  stroke="#D4AF37" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  opacity="0.9" />
          </g>
          
          {/* Magic tip with animations */}
          <g className="animate-tipPulse" style={{ animation: 'tipPulse 1.5s ease-in-out infinite' }}>
            <g transform="translate(18, 4)">
              {/* Core glow */}
              <circle cx="0" cy="0" r="3.5" fill="url(#coreGlow)" />
              
              {/* Inner light */}
              <circle cx="0" cy="0" r="2" fill="#FFFD9A">
                <animate attributeName="r" values="2;2.3;2" dur="1s" repeatCount="indefinite" />
              </circle>
              
              {/* Sparkle rays */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <g key={i} transform={`rotate(${angle})`} className="animate-float" 
                   style={{ animation: `float ${1 + i * 0.1}s ease-in-out infinite` }}>
                  <rect x="4" y="-0.8" width="5" height="1.6" rx="0.8" fill="#FFD700">
                    <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.2s" begin={`${i * 0.1}s`} repeatCount="indefinite" />
                    <animate attributeName="x" values="4;4.5;4" dur="1.2s" begin={`${i * 0.1}s`} repeatCount="indefinite" />
                  </rect>
                </g>
              ))}
            </g>
          </g>
          
          {/* Floating particles around wand */}
          <g className="animate-rotateSlow" style={{ animation: 'rotateSlow 20s linear infinite' }}>
            <circle cx="14" cy="8" r="1" fill="#FFD700" opacity="0.7">
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;1.3;1" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="22" cy="10" r="0.8" fill="#FFA500" opacity="0.6">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.2s" repeatCount="indefinite" />
              <animate attributeName="cy" values="10;9;10" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="19" cy="2" r="0.6" fill="#FFFFFF" opacity="0.9">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="cx" values="19;19.5;19" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </g>
          
          {/* Gradient Definitions */}
          <defs>
            {/* Wood grain texture */}
            <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="20" height="20">
              <rect width="20" height="20" fill="#A0522D" />
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={i}
                      x1={i * 2.5} y1="0" 
                      x2={i * 2.5 + 10} y2="20"
                      stroke="#8B4513"
                      strokeWidth="0.5"
                      opacity="0.4" />
              ))}
            </pattern>
            
            {/* Wood highlight */}
            <linearGradient id="woodHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#DEB887" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#CD853F" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#8B4513" stopOpacity="0.1" />
            </linearGradient>
            
            {/* Magic glow for shaft */}
            <linearGradient id="magicGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="30%" stopColor="#FFA500" />
              <stop offset="70%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8B4513" />
            </linearGradient>
            
            {/* Core glow for tip */}
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFD9A" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FFD700" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FFA500" stopOpacity="0" />
            </radialGradient>
            
            {/* Glow filter */}
            <filter id="glowFilter">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
    </>
  );
};

export default MagicCursor;