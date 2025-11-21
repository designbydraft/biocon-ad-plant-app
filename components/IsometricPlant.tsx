import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface IsometricPlantProps {
  onPartSelect: (id: string) => void;
  activePart: string | null;
  feedstockColor: string;
}

// Helper for consistent text styling with halo effect for readability
const LabelText = ({ x, y, children, align = "middle" }: { x: string | number, y: string | number, children: React.ReactNode, align?: "start" | "middle" | "end" }) => (
  <g style={{ pointerEvents: 'none' }}>
    <text 
      x={x} 
      y={y} 
      fontSize="14" 
      fontWeight="700" 
      fill="#334155" 
      stroke="white" 
      strokeWidth="6" 
      strokeLinejoin="round"
      paintOrder="stroke" 
      textAnchor={align}
      className="select-none uppercase tracking-wider font-sans"
      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
    >
      {children}
    </text>
  </g>
);

const IsometricPlant: React.FC<IsometricPlantProps> = ({ onPartSelect, activePart, feedstockColor }) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const handleClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onPartSelect(id);
  };

  const getFill = (id: string, baseColor: string, activeColor: string) => {
    if (activePart === id) return activeColor;
    if (hoveredPart === id) return activeColor;
    return baseColor;
  };

  const getStroke = (id: string) => {
    return activePart === id || hoveredPart === id ? "white" : "rgba(255,255,255,0.5)";
  };

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full max-w-5xl select-none drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0fdf4" />
            <stop offset="100%" stopColor="#dcfce7" />
          </linearGradient>
          <linearGradient id="tankGrad" x1="0%" y1="0%" x2="100%" y2="0%">
             <stop offset="0%" stopColor="#10b981" />
             <stop offset="50%" stopColor="#34d399" />
             <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="domeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stopColor="#e0f2fe" />
             <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>

        {/* Ground Plane */}
        <path
          d="M100 300 L500 100 L900 300 L500 500 Z"
          fill="url(#groundGrad)"
          opacity="0.5"
        />

        {/* --- PIPES (Back Layer) --- */}
        
        {/* Pipe: Feeder to Digester (Extended to connect to tank) */}
        <motion.path
          d="M280 360 L410 325" 
          stroke="#64748b"
          strokeWidth="8"
          fill="none"
        />
        {/* Pipe Flow Animation */}
        <path
          d="M280 360 L410 325"
          stroke="#86efac"
          strokeWidth="4"
          fill="none"
          className="animate-flow"
        />

         {/* --- PIPES: Gas to CHP (Moved before Gas Holder to sit behind it) --- */}
        <path d="M550 250 L650 200 L700 225" fill="none" stroke="#94a3b8" strokeWidth="6" />
        <path d="M550 250 L650 200 L700 225" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,4" className="animate-flow" />


        {/* --- 1. FEEDSTOCK AREA (Bottom Left) --- */}
        <g
          onClick={(e) => handleClick('feedstock', e)}
          onMouseEnter={() => setHoveredPart('feedstock')}
          onMouseLeave={() => setHoveredPart(null)}
          className="cursor-pointer transition-transform duration-300 hover:scale-105 origin-center"
          style={{ transformBox: 'fill-box' }}
        >
          {/* Base */}
          <path d="M150 350 L250 300 L300 325 L200 375 Z" fill="#65a30d" />
          <path d="M150 350 L200 375 L200 395 L150 370 Z" fill="#365314" />
          <path d="M200 375 L300 325 L300 345 L200 395 Z" fill="#4d7c0f" />
          {/* Pile of matter - Dynamic Color */}
          <motion.path 
            d="M180 350 Q225 300 270 330 L250 340 Z" 
            fill={feedstockColor} 
            animate={{ fill: feedstockColor }}
            transition={{ duration: 0.5 }}
          />
          <LabelText x="180" y="450">Feedstock</LabelText>
        </g>

        {/* --- 2. FEEDER SYSTEM --- */}
        <g
          onClick={(e) => handleClick('feeder', e)}
          onMouseEnter={() => setHoveredPart('feeder')}
          onMouseLeave={() => setHoveredPart(null)}
          className="cursor-pointer hover:brightness-110"
        >
          {/* Hopper Box */}
          <path d="M250 340 L310 310 L340 325 L280 355 Z" fill={getFill('feeder', '#ca8a04', '#facc15')} stroke={getStroke('feeder')} strokeWidth="2" />
          <path d="M250 340 L280 355 L280 390 L250 375 Z" fill={getFill('feeder', '#854d0e', '#d97706')} />
          <path d="M280 355 L340 325 L340 360 L280 390 Z" fill={getFill('feeder', '#a16207', '#eab308')} />
          <LabelText x="320" y="420">Feeder</LabelText>
        </g>

        {/* --- 3. DIGESTER TANK (Center) --- */}
        <g
          onClick={(e) => handleClick('digester', e)}
          onMouseEnter={() => setHoveredPart('digester')}
          onMouseLeave={() => setHoveredPart(null)}
          className="cursor-pointer"
        >
          {/* Main Cylinder Body */}
          <ellipse cx="500" cy="300" rx="100" ry="50" fill={getFill('digester', '#047857', '#34d399')} />
          <path d="M400 300 L400 400 A100 50 0 0 0 600 400 L600 300" fill={getFill('digester', '#065f46', '#10b981')} />
          <ellipse cx="500" cy="400" rx="100" ry="50" fill={getFill('digester', '#064e3b', '#059669')} />
          
          {/* Highlight / Reflection */}
          <path d="M410 310 A 90 45 0 0 0 430 390" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />

          <LabelText x="500" y="520">Digester</LabelText>
        </g>

        {/* --- 4. GAS HOLDER (Top of Digester) --- */}
        <g
          onClick={(e) => handleClick('gas-holder', e)}
          onMouseEnter={() => setHoveredPart('gas-holder')}
          onMouseLeave={() => setHoveredPart(null)}
          className="cursor-pointer animate-float"
        >
          {/* Bubble Dome */}
          <path d="M400 300 A100 80 0 0 1 600 300 A100 50 0 0 1 400 300" fill={getFill('gas-holder', 'url(#domeGrad)', '#38bdf8')} opacity="0.9" />
          {/* Membrane Lines */}
          <path d="M450 240 Q500 220 550 240" fill="none" stroke="white" strokeWidth="2" opacity="0.5" />
        </g>

        {/* --- 5. CHP UNIT (Top Right) --- */}
        <g
          onClick={(e) => handleClick('chp', e)}
          onMouseEnter={() => setHoveredPart('chp')}
          onMouseLeave={() => setHoveredPart(null)}
          className="cursor-pointer hover:translate-y-[-5px] transition-transform"
        >
          {/* Container Body */}
          <path d="M680 230 L760 190 L820 220 L740 260 Z" fill={getFill('chp', '#c2410c', '#fb923c')} stroke={getStroke('chp')} strokeWidth="2" />
          <path d="M680 230 L740 260 L740 310 L680 280 Z" fill={getFill('chp', '#7c2d12', '#ea580c')} />
          <path d="M740 260 L820 220 L820 270 L740 310 Z" fill={getFill('chp', '#9a3412', '#f97316')} />
          
          {/* Exhaust Stack */}
          <path d="M780 210 L780 150" stroke="#334155" strokeWidth="8" />
          <ellipse cx="780" cy="150" rx="6" ry="3" fill="#1e293b" />
          {/* Smoke */}
          <circle cx="790" cy="130" r="5" fill="rgba(255,255,255,0.4)" className="animate-ping" />
          <circle cx="800" cy="110" r="8" fill="rgba(255,255,255,0.3)" className="animate-ping" style={{ animationDelay: '0.5s' }} />

          {/* Fan on side */}
          <circle cx="800" cy="250" r="15" fill="#333" />
          <path d="M785 250 L815 250 M800 235 L800 265" stroke="#999" strokeWidth="4" className="origin-[800px_250px] animate-spin" />
          
          <LabelText x="840" y="340">CHP / Power</LabelText>
        </g>

        {/* --- PIPE: Digestate to Separator --- */}
        <path d="M580 380 L650 415" stroke="#57534e" strokeWidth="8" />
        <path d="M580 380 L650 415" stroke="#a8a29e" strokeWidth="4" strokeDasharray="5,5" className="animate-flow" />

        {/* --- 6. SEPARATOR (Middle Right) --- */}
        <g
          onClick={(e) => handleClick('separator', e)}
          onMouseEnter={() => setHoveredPart('separator')}
          onMouseLeave={() => setHoveredPart(null)}
          className="cursor-pointer"
        >
          {/* Platform */}
          <path d="M640 410 L680 390 L720 410 L680 430 Z" fill="#44403c" />
          <path d="M640 410 L680 430 L680 460 L640 440 Z" fill="#292524" />
          <path d="M680 430 L720 410 L720 440 L680 460 Z" fill="#57534e" />
          
          {/* Machinery */}
          <path d="M660 400 L700 380 L700 410 L660 430 Z" fill={getFill('separator', '#a8a29e', '#d6d3d1')} />
          <LabelText x="660" y="490">Separator</LabelText>
        </g>

        {/* --- 7. STORAGE LAGOON (Bottom Right) --- */}
        <g
          onClick={(e) => handleClick('storage', e)}
          onMouseEnter={() => setHoveredPart('storage')}
          onMouseLeave={() => setHoveredPart(null)}
          className="cursor-pointer"
        >
          {/* Lagoon Rim */}
          <ellipse cx="800" cy="450" rx="80" ry="40" fill="#57534e" />
          <ellipse cx="800" cy="450" rx="70" ry="35" fill="#292524" />
          {/* Liquid */}
          <ellipse cx="800" cy="455" rx="65" ry="30" fill={getFill('storage', '#44403c', '#78716c')} opacity="0.9" />
          
          <LabelText x="860" y="540">Digestate</LabelText>
        </g>

        {/* Electrical Lines */}
        <path d="M740 230 L850 100" stroke="#fbbf24" strokeWidth="2" strokeDasharray="10,10" />
        <circle cx="850" cy="100" r="5" fill="#fbbf24" className="animate-pulse" />
        <LabelText x="920" y="80" align="end">Grid</LabelText>

      </svg>
    </div>
  );
};

export default IsometricPlant;