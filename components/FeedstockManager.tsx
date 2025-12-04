
import React, { useState } from 'react';
import { FEEDSTOCKS } from '../constants';
import { Plus, X, Info, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedstockMixItem {
  id: string;
  percentage: number;
}

interface FeedstockManagerProps {
  activeMix: FeedstockMixItem[];
  onMixChange: (mix: FeedstockMixItem[]) => void;
}

const FeedstockManager: React.FC<FeedstockManagerProps> = ({ activeMix, onMixChange }) => {
  const [viewMode, setViewMode] = useState<'mixer' | 'library'>('mixer');
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<string | null>(null);

  const handleAddFeedstock = (id: string) => {
    if (activeMix.find(item => item.id === id)) return;
    if (activeMix.length >= 3) return; // Limit to 3 for simplicity

    // Add new item with 0% initially, or split remaining?
    // Let's add with 10% and reduce others proportionally
    const newMix = [...activeMix, { id, percentage: 0 }];
    // Rebalance to give new item space is tricky, let's just add at 0 and let user adjust
    // OR: Normalize logic. Let's just add.
    onMixChange(newMix);
    setViewMode('mixer');
  };

  const handleRemoveFeedstock = (id: string) => {
    if (activeMix.length <= 1) return; // Prevent empty
    const remaining = activeMix.filter(item => item.id !== id);
    // Normalize remaining to 100%
    const totalCurrent = remaining.reduce((sum, item) => sum + item.percentage, 0);
    const normalized = remaining.map(item => ({
      ...item,
      percentage: Math.round((item.percentage / totalCurrent) * 100)
    }));
    // Fix rounding errors
    const sum = normalized.reduce((s, i) => s + i.percentage, 0);
    if (sum < 100) normalized[0].percentage += (100 - sum);
    
    onMixChange(normalized);
  };

  const handleSliderChange = (id: string, newValue: number) => {
    // Advanced Slider Logic: Update 'id' to 'newValue', adjust others proportionally to keep sum = 100
    const currentItem = activeMix.find(item => item.id === id);
    if (!currentItem) return;
    
    const oldValue = currentItem.percentage;
    const diff = newValue - oldValue;
    
    // If only one item, it must stay 100%
    if (activeMix.length === 1) return;

    // Others need to absorb the diff
    const others = activeMix.filter(item => item.id !== id);
    const totalOthers = others.reduce((sum, item) => sum + item.percentage, 0);

    let newMix = activeMix.map(item => {
      if (item.id === id) return { ...item, percentage: newValue };
      
      // Proportional reduction
      // If totalOthers is 0 (all others are 0), we can't divide. Just subtract equally?
      let newPct = item.percentage;
      if (totalOthers > 0) {
        const share = item.percentage / totalOthers;
        newPct = item.percentage - (diff * share);
      } else {
        // If others are 0, they stay 0 unless we are decreasing the main one?
        // Simple fallback: distribute equally
        newPct = item.percentage - (diff / others.length);
      }
      return { ...item, percentage: Math.max(0, newPct) };
    });

    // Final normalization to ensure exact 100 due to float math
    const total = newMix.reduce((sum, item) => sum + item.percentage, 0);
    // Adjust the modified item slightly if needed, or the largest other
    if (total !== 100) {
       // Find item with max percentage to absorb rounding error, prefer not the one being dragged
       const absorbIdx = newMix.findIndex(i => i.id !== id && i.percentage > 0) || 0;
       newMix[absorbIdx].percentage += (100 - total);
    }
    
    // Round all to integers for clean UI
    newMix = newMix.map(i => ({...i, percentage: Math.round(i.percentage)}));
    
    // One last check sum
    const finalSum = newMix.reduce((s, i) => s + i.percentage, 0);
    if (finalSum !== 100) {
       const idx = newMix.findIndex(i => i.id !== id); // adjust a neighbor
       if (idx >= 0) newMix[idx].percentage += (100 - finalSum);
    }

    onMixChange(newMix);
  };

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
      
      {/* Header Tabs */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setViewMode('mixer')}
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${viewMode === 'mixer' ? 'bg-white text-brand border-b-2 border-brand' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <Layers size={16} /> Mixer
        </button>
        <button 
          onClick={() => setViewMode('library')}
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${viewMode === 'library' ? 'bg-white text-brand border-b-2 border-brand' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          <Plus size={16} /> Library
        </button>
      </div>

      <div className="p-4">
        {viewMode === 'mixer' ? (
          <div className="space-y-4">
            {activeMix.map((item, idx) => {
              const fs = FEEDSTOCKS[item.id];
              return (
                <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
                   <div className="flex justify-between items-center mb-2">
                     <div className="flex items-center gap-2">
                       <div className={`w-3 h-3 rounded-full ${fs.styles.dotColor}`} />
                       <span className="font-bold text-slate-700 text-sm">{fs.name}</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <span className="font-mono font-bold text-brand">{item.percentage}%</span>
                       {activeMix.length > 1 && (
                         <button onClick={() => handleRemoveFeedstock(item.id)} className="text-slate-300 hover:text-red-500">
                           <X size={14} />
                         </button>
                       )}
                     </div>
                   </div>
                   <input 
                      type="range" min="0" max="100" 
                      value={item.percentage}
                      onChange={(e) => handleSliderChange(item.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand"
                   />
                </div>
              );
            })}
            
            {activeMix.length < 3 && (
              <button 
                onClick={() => setViewMode('library')}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-bold text-sm hover:border-brand hover:text-brand transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Feedstock
              </button>
            )}
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-800 flex gap-2">
               <Info size={16} className="shrink-0 mt-0.5" />
               <p>Adjusting one slider will automatically rebalance the others to keep the total at 100%.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Library View */}
             {!selectedLibraryItem ? (
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(FEEDSTOCKS).map(fs => {
                    const isSelected = activeMix.some(m => m.id === fs.id);
                    return (
                      <button 
                        key={fs.id}
                        onClick={() => setSelectedLibraryItem(fs.id)}
                        className={`p-3 rounded-lg border text-left transition-all ${isSelected ? 'bg-slate-100 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-brand hover:shadow-md'}`}
                      >
                         <div className={`w-2 h-2 rounded-full mb-2 ${fs.styles.dotColor}`} />
                         <p className="font-bold text-slate-700 text-xs mb-1">{fs.name}</p>
                         <p className="text-[10px] text-slate-400 truncate">{fs.description}</p>
                      </button>
                    )
                  })}
                </div>
             ) : (
                // Detail View
                <div className="bg-white rounded-lg">
                   <button onClick={() => setSelectedLibraryItem(null)} className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1 hover:text-brand">
                     <ArrowRight size={12} className="rotate-180" /> Back to list
                   </button>
                   
                   {(() => {
                     const fs = FEEDSTOCKS[selectedLibraryItem];
                     const isAdded = activeMix.some(m => m.id === fs.id);
                     return (
                       <div>
                          <div className="flex items-center gap-3 mb-4">
                             <div className={`p-3 rounded-xl ${fs.styles.iconBg} ${fs.styles.iconText}`}>
                               <Layers size={20} />
                             </div>
                             <div>
                               <h3 className="font-bold text-slate-800">{fs.name}</h3>
                               <p className="text-xs text-slate-500">{fs.description}</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-4">
                             <div className="p-2 bg-slate-50 rounded border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Gas Yield</p>
                                <p className="text-sm font-bold text-slate-700">{fs.expectedGasYield}</p>
                             </div>
                             <div className="p-2 bg-slate-50 rounded border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Methane</p>
                                <p className="text-sm font-bold text-slate-700">{fs.methaneContent}</p>
                             </div>
                             <div className="p-2 bg-slate-50 rounded border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">DM Range</p>
                                <p className="text-sm font-bold text-slate-700">{fs.dmRange}</p>
                             </div>
                             <div className="p-2 bg-slate-50 rounded border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Nitrogen</p>
                                <p className="text-sm font-bold text-slate-700">{fs.nitrogenPotential}</p>
                             </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                             <p className="text-xs text-slate-600"><strong className="text-slate-800">Note:</strong> {fs.operationalNotes}</p>
                             <p className="text-xs text-slate-600"><strong className="text-slate-800">Contamination:</strong> {fs.contaminationNotes}</p>
                          </div>

                          <button 
                            onClick={() => handleAddFeedstock(fs.id)}
                            disabled={isAdded || activeMix.length >= 3}
                            className={`w-full py-3 rounded-lg font-bold text-sm transition-colors ${
                              isAdded ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 
                              activeMix.length >= 3 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                              'bg-brand text-white hover:bg-orange-600'
                            }`}
                          >
                             {isAdded ? 'Already in Mix' : activeMix.length >= 3 ? 'Mixer Full (Max 3)' : 'Add to Mixer'}
                          </button>
                       </div>
                     )
                   })()}
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedstockManager;
