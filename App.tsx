import React, { useState, useMemo } from 'react';
import IsometricPlant from './components/IsometricPlant';
import InfoPanel from './components/InfoPanel';
import { PLANT_DATA, FEEDSTOCKS, METRIC_EXPLANATIONS } from './constants';
import { Info, Leaf, Wind, Zap, ChevronDown, Plus, Minus, Undo2, Thermometer, FlaskConical, Timer, Scale, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable Metric Card Component ---
interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  colorClass: string;
  onClick: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, label, value, colorClass, onClick }) => {
  return (
    <button 
      className="relative group outline-none"
      onClick={onClick}
    >
      <div className="bg-white/80 backdrop-blur-md p-2 md:p-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 min-w-[130px] transition-all hover:bg-white hover:border-brand/30 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon size={18} />
        </div>
        <div className="text-left">
          <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            {label}
            <HelpCircle size={10} className="text-slate-300 opacity-50 group-hover:opacity-100 transition-opacity" />
          </p>
          <p className="font-mono font-bold text-slate-700 text-xs md:text-sm whitespace-nowrap">{value}</p>
        </div>
      </div>
    </button>
  );
};

// --- Metric Detail Modal ---
interface MetricDetailModalProps {
  metricKey: string;
  value: string;
  icon: React.ElementType;
  colorClass: string;
  onClose: () => void;
}

const MetricDetailModal: React.FC<MetricDetailModalProps> = ({ metricKey, value, icon: Icon, colorClass, onClose }) => {
  const info = METRIC_EXPLANATIONS[metricKey];
  
  if (!info) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
         initial={{ opacity: 0, scale: 0.9, y: 20 }}
         animate={{ opacity: 1, scale: 1, y: 0 }}
         exit={{ opacity: 0, scale: 0.9, y: 20 }}
         className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
         onClick={e => e.stopPropagation()}
      >
         <div className="p-6">
            <div className="flex justify-between items-start mb-5">
               <div className={`p-3 rounded-xl ${colorClass}`}>
                  <Icon size={24} />
               </div>
               <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                 <X size={20}/>
               </button>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-1">{info.title}</h3>
            <p className="text-3xl font-mono font-bold text-slate-700 mb-6">{value}</p>
            
            <div className="space-y-5">
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Info size={12}/> What is it?
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{info.description}</p>
               </div>
               
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Zap size={12}/> Why it matters
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{info.whyItMatters}</p>
               </div>
               
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Optimal Range</h4>
                  <p className="text-slate-700 text-sm font-semibold">{info.optimalRange}</p>
               </div>
            </div>
         </div>
      </motion.div>
    </div>
  );
};

