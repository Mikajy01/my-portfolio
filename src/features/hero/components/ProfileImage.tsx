import React, { useEffect, useRef } from 'react';

export const ProfileImage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    // Créer des particules
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dessiner et animer les particules
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${particle.opacity})`;
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Rebondir sur les bords
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
      {/* Canvas pour les particules */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
      />

      {/* Cercles décoratifs animés */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full border-2 border-primary opacity-20 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute w-[90%] h-[90%] rounded-full border-2 border-secondary opacity-20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
      </div>

      {/* Container de l'image */}
      <div className="relative z-10 rounded-full overflow-hidden border-4 border-primary glow-effect-lg aspect-square">
        <div className="absolute inset-0 bg-gradient-primary opacity-20" />
        
        
        {/* Décommentez et utilisez cette ligne quand vous aurez votre photo */}
        <img 
          src="images/profile_picture.png" 
          alt="RATSIMBAZAFY Mikajisoa Selly-Rafaj" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Effet de lueur */}
      <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 blur-3xl -z-10" />
    </div>
  );
};