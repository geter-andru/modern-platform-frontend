'use client';

import { motion } from 'framer-motion';

interface AnimatedOrbProps {
  className: string;
  style: React.CSSProperties;
  animate: any;
  transition: any;
}

export default function AnimatedOrb({ className, style, animate, transition }: AnimatedOrbProps) {
  return (
    <motion.div
      className={className}
      style={style}
      animate={animate}
      transition={transition}
    />
  );
}
