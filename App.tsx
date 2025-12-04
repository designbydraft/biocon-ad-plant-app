
import React, { useState, useMemo, useEffect } from 'react';
import IsometricPlant from './components/IsometricPlant';
import InfoPanel from './components/InfoPanel';
import SimulationControls from './components/SimulationControls';
import DigestateExplorer from './components/DigestateExplorer';
import { PLANT_DATA, FEEDSTOCKS, METRIC_EXPLANATIONS, SIMULATION_CONSTANTS, SIMULATION_DEFAULTS, Feedstock } from './constants';
import { Info, Leaf, Wind, Zap, ChevronDown, Plus, Minus, Undo2, Thermometer, FlaskConical, Timer, HelpCircle, X, Settings2 } from 'lucide-react';
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
      className="relative group outline-none w-full"
      onClick={onClick}
    >
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 w-full transition-all hover:bg-white hover:border-brand/30 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon size={18} />
        </div>
        <div className="text-left min-w-0">
          <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 truncate">
            {label}
            <HelpCircle size={10} className="text-slate-300 opacity-50 group-hover:opacity-100 transition-opacity" />
          </p>
          <p className="font-mono font-bold text-slate-700 text-xs md:text-sm whitespace-nowrap truncate">{value}</p>
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
  // UI State
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<{ key: string; icon: React.ElementType; color: string; label: string } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showControls, setShowControls] = useState(false);

  // Simulation State
  const [feedRate, setFeedRate] = useState(SIMULATION_DEFAULTS.feedRate);
  const [dryMatter, setDryMatter] = useState(SIMULATION_DEFAULTS.dryMatter);
  const [isDryMatterManuallySet, setIsDryMatterManuallySet] = useState(false);
  const [temperature, setTemperature] = useState<'meso' | 'thermo'>(SIMULATION_DEFAULTS.temperature);
  const [retentionTime, setRetentionTime] = useState(SIMULATION_DEFAULTS.feedRate > 0 ? SIMULATION_CONSTANTS.DIGESTER_VOLUME / SIMULATION_DEFAULTS.feedRate : 40);
  const [isRetentionLocked, setIsRetentionLocked] = useState(SIMULATION_DEFAULTS.retentionLocked);
  const [activeMix, setActiveMix] = useState(SIMULATION_DEFAULTS.activeMix);

  // Auto-Update Dry Matter when mix changes (unless manually overridden)
  useEffect(() => {
    if (!isDryMatterManuallySet) {
      let mixedDM = 0;
      activeMix.forEach(item => {
        const fs = FEEDSTOCKS[item.id];
        if (fs) {
          const midPoint = (fs.dmMin + fs.dmMax) / 2;
          mixedDM += midPoint * (item.percentage / 100);
        }
      });
      // Round to nearest 0.5
      setDryMatter(Math.round(mixedDM * 2) / 2);
    }
  }, [activeMix, isDryMatterManuallySet]);

  const handleDryMatterChange = (val: number) => {
    setDryMatter(val);
    setIsDryMatterManuallySet(true);
  };

  // Effect: Recalculate Retention Time if not locked
  useEffect(() => {
    if (!isRetentionLocked) {
      const calculatedRetention = feedRate > 0 ? SIMULATION_CONSTANTS.DIGESTER_VOLUME / feedRate : 0;
      setRetentionTime(calculatedRetention);
    }
  }, [feedRate, isRetentionLocked]);

  // Derived Simulation Metrics
  const simulationResults = useMemo(() => {
    // 1. Calculate weighted averages from the mix
    let mixedYield10DM = 0;
    let mixedMethaneBase = 0;
    let dominantFeedstockId = 'manure';
    let maxPct = 0;
    let hasHighN = false;
    let highNRisk = false;

    activeMix.forEach(item => {
      const fs = FEEDSTOCKS[item.id];
      if (!fs) return;
      const fraction = item.percentage / 100;
      mixedYield10DM += fs.biogasYield10DM * fraction;
      mixedMethaneBase += fs.methaneBasePercent * fraction;

      if (item.percentage > maxPct) {
        maxPct = item.percentage;
        dominantFeedstockId = item.id;
      }
      
      if (fs.nitrogenPotential === 'High' || fs.nitrogenPotential === 'Very High') {
        hasHighN = true;
        if (item.percentage > 30) highNRisk = true;
      }
    });
    
    // Dry Matter Factor (Clamp between 0.6 and 1.3)
    const dmFactorRaw = dryMatter / 10;
    const dmFactor = Math.max(0.6, Math.min(1.3, dmFactorRaw));
    
    // Temperature Factor
    const tempFactor = temperature === 'thermo' ? 1.15 : 1.0;

    // Effective Yield per Tonne
    const yieldPerTonne = mixedYield10DM * dmFactor * tempFactor;

    // 2. Gas Production
    const biogasDaily = yieldPerTonne * feedRate;
    const biogasHourly = biogasDaily / 24;

    // 3. Methane Calculation
    const tempBonus = temperature === 'thermo' ? 1 : 0;
    
    let retentionPenalty = 0;
    if (retentionTime < 30) retentionPenalty += 2;
    if (retentionTime < 20) retentionPenalty += 3;

    let finalMethane = mixedMethaneBase + tempBonus - retentionPenalty;
    finalMethane = Math.max(45, Math.min(70, finalMethane)); 

    // 4. Power Outputs
    const powerElectric = biogasHourly * SIMULATION_CONSTANTS.POWER_COEFF;
    const powerThermal = biogasHourly * SIMULATION_CONSTANTS.THERMAL_COEFF;

    // 5. Digestate Volumes & Nutrients
    const digestateTotal = feedRate;
    const liquidFraction = dryMatter >= 12 ? 0.8 : 0.9;
    const liquidDigestate = digestateTotal * liquidFraction;
    const fibreDigestate = digestateTotal * (1 - liquidFraction);

    const dailyN = digestateTotal * SIMULATION_CONSTANTS.N_FACTOR;
    const dailyP = digestateTotal * SIMULATION_CONSTANTS.P_FACTOR;
    const dailyK = digestateTotal * SIMULATION_CONSTANTS.K_FACTOR;

    const annualN = dailyN * 365;
    const landRequired = annualN / SIMULATION_CONSTANTS.NITROGEN_LIMIT;

    // 6. Carbon Savings
    const annualElectricMWh = powerElectric * SIMULATION_CONSTANTS.OPERATING_HOURS;
    const carbonSavings = annualElectricMWh * SIMULATION_CONSTANTS.CARBON_COEFF;

    return {
      gas: Math.round(biogasHourly),
      power: powerElectric.toFixed(2),
      thermal: powerThermal.toFixed(2),
      methane: finalMethane.toFixed(1),
      retention: Math.round(retentionTime),
      feedRate: Math.round(feedRate),
      liquidDigestate: Math.round(liquidDigestate),
      fibreDigestate: Math.round(fibreDigestate),
      carbonSavings: Math.round(carbonSavings),
      dailyN, dailyP, dailyK, annualN, landRequired,
      isHighN: highNRisk,
      dominantFeedstock: FEEDSTOCKS[dominantFeedstockId]
    };
  }, [activeMix, dryMatter, temperature, feedRate, retentionTime]);


  const handlePartSelect = (id: string) => {
    setSelectedPartId(id);
  };

  const handleClosePanel = () => {
    setSelectedPartId(null);
  };

  const handleBackgroundClick = () => {
    setShowControls(false);
    setSelectedPartId(null);
  };

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

  const selectedPart = selectedPartId ? PLANT_DATA[selectedPartId] : null;

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-50 to-[#F4F3FA] overflow-y-auto overflow-x-hidden flex flex-col">
      
      <AnimatePresence>
        {activeMetric && (
          <MetricDetailModal 
            metricKey={activeMetric.key}
            // @ts-ignore
            value={
               activeMetric.key === 'gas' ? `${simulationResults.gas} m³/h` : 
               activeMetric.key === 'power' ? `${simulationResults.power} MW` :
               activeMetric.key === 'thermal' ? `${simulationResults.thermal} MWth` :
               activeMetric.key === 'methane' ? `${simulationResults.methane}%` :
               activeMetric.key === 'retention' ? `${simulationResults.retention} days` :
               activeMetric.key === 'feedRate' ? `${simulationResults.feedRate} t/d` :
               activeMetric.key === 'carbon' ? `${simulationResults.carbonSavings} tCO₂` :
               activeMetric.key === 'liquid' ? `${simulationResults.liquidDigestate} t/d` :
               activeMetric.key === 'fibre' ? `${simulationResults.fibreDigestate} t/d` :
               ""
            }
            icon={activeMetric.icon}
            colorClass={activeMetric.color}
            onClose={() => setActiveMetric(null)}
          />
        )}
      </AnimatePresence>

      {showControls && (
        <SimulationControls 
          variant="modal"
          feedRate={feedRate} setFeedRate={setFeedRate}
          dryMatter={dryMatter} setDryMatter={handleDryMatterChange}
          temperature={temperature} setTemperature={setTemperature}
          retentionTime={retentionTime} setRetentionTime={setRetentionTime}
          isRetentionLocked={isRetentionLocked} setIsRetentionLocked={setIsRetentionLocked}
          activeMix={activeMix} onMixChange={setActiveMix}
          onClose={() => setShowControls(false)}
        />
      )}

      <header className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-2 shrink-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              BIOCON Group <span className="text-[#F29220]">AD Simulator</span>
            </h1>
            <div className="flex flex-col md:flex-row gap-2 md:items-center mt-1">
               <p className="text-slate-500 text-sm hidden md:block max-w-md">
                 Interactive Anaerobic Digestion Model.
               </p>
               <div className="md:hidden flex items-center gap-2 text-slate-500 text-xs bg-white/50 p-1.5 rounded-lg w-fit backdrop-blur-sm">
                  <Info size={14} className="text-[#F29220]" />
                  <span>Scroll for Dashboard • Click parts for Info</span>
               </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-none h-[75vh] min-h-[500px] relative overflow-hidden bg-slate-50/50 cursor-grab active:cursor-grabbing border-b border-slate-200" onClick={handleBackgroundClick}>
        <div className="absolute bottom-6 right-4 flex flex-col gap-2 z-30 pointer-events-auto">
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
             <div className="pointer-events-auto">
                <IsometricPlant 
                  onPartSelect={handlePartSelect} 
                  activePart={selectedPartId}
                  feedstockColor={simulationResults.dominantFeedstock.color}
                />
             </div>
          </div>
        </motion.div>
      </main>

      <div className="bg-slate-50 border-t border-slate-200 p-4 md:p-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
             <MetricCard 
                icon={Wind} 
                label="Biogas Output" 
                value={`${simulationResults.gas} m³/h`} 
                colorClass="bg-green-100 text-green-600"
                onClick={() => setActiveMetric({ key: 'gas', icon: Wind, color: 'bg-green-100 text-green-600', label: 'Biogas Output' })}
              />
              <MetricCard 
                icon={Zap} 
                label="Elec. Power" 
                value={`${simulationResults.power} MW`} 
                colorClass="bg-orange-100 text-orange-600"
                onClick={() => setActiveMetric({ key: 'power', icon: Zap, color: 'bg-orange-100 text-orange-600', label: 'Elec. Power' })}
              />
               <MetricCard 
                icon={FlaskConical} 
                label="Methane %" 
                value={`${simulationResults.methane}%`} 
                colorClass="bg-blue-100 text-blue-600"
                onClick={() => setActiveMetric({ key: 'methane', icon: FlaskConical, color: 'bg-blue-100 text-blue-600', label: 'Methane %' })}
              />
              <MetricCard 
                icon={Thermometer} 
                label="Thermal Output" 
                value={`${simulationResults.thermal} MWth`} 
                colorClass="bg-red-100 text-red-600"
                onClick={() => setActiveMetric({ key: 'thermal', icon: Thermometer, color: 'bg-red-100 text-red-600', label: 'Thermal Output' })}
              />
              <MetricCard 
                icon={Timer} 
                label="Retention Time" 
                value={`${simulationResults.retention} days`} 
                colorClass={simulationResults.retention < 25 ? "bg-red-100 text-red-600 animate-pulse" : "bg-purple-100 text-purple-600"}
                onClick={() => setActiveMetric({ key: 'retention', icon: Timer, color: 'bg-purple-100 text-purple-600', label: 'Retention Time' })}
              />
              <MetricCard 
                icon={Leaf} 
                label="Carbon Savings" 
                value={`${simulationResults.carbonSavings} t/yr`} 
                colorClass="bg-emerald-100 text-emerald-600"
                onClick={() => setActiveMetric({ key: 'carbon', icon: Leaf, color: 'bg-emerald-100 text-emerald-600', label: 'Carbon Savings' })}
              />
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            <div className="hidden md:block w-full lg:w-80 shrink-0 sticky top-4">
              <SimulationControls 
                variant="embedded"
                feedRate={feedRate} setFeedRate={setFeedRate}
                dryMatter={dryMatter} setDryMatter={handleDryMatterChange}
                temperature={temperature} setTemperature={setTemperature}
                retentionTime={retentionTime} setRetentionTime={setRetentionTime}
                isRetentionLocked={isRetentionLocked} setIsRetentionLocked={setIsRetentionLocked}
                activeMix={activeMix} onMixChange={setActiveMix}
              />
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-4">
              
              {/* Mobile Scenario Controls Button */}
              <button 
                onClick={() => setShowControls(true)}
                className="md:hidden w-full bg-white shadow-sm border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                 <div className="flex items-center gap-2">
                    <Settings2 size={18} className="text-brand" />
                    <span className="font-bold text-slate-700">Configure Scenario</span>
                 </div>
                 <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Edit inputs</span>
                    <ChevronDown size={16} />
                 </div>
              </button>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <DigestateExplorer 
                  liquidVol={simulationResults.liquidDigestate}
                  fibreVol={simulationResults.fibreDigestate}
                  dailyN={simulationResults.dailyN}
                  dailyP={simulationResults.dailyP}
                  dailyK={simulationResults.dailyK}
                  annualN={simulationResults.annualN}
                  landRequired={simulationResults.landRequired}
                  dryMatter={dryMatter}
                  temperature={temperature}
                  isHighNFeedstock={simulationResults.isHighN}
                />
              </div>
            </div>
            
          </div>

        </div>
      </div>

      <InfoPanel 
        part={selectedPart} 
        currentFeedstock={simulationResults.dominantFeedstock}
        // @ts-ignore
        metrics={simulationResults}
        onClose={handleClosePanel} 
      />

    </div>
  );
};

export default App;
