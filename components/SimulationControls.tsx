
import React from 'react';
import { HelpCircle, AlertTriangle, Lock, Unlock, RefreshCw, ThermometerSun, Leaf, Settings2 } from 'lucide-react';
import { FEEDSTOCKS, SCENARIO_TOOLTIPS } from '../constants';

interface SimulationControlsProps {
  feedRate: number;
  setFeedRate: (val: number) => void;
  dryMatter: number;
  setDryMatter: (val: number) => void;
  temperature: 'meso' | 'thermo';
  setTemperature: (val: 'meso' | 'thermo') => void;
  retentionTime: number;
  setRetentionTime: (val: number) => void;
  isRetentionLocked: boolean;
  setIsRetentionLocked: (val: boolean) => void;
  feedstockA: string;
  setFeedstockA: (val: string) => void;
  feedstockB: string;
  setFeedstockB: (val: string) => void;
  mixRatio: number;
  setMixRatio: (val: number) => void;
  onClose?: () => void;
  variant?: 'modal' | 'embedded';
}

const SliderWithTooltip = ({ 
  label, 
  value, 
  min, 
  max, 
  step, 
  unit, 
  onChange, 
  tooltipKey, 
  warning 
}: { 
  label: string, 
  value: number, 
  min: number, 
  max: number, 
  step: number, 
  unit: string, 
  onChange: (val: number) => void, 
  tooltipKey: keyof typeof SCENARIO_TOOLTIPS,
  warning?: string
}) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">{label}</label>
        <div className="group relative">
          <HelpCircle size={14} className="text-slate-400 cursor-help" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {SCENARIO_TOOLTIPS[tooltipKey]}
          </div>
        </div>
      </div>
      <span className="text-sm font-mono font-bold text-brand">{value} {unit}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand"
    />
    {warning && (
      <div className="mt-1 flex items-start gap-1 text-xs text-amber-600 font-medium animate-pulse">
        <AlertTriangle size={12} className="mt-0.5 shrink-0" />
        <span>{warning}</span>
      </div>
    )}
  </div>
);

const SimulationControls: React.FC<SimulationControlsProps> = ({
  feedRate, setFeedRate,
  dryMatter, setDryMatter,
  temperature, setTemperature,
  retentionTime, setRetentionTime,
  isRetentionLocked, setIsRetentionLocked,
  feedstockA, setFeedstockA,
  feedstockB, setFeedstockB,
  mixRatio, setMixRatio,
  onClose,
  variant = 'modal'
}) => {

  const handleRetentionChange = (val: number) => {
    setRetentionTime(val);
    if (!isRetentionLocked) setIsRetentionLocked(true);
  };

  const handleResetRetention = () => {
    setIsRetentionLocked(false);
  };

  const isModal = variant === 'modal';

  const containerClasses = isModal 
    ? "fixed top-20 left-4 md:left-8 z-40 w-[90vw] md:w-80 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
    : "w-full h-full bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden flex flex-col";

  return (
    <div className={containerClasses}>
      
      {/* Header - Only show in Modal mode or if we want a title in embedded */}
      <div className="bg-slate-900 p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 text-white">
          <Settings2 size={20} className="text-brand" />
          <h2 className="font-bold text-lg">Scenario Builder</h2>
        </div>
        {isModal && onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
            Close
          </button>
        )}
      </div>

      <div className="p-5 overflow-y-auto custom-scrollbar">
        
        {/* Feedstock Mix Section */}
        <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-3">
             <Leaf size={16} className="text-green-600" />
             <span className="text-xs font-bold text-slate-500 uppercase">Feedstock Mixture</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <select 
              value={feedstockA} 
              onChange={(e) => setFeedstockA(e.target.value)}
              className="text-xs p-2 rounded border border-slate-200 bg-white focus:border-brand outline-none"
            >
              {Object.values(FEEDSTOCKS).map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <select 
              value={feedstockB} 
              onChange={(e) => setFeedstockB(e.target.value)}
              className="text-xs p-2 rounded border border-slate-200 bg-white focus:border-brand outline-none"
            >
              {Object.values(FEEDSTOCKS).map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="relative pt-1">
             <input 
                type="range" 
                min="0" 
                max="100" 
                value={mixRatio} 
                onChange={(e) => setMixRatio(parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-amber-500 to-blue-500 rounded-lg appearance-none cursor-pointer"
             />
             <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                <span>{100 - mixRatio}% {FEEDSTOCKS[feedstockA].name}</span>
                <span>{mixRatio}% {FEEDSTOCKS[feedstockB].name}</span>
             </div>
          </div>
        </div>

        {/* Operating Parameters */}
        <SliderWithTooltip 
          label="Daily Feed Rate" 
          value={feedRate} 
          min={0} 
          max={100} 
          step={1} 
          unit="t/d"
          onChange={setFeedRate}
          tooltipKey="feedRate"
          warning={feedRate > 80 ? "High organic loading rate may stress biological stability." : undefined}
        />

        <SliderWithTooltip 
          label="Dry Matter %" 
          value={dryMatter} 
          min={3} 
          max={15} 
          step={0.5} 
          unit="%"
          onChange={setDryMatter}
          tooltipKey="dryMatter"
          warning={dryMatter > 12 ? "High viscosity. Requires positive displacement pumps and powerful mixing." : undefined}
        />

        {/* Temperature Toggle */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Temperature</label>
              <HelpCircle size={14} className="text-slate-400" title={SCENARIO_TOOLTIPS.temperature} />
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
             <button 
               onClick={() => setTemperature('meso')}
               className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold rounded-md transition-all ${temperature === 'meso' ? 'bg-white text-brand shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Meso (38°C)
             </button>
             <button 
               onClick={() => setTemperature('thermo')}
               className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-bold rounded-md transition-all ${temperature === 'thermo' ? 'bg-white text-red-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <ThermometerSun size={12} /> Thermo (52°C)
             </button>
          </div>
        </div>

        {/* Retention Time (Calculated/Locked) */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Retention Time</label>
              <HelpCircle size={14} className="text-slate-400" title={SCENARIO_TOOLTIPS.retention} />
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-mono font-bold ${retentionTime < 25 ? 'text-red-500' : 'text-brand'}`}>
                {Math.round(retentionTime)} Days
              </span>
              <button 
                onClick={handleResetRetention}
                className={`p-1 rounded hover:bg-slate-100 ${isRetentionLocked ? 'text-brand' : 'text-slate-300'}`}
                title="Reset to calculated value"
              >
                {isRetentionLocked ? <Unlock size={14} /> : <Lock size={14} />}
              </button>
            </div>
          </div>
          <input 
            type="range" 
            min="15" 
            max="80" 
            step={1} 
            value={retentionTime} 
            onChange={(e) => handleRetentionChange(parseFloat(e.target.value))}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isRetentionLocked ? 'bg-brand/20 accent-brand' : 'bg-slate-200 accent-slate-400'}`}
          />
          {!isRetentionLocked && (
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <RefreshCw size={10} /> Auto-calculated from Volume / Feed Rate
            </p>
          )}
          {retentionTime < 25 && (
            <div className="mt-1 flex items-start gap-1 text-xs text-red-500 font-medium animate-pulse">
              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
              <span>Retention too short! Washout risk.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SimulationControls;
