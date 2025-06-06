import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CosmicTransitionProps {
  isActive: boolean;
  onComplete?: () => void;
  type?: 'galaxy' | 'nebula' | 'starfield' | 'portal';
}

export function CosmicTransition({ isActive, onComplete, type = 'galaxy' }: CosmicTransitionProps) {
  const [particles, setParticles] = useState<Array<{ 
    id: number; 
    x: number; 
    y: number; 
    size: number; 
    delay: number;
    speed: number;
    color: string;
  }>>([]);

  useEffect(() => {
    if (isActive) {
      // Generate cosmic particles
      const newParticles = Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 1,
        delay: Math.random() * 0.8,
        speed: Math.random() * 2 + 1,
        color: Math.random() > 0.7 ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
      }));
      setParticles(newParticles);

      // Complete transition after animation
      const timer = setTimeout(() => {
        onComplete?.();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Enhanced Particle Field */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color.replace('0.9', '0.5').replace('0.8', '0.4')}`,
          }}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1.2, 0],
            rotate: [0, 360 * particle.speed],
            x: [0, (Math.random() - 0.5) * 100],
            y: [0, (Math.random() - 0.5) * 100],
          }}
          transition={{
            duration: 2.5,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Cosmic Energy Waves */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-purple-400/20 via-blue-500/10 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-gradient-conic from-purple-600/20 via-blue-600/20 to-purple-600/20 animate-spin" style={{ animationDuration: '4s' }} />
      </motion.div>

      {/* Central Portal Effect */}
      {type === 'portal' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            {/* Outer ring */}
            <motion.div
              className="w-48 h-48 border-4 border-purple-400 rounded-full opacity-60"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Middle ring */}
            <motion.div
              className="absolute inset-4 border-2 border-blue-400 rounded-full opacity-80"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Inner ring */}
            <motion.div
              className="absolute inset-8 border border-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Central glow */}
            <motion.div
              className="absolute inset-12 bg-gradient-radial from-white via-purple-300 to-transparent rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      )}

      {/* Galaxy Spiral Effect */}
      {type === 'galaxy' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative w-72 h-72"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 720 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          >
            {/* Spiral arms */}
            {[0, 72, 144, 216, 288].map((rotation, index) => (
              <motion.div
                key={index}
                className="absolute inset-0 border-l-2 border-purple-400 rounded-full opacity-40"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  borderImage: 'linear-gradient(45deg, transparent, #a855f7, transparent) 1',
                }}
                animate={{ rotate: rotation + 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: index * 0.1,
                }}
              />
            ))}
          </motion.div>
        </div>
      )}

      {/* Shooting Stars */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 50}%`,
            top: `${Math.random() * 50}%`,
          }}
          initial={{
            x: -100,
            y: -100,
            opacity: 0,
          }}
          animate={{
            x: window.innerWidth + 100,
            y: window.innerHeight + 100,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.3,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Energy Waves */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={`wave-${index}`}
            className="absolute w-32 h-32 border border-blue-400 rounded-full opacity-30"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 8, opacity: 0 }}
            transition={{
              duration: 2,
              delay: index * 0.3,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Hook for managing cosmic transitions
export function useCosmicTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<'galaxy' | 'nebula' | 'starfield' | 'portal'>('galaxy');

  const playCosmicSound = (type: string) => {
    // Create subtle cosmic sound effect using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different transition types
      const frequencies = {
        galaxy: [220, 330, 440],
        nebula: [180, 270, 360],
        starfield: [150, 225, 300],
        portal: [100, 200, 400]
      };
      
      const freq = frequencies[type as keyof typeof frequencies] || frequencies.galaxy;
      oscillator.frequency.setValueAtTime(freq[0], audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(freq[1], audioContext.currentTime + 0.5);
      oscillator.frequency.exponentialRampToValueAtTime(freq[2], audioContext.currentTime + 1);
      
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1.5);
    } catch (error) {
      // Silently fail if Web Audio API is not supported
    }
  };

  const triggerTransition = (type: 'galaxy' | 'nebula' | 'starfield' | 'portal' = 'galaxy') => {
    setTransitionType(type);
    setIsTransitioning(true);
    playCosmicSound(type);
  };

  const completeTransition = () => {
    setIsTransitioning(false);
  };

  return {
    isTransitioning,
    transitionType,
    triggerTransition,
    completeTransition,
  };
}

// Cosmic page wrapper with transition effects
interface CosmicPageWrapperProps {
  children: React.ReactNode;
  transitionKey: string;
}

export function CosmicPageWrapper({ children, transitionKey }: CosmicPageWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={transitionKey}
        initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 1.05, rotateY: 10 }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="relative"
      >
        {/* Cosmic glow effect */}
        <motion.div
          className="absolute inset-0 -z-10 bg-gradient-radial from-purple-500/10 via-transparent to-transparent"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {children}
      </motion.div>
    </AnimatePresence>
  );
}