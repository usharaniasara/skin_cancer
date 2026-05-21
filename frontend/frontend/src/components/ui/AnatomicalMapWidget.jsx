import React from 'react';
import { motion } from 'framer-motion';

/**
 * Interactive Anatomical Map for selecting lesion location.
 * Uses a simplified SVG humanoid wireframe with regional hot-zones.
 */
export function AnatomicalMapWidget({ onSelect, current }) {
  const regions = [
    { id: 'head', label: 'Cranium / Facial', path: "M50,5 Q55,5 58,10 Q60,15 60,20 Q60,25 58,30 Q55,35 50,35 Q45,35 42,30 Q40,25 40,20 Q40,15 42,10 Q45,5 50,5 Z" },
    { id: 'torso', label: 'Torso / Abdominal', path: "M35,35 L65,35 L70,75 L30,75 Z" },
    { id: 'left-arm', label: 'Superior Left Extremity', path: "M35,38 L15,65 L22,70 L38,45 Z" },
    { id: 'right-arm', label: 'Superior Right Extremity', path: "M65,38 L85,65 L78,70 L62,45 Z" },
    { id: 'legs', label: 'Inferior Extremities', path: "M32,75 L48,75 L48,100 L35,100 Z M52,75 L68,75 L65,100 L52,100 Z" }
  ];

  return (
    <div className="relative w-full aspect-square flex items-center justify-center p-8 bg-white/5 rounded-[48px] border border-white/5 shadow-inner">
      <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-[0_0_30px_rgba(16,185,129,0.2)]">
        {/* Wireframe background */}
        <g opacity="0.1" stroke="#10b981" fill="none" strokeWidth="0.5">
           {regions.map(r => <path key={`bg-${r.id}`} d={r.path} />)}
        </g>
        
        {/* Interactive regions */}
        {regions.map((region) => {
          const isActive = current === region.label;
          return (
            <motion.path
              key={region.id}
              d={region.path}
              whileHover={{ scale: 1.05, fillOpacity: 0.4 }}
              onClick={() => {
                if (current !== region.label) {
                  onSelect(region.label);
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onSelect('Neutral / Unknown');
              }}
              className={`cursor-pointer transition-all duration-500 outline-none
                ${isActive ? 'fill-[#10b981]/60 stroke-[#10b981] stroke-2' : 'fill-white/5 stroke-white/20 hover:stroke-[#10b981]'}`}
              initial={false}
              animate={{
                fillOpacity: isActive ? 0.6 : 0.1,
                strokeWidth: isActive ? 1.5 : 0.5
              }}
            />
          );
        })}
      </svg>

      {/* Aesthetic crosshair / target tracking decoration */}
      <div className="absolute inset-0 pointer-events-none border border-white/[0.03] rounded-[40px] m-4 overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-white/[0.03]" />
         <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-white/[0.03]" />
         <div className="absolute top-5 left-5 w-4 h-4 border-t-2 border-l-2 border-[#10b981]/20" />
         <div className="absolute top-5 right-5 w-4 h-4 border-t-2 border-r-2 border-[#10b981]/20" />
         <div className="absolute bottom-5 left-5 w-4 h-4 border-b-2 border-l-2 border-[#10b981]/20" />
         <div className="absolute bottom-5 right-5 w-4 h-4 border-b-2 border-r-2 border-[#10b981]/20" />
      </div>
    </div>
  );
}
