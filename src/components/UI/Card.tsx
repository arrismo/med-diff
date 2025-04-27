import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  className,
  hoverable = false,
  onClick,
}) => {
  const cardClasses = clsx(
    'bg-white rounded-lg border border-neutral-200 overflow-hidden',
    hoverable && 'cursor-pointer transition-shadow hover:shadow-card-hover',
    className
  );

  return (
    <motion.div
      className={cardClasses}
      onClick={onClick}
      whileHover={hoverable ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
    >
      {(title || subtitle) && (
        <div className="px-5 py-4 border-b border-neutral-200">
          {title && <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>}
          {subtitle && <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>}
        </div>
      )}
      
      <div className="p-5">{children}</div>
      
      {footer && (
        <div className="px-5 py-4 bg-neutral-50 border-t border-neutral-200">
          {footer}
        </div>
      )}
    </motion.div>
  );
};

export default Card;