import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

interface DraggableItemProps {
  id: string;
  children: React.ReactNode;
  onDragEnd?: (id: string, x: number, y: number) => void;
  onDragStart?: (id: string) => void;
  dragConstraints?: React.RefObject<HTMLElement> | { top?: number; right?: number; bottom?: number; left?: number };
  className?: string;
  dragHandleClassName?: string;
  isDraggable?: boolean;
  dragElastic?: number;
  dragMomentum?: boolean;
  dragTransition?: { bounceStiffness?: number; bounceDamping?: number };
  onRemove?: (id: string) => void;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  children,
  onDragEnd,
  onDragStart,
  dragConstraints,
  className = '',
  dragHandleClassName,
  isDraggable = true,
  dragElastic = 0.5,
  dragMomentum = true,
  dragTransition,
  onRemove
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragOriginX = useMotionValue(0);
  const dragOriginY = useMotionValue(0);
  const scale = useTransform(
    dragOriginY,
    [-100, 0, 100],
    [0.9, 1, 0.9]
  );
  const boxShadow = useTransform(
    dragOriginY,
    [-100, 0, 100],
    ['0px 10px 20px rgba(0,0,0,0.2)', '0px 0px 0px rgba(0,0,0,0)', '0px 10px 20px rgba(0,0,0,0.2)']
  );
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent) => {
    // If we have a drag handle, check if the event target is the handle or a child of it
    if (dragHandleClassName && dragHandleRef.current) {
      const target = event.target as Node;
      if (!dragHandleRef.current.contains(target)) {
        return;
      }
    }
    
    setIsDragging(true);
    onDragStart?.(id);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number } }) => {
    setIsDragging(false);
    onDragEnd?.(id, info.offset.x, info.offset.y);
  };

  return (
    <motion.div
      layout
      drag={isDraggable}
      dragConstraints={dragConstraints}
      dragElastic={dragElastic}
      dragMomentum={dragMomentum}
      dragTransition={dragTransition}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        x: dragOriginX,
        y: dragOriginY,
        scale,
        boxShadow,
        zIndex: isDragging ? 10 : 1
      }}
      whileDrag={{ cursor: 'grabbing' }}
      className={`${className} ${isDragging ? 'z-10' : ''}`}
    >
      {dragHandleClassName && (
        <div ref={dragHandleRef} className={dragHandleClassName} />
      )}
      
      {children}
      
      {onRemove && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemove(id)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </motion.button>
      )}
    </motion.div>
  );
};

export const DraggableContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  onDrop?: (itemId: string, x: number, y: number) => void;
}> = ({ children, className = '', onDrop }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setActiveId(id);
  };

  const handleDragEnd = (id: string, x: number, y: number) => {
    setActiveId(null);
    onDrop?.(id, x, y);
  };

  // Clone children and inject drag handlers
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        dragConstraints: containerRef,
        ...child.props
      });
    }
    return child;
  });

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
    >
      {childrenWithProps}
    </motion.div>
  );
};

export const SortableList: React.FC<{
  items: Array<{ id: string; content: React.ReactNode }>;
  onReorder?: (newOrder: string[]) => void;
  className?: string;
  itemClassName?: string;
}> = ({ items, onReorder, className = '', itemClassName = '' }) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    
    // Get the current order of items from the DOM
    if (containerRef.current && onReorder) {
      const itemElements = containerRef.current.querySelectorAll('[data-item-id]');
      const newOrder = Array.from(itemElements).map(el => 
        el.getAttribute('data-item-id') || ''
      );
      onReorder(newOrder);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`space-y-2 ${className}`}
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          data-item-id={item.id}
          layout
          drag="y"
          dragConstraints={containerRef}
          onDragStart={() => handleDragStart(item.id)}
          onDragEnd={handleDragEnd}
          whileDrag={{ 
            zIndex: 10,
            boxShadow: "0px 10px 15px rgba(0,0,0,0.1)",
            cursor: "grabbing"
          }}
          className={`${itemClassName} ${draggingId === item.id ? 'z-10' : ''} cursor-grab`}
        >
          {item.content}
        </motion.div>
      ))}
    </motion.div>
  );
};