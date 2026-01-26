"use client";

import { useRef, useState, ReactNode, MouseEvent } from "react";
import { motion } from "framer-motion";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number; // 0.1 to 0.5 typically (higher = more pull)
  radius?: number; // Detection radius in pixels
}

const Magnetic = ({
  children,
  className = "",
  strength = 0.3,
  radius = 100,
}: MagneticProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < radius) {
      // Apply magnetic pull based on distance
      // As distance gets smaller (closer to center), movement follows cursor more closely
      const pull = 1 - distance / radius; // 1 at center, 0 at radius edge (linear falloff)

      // We want the element to move TOWARDS the cursor.
      // e.clientX is cursor. centerX is element.
      // distanceX is vector from center to cursor.
      setPosition({
        x: distanceX * strength,
        y: distanceY * strength,
      });
    } else {
      // Reset if went out of radius rapidly
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={`relative inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      {children}
    </motion.div>
  );
};

export default Magnetic;
