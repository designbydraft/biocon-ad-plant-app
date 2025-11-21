
import React, { useState, useEffect } from 'react';
import { PlantPart, Feedstock } from '../constants';
import { X, ChevronRight, Zap, Activity, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoPanelProps {
  part: PlantPart | null;
  currentFeedstock: Feedstock;
  metrics: { gas: number; power: string };
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ part, currentFeedstock, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset state when part changes
  useEffect(() => {
    setIsExpanded(false);
  }, [part]);

  // Animation variants based on device
  const panelVariants = {
    hidden: isMobile ? { y: '100%' } : { x: '100%' },
    visible: isMobile ? { y: 0 } : { x: 0 },
    exit: isMobile ? { y: '100%' } : { x: '100%' }
  };

  return (
    <AnimatePresence>
      {part && (
        <motion.div
          key="panel"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={panelVariants}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed z-50 bg-white shadow-2xl flex flex-col pointer-events-auto border-l border-slate-100
            bottom-0 left-0 right-0 h-[60vh] rounded-t-2xl md:rounded-none md:top-0 md:h-full md:w-[450px] md:left-auto"
        >
          {/* Header with Color Coding */}
          <div 
            className="p-4 md:p-6 text-white relative overflow-hidden shrink-0 rounded-t-2xl md:rounded-none"
            style={{ backgroundColor: part.color }}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/90 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors z-50 cursor-pointer"
              aria-label="Close details"
            >
              <X size={24} />
            </button>
            
            <div className="relative z-10 pr-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">{part.title}</h2>
              <p className="text-white/90 text-sm md:text-lg font-medium leading-snug">{part.shortDescription}</p>
            </div>
            
            {/* Decorative Circle */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8">
            
            {/* Main Description with Expandable Section */}
            <section>
              <h3 className="text-xs md:text-sm uppercase tracking-wider text-slate-400 font-bold mb-2 md:mb-3 flex items-center gap-2">
                <Activity size={16} /> Process Overview
              </h3>
              <p className="text-slate-700 leading-relaxed text-base md:text-lg mb-3">
                {part.fullDescription}
              </p>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed border-l-2 border-slate-200 pl-4 my-2">
                      {part.expandedContent}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-2 transition-colors"
              >
                {isExpanded ? (
                  <>Read less <ChevronUp size={16} /></>
                ) : (
                  <>Read more <ChevronDown size={16} /></>
                )}
              </button>
            </section>

            {/* Feedstock Specific Impact Section - Shows only if impact exists */}
            {currentFeedstock.impacts[part.id] && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-4 border-l-4 ${currentFeedstock.styles.alertBg} ${currentFeedstock.styles.alertBorder}`}
                >
                  <h3 className={`text-sm font-bold mb-1 ${currentFeedstock.styles.alertTitle} flex items-center gap-2`}>
                    <AlertCircle size={16} />
                    Impact of {currentFeedstock.name}
                  </h3>
                  <p className={`${currentFeedstock.styles.alertText} text-sm leading-relaxed`}>
                    {currentFeedstock.impacts[part.id]}
                  </p>
                </motion.div>
            )}

            {/* Technical Stats */}
            <section className="bg-slate-50 rounded-xl p-4 md:p-5 border border-slate-100">
              <h3 className="text-xs md:text-sm uppercase tracking-wider text-slate-400 font-bold mb-2 md:mb-3 flex items-center gap-2">
                <Zap size={16} /> Key Specifications
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {part.technicalDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm md:text-base">
                    <ChevronRight size={16} className="mt-1 text-slate-400 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoPanel;
