import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  type: 'heart' | 'petal' | 'sparkle' | 'bokeh';
  wobbleSpeed: number;
  wobbleAmp: number;
}

const ROMANTIC_PALETTE = [
  '#F43F5E', // Rose 500
  '#FB7185', // Rose 400
  '#EC4899', // Pink 500
  '#F472B6', // Pink 400
  '#FDA4AF', // Rose 300
  '#FDE047', // Warm gold
  '#FBBF24', // Amber
  '#E879F9', // Soft fuchsia
];

const BOKEH_COLORS = [
  'rgba(254, 215, 170, 0.35)', // Warm peach
  'rgba(251, 113, 133, 0.28)', // Soft rose
  'rgba(244, 114, 182, 0.25)', // Sweet pink
  'rgba(253, 224, 71, 0.25)',  // Warm amber
  'rgba(232, 121, 249, 0.20)', // Lavender mist
];

export const FloatingHearts: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    // Rich count calibrated for smooth 60fps performance across devices
    const particleCount = Math.min(Math.floor(window.innerWidth / 22), 55);

    const createParticle = (initialY?: number, isClickBurst = false): Particle => {
      const types: ('heart' | 'petal' | 'sparkle' | 'bokeh')[] = [
        'heart', 'heart', 'heart', 'petal', 'petal', 'sparkle', 'bokeh'
      ];
      const type = isClickBurst ? (Math.random() > 0.3 ? 'heart' : 'sparkle') : types[Math.floor(Math.random() * types.length)];

      let size: number;
      let speedY: number;
      let opacity: number;

      if (type === 'bokeh') {
        size = Math.random() * 45 + 30; // Large soft bokeh circles
        speedY = (Math.random() * 0.35 + 0.15); // Very slow drift
        opacity = Math.random() * 0.35 + 0.15;
      } else if (type === 'petal') {
        size = Math.random() * 12 + 8;
        speedY = -(Math.random() * 0.7 + 0.4); // Gently drifting down
        opacity = Math.random() * 0.4 + 0.45;
      } else if (type === 'sparkle') {
        size = Math.random() * 8 + 6;
        speedY = (Math.random() * 0.6 + 0.2);
        opacity = Math.random() * 0.5 + 0.4;
      } else {
        // Heart
        size = Math.random() * 16 + 10;
        speedY = (Math.random() * 0.9 + 0.4);
        opacity = Math.random() * 0.45 + 0.45;
      }

      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : Math.random() * height,
        size,
        speedY,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity,
        color: type === 'bokeh'
          ? BOKEH_COLORS[Math.floor(Math.random() * BOKEH_COLORS.length)]
          : ROMANTIC_PALETTE[Math.floor(Math.random() * ROMANTIC_PALETTE.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        type,
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        wobbleAmp: Math.random() * 0.8 + 0.4,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    // 1. Draw Heart with soft shadow and rich gradient
    const drawHeart = (x: number, y: number, size: number, color: string, opacity: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;

      // Soft glow
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, -size / 2, -size, topCurveHeight / 3, 0, size);
      ctx.bezierCurveTo(size, topCurveHeight / 3, size / 2, -size / 2, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // 2. Draw Fluttering Flower / Rose Petal
    const drawPetal = (x: number, y: number, size: number, color: string, opacity: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;

      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.5, size, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // 3. Draw Twinkling Golden Star / Sparkle
    const drawSparkle = (x: number, y: number, size: number, color: string, opacity: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 10;

      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(Math.cos(((18 + i * 90) * Math.PI) / 180) * size, -Math.sin(((18 + i * 90) * Math.PI) / 180) * size);
        ctx.lineTo(Math.cos(((63 + i * 90) * Math.PI) / 180) * (size / 3), -Math.sin(((63 + i * 90) * Math.PI) / 180) * (size / 3));
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // 4. Draw Soft Bokeh Light Orb
    const drawBokeh = (x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.6, color.replace(/[\d.]+\)$/g, '0.15)'));
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        if (p.type === 'petal') {
          p.y -= p.speedY; // Petals fall downwards
          if (p.y > height + 30) {
            particles[idx] = createParticle(-20);
          }
        } else {
          p.y -= p.speedY; // Hearts, sparkles, bokeh float upwards
          if (p.y < -50) {
            particles[idx] = createParticle(height + 30);
          }
        }

        p.x += Math.sin(p.y * p.wobbleSpeed) * p.wobbleAmp + p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.type === 'heart') {
          drawHeart(p.x, p.y, p.size, p.color, p.opacity, p.rotation);
        } else if (p.type === 'petal') {
          drawPetal(p.x, p.y, p.size, p.color, p.opacity, p.rotation);
        } else if (p.type === 'sparkle') {
          drawSparkle(p.x, p.y, p.size, p.color, p.opacity, p.rotation);
        } else {
          drawBokeh(p.x, p.y, p.size, p.color, p.opacity);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Celebratory Heart & Sparkle Burst on Click anywhere!
    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 7; i++) {
        const p = createParticle(e.clientY, true);
        p.x = e.clientX + (Math.random() - 0.5) * 40;
        p.speedY = Math.random() * 2.5 + 1.2;
        p.speedX = (Math.random() - 0.5) * 3;
        p.size = Math.random() * 18 + 12;
        p.opacity = 0.95;
        particles.push(p);
        if (particles.length > particleCount + 30) {
          particles.shift();
        }
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ opacity: 0.9 }}
    />
  );
};
