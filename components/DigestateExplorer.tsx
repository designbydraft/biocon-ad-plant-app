
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Sprout, Map, CheckCircle, AlertTriangle, HelpCircle, Info, ShieldCheck } from 'lucide-react';
import { DIGESTATE_TOOLTIPS } from '../constants';

interface DigestateExplorerProps {
  liquidVol: number;
  fibreVol: number;
  dailyN: number;
  dailyP: number;
  dailyK: number;
  annualN: number;
  landRequired: number;
  dryMatter: number;
  temperature: 'meso' | 'thermo';
  isHighNFeedstock: boolean;
}

const Tooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-1">
    <HelpCircle size={14} className="text-slate-400 cursor-help hover:text-brand transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-slate-800 text-white text-xs p-2.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

const DigestateExplorer: React.FC<DigestateExplorerProps> = ({
  liquidVol,
  fibreVol,
  dailyN,
  dailyP,
  dailyK,
  annualN,
  landRequired,
  dryMatter,
  temperature,
  isHighNFeedstock
}) => {
  const [userLand, setUserLand] = useState<string>('');
  
  const totalVol = liquidVol + fibreVol;
  const liquidPct = (liquidVol / totalVol) * 100;
  const fibrePct = (fibreVol / totalVol) * 100;
  
  const userLandNum = parseFloat(userLand);
  const landStatus = !userLand ? null : userLandNum >= landRequired ? 'sufficient' : 'insufficient';

  return (
    <div className="w-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sprout className="text-green-600" />
            Digestate Management Explorer
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Understanding the output. Effective management requires balancing volume, nutrients, and land availability.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN: Volume & Split */}
          <div className="space-y-6">
            
            {/* Volume Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-between">
                 <span>Mass Balance Breakdown</span>
                 <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Daily Output</span>
               </h3>
               
               {/* Visual Bar */}
               <div className="w-full h-12 bg-slate-100 rounded-lg overflow-hidden flex mb-4 relative">
                 <motion.div 
                   className="h-full bg-cyan-500 relative group"
                   initial={{ width: 0 }}
                   animate={{ width: `${liquidPct}%` }}
                   transition={{ duration: 0.5 }}
                 >
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                       {Math.round(liquidPct)}% Liquid
                    </div>
                 </motion.div>
                 <motion.div 
                   className="h-full bg-amber-700 relative"
                   initial={{ width: 0 }}
                   animate={{ width: `${fibrePct}%` }}
                   transition={{ duration: 0.5 }}
                 >
                    <div className="absolute inset-0 flex items-center justify-center text-white/90 font-bold text-sm">
                       {Math.round(fibrePct)}% Fibre
                    </div>
                 </motion.div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-100">
                    <div className="flex items-center gap-2 mb-1">
                       <Droplets size={16} className="text-cyan-600" />
                       <span className="text-sm font-semibold text-cyan-800">Liquid Fraction</span>
                    </div>
                    <p className="text-xl font-bold text-cyan-900">{liquidVol} <span className="text-sm font-normal">t/day</span></p>
                 </div>
                 <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <div className="flex items-center gap-2 mb-1">
                       <Sprout size={16} className="text-amber-700" />
                       <span className="text-sm font-semibold text-amber-800">Solid Fibre</span>
                    </div>
                    <p className="text-xl font-bold text-amber-900">{fibreVol} <span className="text-sm font-normal">t/day</span></p>
                 </div>
               </div>

               {/* Viscosity Note */}
               {dryMatter > 12 && (
                 <div className="mt-3 text-xs bg-amber-50 text-amber-800 p-2 rounded border border-amber-100 flex gap-2">
                   <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                   High Dry Matter ({dryMatter}%) produces thicker digestate. Requires robust pumps and mixing.
                 </div>
               )}
            </div>

            {/* Nutrients Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-700 mb-4">Nutrient Values (Estimated)</h3>
               <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-slate-50 rounded-lg">
                     <p className="text-xs text-slate-500 font-bold uppercase mb-1 flex items-center justify-center">
                        Nitrogen <Tooltip text={DIGESTATE_TOOLTIPS.nitrogen} />
                     </p>
                     <p className="text-lg font-bold text-slate-800">{Math.round(dailyN)}</p>
                     <p className="text-[10px] text-slate-400">kg/day</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                     <p className="text-xs text-slate-500 font-bold uppercase mb-1 flex items-center justify-center">
                        Phosphate <Tooltip text={DIGESTATE_TOOLTIPS.phosphate} />
                     </p>
                     <p className="text-lg font-bold text-slate-800">{Math.round(dailyP)}</p>
                     <p className="text-[10px] text-slate-400">kg/day</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                     <p className="text-xs text-slate-500 font-bold uppercase mb-1 flex items-center justify-center">
                        Potash <Tooltip text={DIGESTATE_TOOLTIPS.potash} />
                     </p>
                     <p className="text-lg font-bold text-slate-800">{Math.round(dailyK)}</p>
                     <p className="text-[10px] text-slate-400">kg/day</p>
                  </div>
               </div>
               
               {isHighNFeedstock && (
                 <div className="mt-3 text-xs text-blue-600 bg-blue-50 p-2 rounded flex gap-2">
                   <Info size={14} className="shrink-0 mt-0.5" />
                   Selected feedstock has high nitrogen potential. Actual N values may be higher than estimated.
                 </div>
               )}
            </div>

          </div>

          {/* RIGHT COLUMN: Land & Compliance */}
          <div className="space-y-6">

            {/* Landbank Calculator */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                 <Map size={18} className="text-emerald-600" />
                 Landbank Requirement
                 <Tooltip text={DIGESTATE_TOOLTIPS.landbank} />
               </h3>
               
               <div className="flex items-end gap-2 mb-6">
                 <div className="flex-1">
                   <p className="text-3xl font-bold text-emerald-600 font-mono">{Math.round(landRequired)}</p>
                   <p className="text-sm text-slate-500 font-medium">Hectares Required / Year</p>
                 </div>
                 <div className="text-right text-xs text-slate-400 mb-1">
                   Based on 250kg N/ha limit
                 </div>
               </div>

               <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Check your available land:</label>
                  <div className="flex gap-3">
                    <input 
                      type="number" 
                      placeholder="Enter Hectares" 
                      value={userLand}
                      onChange={(e) => setUserLand(e.target.value)}
                      className="flex-1 p-2 rounded border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    />
                    <div className={`px-4 py-2 rounded font-bold text-sm flex items-center justify-center min-w-[100px] transition-colors ${
                      landStatus === 'sufficient' ? 'bg-emerald-100 text-emerald-700' :
                      landStatus === 'insufficient' ? 'bg-red-100 text-red-700' :
                      'bg-slate-200 text-slate-400'
                    }`}>
                      {landStatus === 'sufficient' ? 'Sufficient' : 
                       landStatus === 'insufficient' ? 'Shortfall' : 'Status'}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {landStatus === 'insufficient' && (
                       <motion.p 
                         initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                         className="text-xs text-red-600 mt-2 font-medium"
                       >
                         You need {Math.round(landRequired - userLandNum)} more hectares to spread legally. Consider exporting digestate.
                       </motion.p>
                    )}
                     {landStatus === 'sufficient' && (
                       <motion.p 
                         initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                         className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1"
                       >
                         <CheckCircle size={12} /> Your landbank is adequate for the plant output.
                       </motion.p>
                    )}
                  </AnimatePresence>
               </div>
            </div>

            {/* Compliance Card */}
            <div className="bg-gradient-to-br from-slate-100 to-white p-5 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                   <ShieldCheck size={18} className="text-brand" />
                   Compliance & Quality
                 </h3>
                 <ul className="space-y-3">
                    <li className="text-sm text-slate-600 flex gap-2">
                       <div className="w-1.5 h-1.5 bg-brand rounded-full mt-1.5 shrink-0" />
                       <span>
                         <strong>PAS 110:</strong> <Tooltip text={DIGESTATE_TOOLTIPS.pas110} />
                         Certified digestate is a 'product', not 'waste'.
                       </span>
                    </li>
                    <li className="text-sm text-slate-600 flex gap-2">
                       <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5 shrink-0" />
                       <span>
                         <strong>Separation:</strong> Essential for nutrient management. Phosphorous stays with the fibre; Nitrogen stays with the liquid.
                       </span>
                    </li>
                    {temperature === 'thermo' && (
                      <li className="text-sm text-slate-600 flex gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
                        <span>
                          <strong>Thermophilic Mode:</strong> Higher temperatures aid pathogen kill (Pasteurization equivalent).
                        </span>
                      </li>
                    )}
                 </ul>
               </div>
               <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-bl-full pointer-events-none" />
            </div>

          </div>
          
        </div>
    </div>
  );
};

export default DigestateExplorer;
