"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function FloatingElements() {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    const emojis = ["💜", "✨", "💕", "🦋", "💗", "⭐", "💜", "✨"];
    const generated: FloatingItem[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 14 + Math.random() * 20,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 6,
    }));
    setItems(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute select-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
          }}
          animate={{
            y: [0, -20, -8, -25, 0],
            x: [0, 8, -5, 10, 0],
            rotate: [0, 10, -5, 8, 0],
            opacity: [0.3, 0.6, 0.4, 0.7, 0.3],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}
