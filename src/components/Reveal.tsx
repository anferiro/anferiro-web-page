'use client';

import { motion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

const ease = [0.2, 0.7, 0.2, 1] as const;

/** Fades and lifts its children in once, when they scroll into view. */
export function Reveal({ children, delay = 0, y = 18, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/** A list whose items arrive one after another. */
export function Stagger({ children, className, as = 'ul' }: { children: ReactNode; className?: string; as?: 'ul' | 'div' }) {
  const Tag = as === 'ul' ? motion.ul : motion.div;
  return (
    <Tag className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -10% 0px' }}>
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, className, as = 'li' }: { children: ReactNode; className?: string; as?: 'li' | 'div' | 'p' }) {
  const Tag = as === 'li' ? motion.li : as === 'p' ? motion.p : motion.div;
  return (
    <Tag className={className} variants={item}>
      {children}
    </Tag>
  );
}