const App: React.FC = () => {
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [activeFeedstockId, setActiveFeedstockId] = useState<string>('manure');
  const [activeMetric, setActiveMetric] = useState<{ key: string; icon: React.ElementType; color: string; label: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const selectedPart = selectedPartId ? PLANT_DATA[selectedPartId] : null;
  const currentFeedstock = FEEDSTOCKS[activeFeedstockId];

  // Calculate metrics based on feedstock yield factors
  const metrics = useMemo(() => {
    const baseGas = 450; // m3/h
    const basePower = 1.2; // MW
    const yieldFactor = currentFeedstock.yieldFactor;
    
    // Derived values
    const gasOutput = Math.round(baseGas * yieldFactor);
    const powerOutput = (basePower * yieldFactor).toFixed(2);
    const thermalOutput = (parseFloat(powerOutput) * 1.15).toFixed(2); // Thermal usually ~1.15x Electrical

    return {
      gas: gasOutput,
      power: powerOutput,
      thermal: thermalOutput,
      methane: currentFeedstock.methaneContent,
      retention: currentFeedstock.retentionTime,
      feedRate: currentFeedstock.feedRate
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
      
      {/* Metric Detail Modal Overlay */}
      <AnimatePresence>
        {activeMetric && (
          <MetricDetailModal 
            metricKey={activeMetric.key}
            // @ts-ignore - Indexing strictly typed metrics object
            value={activeMetric.key === 'gas' ? `${metrics.gas} m³/h` : 
                   activeMetric.key === 'power' ? `${metrics.power} MW` :
                   activeMetric.key === 'thermal' ? `${metrics.thermal} MWth` :
                   // @ts-ignore
                   metrics[activeMetric.key]}
            icon={activeMetric.icon}
            colorClass={activeMetric.color}
            onClose={() => setActiveMetric(null)}
          />
        )}
      </AnimatePresence>

      {/* Header HUD */}
      <header className="absolute top-0 left-0 w-full p-4 z-10 flex flex-col xl:flex-row justify-between items-start pointer-events-none gap-4">
        
        {/* Left Side: Branding & Selector */}
        <div className="pointer-events-auto flex flex-col gap-2 shrink-0">
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
              className="bg-white shadow-md border border-slate-200 rounded-lg px-4 py-2 flex items-center gap-3 hover:bg-slate-50 transition-colors min-w-[220px] justify-between"
            >
              <div className="flex items-center gap-2">
                 <span className={`w-3 h-3 rounded-full ${currentFeedstock.styles.dotColor}`}></span>
                 <span className="font-semibold text-slate-700 text-sm">{currentFeedstock.name}</span>
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden z-20 max-h-96 overflow-y-auto">
                <div className="p-2 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 z-10">Select Feedstock</div>
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
                      <div className="text-xs text-slate-400">{fs.expectedGasYield}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Metrics Grid - Scrollable on mobile, Grid on desktop */}
        <div className="pointer-events-auto self-start xl:self-auto w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">
          <div className="flex xl:grid xl:grid-cols-3 gap-2 min-w-max px-1">
            
            <MetricCard 
              icon={Wind} 
              label="Biogas Output" 
              value={`${metrics.gas} m³/h`} 
              colorClass="bg-green-100 text-green-600"
              onClick={() => setActiveMetric({ key: 'gas', icon: Wind, color: 'bg-green-100 text-green-600', label: 'Biogas Output' })}
            />
            
            <MetricCard 
              icon={Zap} 
              label="Elec. Power" 
              value={`${metrics.power} MW`} 
              colorClass="bg-orange-100 text-orange-600"
              onClick={() => setActiveMetric({ key: 'power', icon: Zap, color: 'bg-orange-100 text-orange-600', label: 'Elec. Power' })}
            />
            
            <MetricCard 
              icon={Thermometer} 
              label="Thermal Output" 
              value={`${metrics.thermal} MWth`} 
              colorClass="bg-red-100 text-red-600"
              onClick={() => setActiveMetric({ key: 'thermal', icon: Thermometer, color: 'bg-red-100 text-red-600', label: 'Thermal Output' })}
            />

            <MetricCard 
              icon={FlaskConical} 
              label="Methane %" 
              value={metrics.methane} 
              colorClass="bg-blue-100 text-blue-600"
              onClick={() => setActiveMetric({ key: 'methane', icon: FlaskConical, color: 'bg-blue-100 text-blue-600', label: 'Methane %' })}
            />

            <MetricCard 
              icon={Timer} 
              label="Retention Time" 
              value={metrics.retention} 
              colorClass="bg-purple-100 text-purple-600"
              onClick={() => setActiveMetric({ key: 'retention', icon: Timer, color: 'bg-purple-100 text-purple-600', label: 'Retention Time' })}
            />

            <MetricCard 
              icon={Scale} 
              label="Feed Rate" 
              value={metrics.feedRate} 
              colorClass="bg-stone-100 text-stone-600"
              onClick={() => setActiveMetric({ key: 'feedRate', icon: Scale, color: 'bg-stone-100 text-stone-600', label: 'Feed Rate' })}
            />

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