"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Route, Bell, User, Settings, Bookmark } from "lucide-react";

export interface FloatingNavProps {
  onSelect?: (index: number, label: string) => void;
  className?: string;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ onSelect, className = "" }) => {
  const [active, setActive] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const items = [
    { id: 0, icon: <Home size={22} />, label: "Home" },
    { id: 1, icon: <Route size={22} />, label: "Routes" },
    { id: 2, icon: <Bell size={22} />, label: "Alerts" },
    { id: 3, icon: <User size={22} />, label: "Profile" },
    { id: 4, icon: <Bookmark size={22} />, label: "Saved" },
    { id: 5, icon: <User size={22} />, label: "Driver" },
    { id: 6, icon: <Settings size={22} />, label: "Settings" },
  ];

  // Update indicator position when active changes or resize
  useEffect(() => {
    const updateIndicator = () => {
      if (btnRefs.current[active] && containerRef.current) {
        const btn = btnRefs.current[active];
        const container = containerRef.current;
        if (!btn) return;
        const btnRect = btn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        setIndicatorStyle({
          width: btnRect.width,
          left: btnRect.left - containerRect.left,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [active]);

  const handleItemClick = (index: number) => {
    setActive(index);
    if (onSelect) {
      onSelect(index, items[index].label);
    }
  };

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-2 ${className}`}>
      <div
        ref={containerRef}
        className="relative flex items-center justify-between bg-card/95 backdrop-blur-md shadow-2xl rounded-full px-2 py-1.5 border border-border"
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(el) => {
              btnRefs.current[index] = el;
            }}
            onClick={() => handleItemClick(index)}
            className={`relative flex flex-col items-center justify-center flex-1 px-2 py-2 text-sm font-medium transition-colors cursor-pointer ${
              active === index ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="z-10">{item.icon}</div>
            {/* hide labels on small screens */}
            <span className="text-[11px] mt-0.5 hidden sm:block">{item.label}</span>
          </button>
        ))}

        {/* Sliding Active Indicator */}
        <motion.div
          animate={indicatorStyle}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-1 bottom-1 rounded-full bg-primary/15 border border-primary/25"
        />
      </div>
    </div>
  );
};

export default FloatingNav;
