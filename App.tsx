
import React, { useState, useMemo } from 'react';
import IsometricPlant from './components/IsometricPlant';
import InfoPanel from './components/InfoPanel';
import { PLANT_DATA, FEEDSTOCKS } from './constants';
import { Info, Leaf, Wind, Zap, ChevronDown, Plus, Minus, Undo2 } from 'lucide-react';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [activeFeedstockId, setActiveFeedstockId] = useState<string>('manure');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const selectedPart = selectedPartId ? PLANT_DATA[selectedPartId] : null;
  const currentFeedstock = FEEDSTOCKS[activeFeedstockId];

  // Calculate metrics based on feedstock yield factors
  const metrics = useMemo(() => {
    const baseGas = 450; // m3/h
    const basePower = 1.2; // MW
    return {
      gas: Math.round(baseGas * currentFeedstock.yieldFactor),
      power: (basePower * currentFeedstock.yieldFactor).toFixed(2)
    };
  }, [currentFeedstock]);

  const handlePartSelect = (id: string) => {
    setSelectedPartId(id);
  };

  const handleClosePanel = () => {
    setSelectedPartId(null);
  };

  const handleBackgroundClick = () => {
    setIsMenuOpen(false);
    setSelectedPartId(null);
  };

  // Zoom Handlers
  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(z => Math.min(z + 0.25, 2.5));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(z => Math.max(z - 0.25, 0.5));
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(1);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-50 to-[#F4F3FA] overflow-hidden flex flex-col">
      
      {/* Header HUD */}
      <header className="absolute top-0 left-0 w-full p-4 md:p-6 z-10 flex flex-col md:flex-row justify-between items-start pointer-events-none gap-4">
        <div className="pointer-events-auto flex flex-col gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              BIOCON Group <span className="text-[#F29220]">AD Simulator</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 hidden md:block max-w-md">
              Interactive Anaerobic Digestion Model.
            </p>
          </div>

          {/* Feedstock Selector */}
          <div className="relative mt-2">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-white shadow-md border border-slate-200 rounded-lg px-4 py-2 flex items-center gap-3 hover:bg-slate-50 transition-colors min-w-[200px] justify-between"
            >
              <div className="flex items-center gap-2">
                 <span className={`w-3 h-3 rounded-full ${currentFeedstock.styles.dotColor}`}></span>
                 <span className="font-semibold text-slate-700 text-sm">{currentFeedstock.name}</span>
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden z-20">
                <div className="p-2 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">Select Feedstock</div>
                {Object.values(FEEDSTOCKS).map((fs) => (
                  <button
                    key={fs.id}
                    onClick={() => { setActiveFeedstockId(fs.id); setIsMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 border-b last:border-0 border-slate-50 ${activeFeedstockId === fs.id ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${fs.styles.iconBg} ${fs.styles.iconText}`}>
                      <Leaf size={16} />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-700 text-sm">{fs.name}</div>
                      <div className="text-xs text-slate-400">{fs.methaneContent} Methane</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Metrics Simulation */}
        <div className="flex gap-2 md:gap-4 pointer-events-auto self-end md:self-auto">
          <div className="bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 min-w-[140px]">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <Wind size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Gas Output</p>
              <p className="font-mono font-bold text-slate-700 text-sm md:text-base">{metrics.gas} m³/h</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 min-w-[140px]">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Power Gen</p>
              <p className="font-mono font-bold text-slate-700 text-sm md:text-base">{metrics.power} MW</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main 3D Viewport */}
      <main className="flex-1 relative overflow-hidden bg-slate-50/50 cursor-grab active:cursor-grabbing" onClick={handleBackgroundClick}>
        
        {/* Zoom Controls */}
        <div className="absolute bottom-24 right-4 flex flex-col gap-2 z-30 pointer-events-auto">
           <button onClick={handleZoomIn} className="bg-white p-2.5 rounded-xl shadow-lg text-slate-600 hover:bg-slate-50 hover:text-brand border border-slate-100 transition-colors">
             <Plus size={20} />
           </button>
           <button onClick={handleResetZoom} className="bg-white p-2.5 rounded-xl shadow-lg text-slate-600 hover:bg-slate-50 hover:text-brand border border-slate-100 transition-colors">
             <Undo2 size={20} />
           </button>
           <button onClick={handleZoomOut} className="bg-white p-2.5 rounded-xl shadow-lg text-slate-600 hover:bg-slate-50 hover:text-brand border border-slate-100 transition-colors">
             <Minus size={20} />
           </button>
        </div>

        <motion.div 
          className="w-full h-full flex items-center justify-center touch-none"
          drag
          dragConstraints={{ left: -500, right: 500, top: -300, bottom: 300 }}
          dragElastic={0.2}
          animate={{ scale: zoom }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="w-full max-w-5xl p-4 md:p-10 pointer-events-none">
             {/* Interactive children must enable pointer events */}
             <div className="pointer-events-auto">
                <IsometricPlant 
                  onPartSelect={handlePartSelect} 
                  activePart={selectedPartId}
                  feedstockColor={currentFeedstock.color}
                />
             </div>
          </div>
        </motion.div>
        
        {/* Hint Overlay if nothing selected */}
        {!selectedPartId && (
          <div className="absolute bottom-12 left-0 right-0 flex justify-center pointer-events-none z-20 px-4">
            <div className="bg-white/90 backdrop-blur-md border border-white/50 px-6 py-3 rounded-full shadow-xl flex items-center gap-2">
              <Info size={18} className="text-[#F29220]" />
              <span className="text-slate-600 text-sm font-medium whitespace-nowrap">Click on a plant section to learn more</span>
            </div>
          </div>
        )}
      </main>

      {/* Details Sidebar */}
      <InfoPanel 
        part={selectedPart} 
        currentFeedstock={currentFeedstock}
        metrics={metrics}
        onClose={handleClosePanel} 
      />

    </div>
  );
};

export default App;
