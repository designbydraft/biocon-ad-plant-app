
import React, { useState, useEffect } from 'react';
import { PlantPart, Feedstock } from '../constants';
import { X, ChevronRight, Zap, Activity, AlertCircle, ChevronDown, ChevronUp, Wrench, TrendingUp, AlertTriangle, Lightbulb, ShieldCheck, LucideIcon, FlaskConical, CircleDollarSign, Scale, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoPanelProps {
  part: PlantPart | null;
  currentFeedstock: Feedstock;
  metrics: { gas: number; power: string };
  onClose: () => void;
}

interface AccordionSectionProps {
  title: string;
  icon: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, icon: Icon, isOpen, onToggle, children }) => {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600">
            <Icon size={18} />
          </div>
          <span className="font-bold text-slate-700 text-sm md:text-base">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-slate-100 text-slate-600 text-sm leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InfoPanel: React.FC<InfoPanelProps> = ({ part, currentFeedstock, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [openSection, setOpenSection] = useState<string>('overview');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setOpenSection('overview');
  }, [part]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? '' : section);
  };

  const panelVariants = {
    hidden: isMobile ? { y: '100%' } : { x: '100%' },
    visible: isMobile ? { y: 0 } : { x: 0 },
    exit: isMobile ? { y: '100%' } : { x: '100%' }
  };

  if (!part) return null;

  return (
    <AnimatePresence>
        <motion.div
          key="panel"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={panelVariants}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed z-50 bg-white shadow-2xl flex flex-col pointer-events-auto border-l border-slate-100
            bottom-0 left-0 right-0 h-[75vh] md:h-full rounded-t-2xl md:rounded-none md:top-0 md:w-[500px] md:left-auto"
        >
          {/* Header */}
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
            
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/50">
            
            <p className="text-slate-700 leading-relaxed text-base md:text-lg bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              {part.fullDescription}
            </p>

            {/* Special "Material Profile" Section ONLY when viewing Feedstock */}
            {part.id === 'feedstock' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <FlaskConical size={18} className="text-brand" />
                    Material Profile: {currentFeedstock.name}
                  </h3>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                   <div className="col-span-1 space-y-1">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gas Yield</p>
                     <p className="text-sm font-semibold text-slate-700">{currentFeedstock.expectedGasYield}</p>
                   </div>
                   <div className="col-span-1 space-y-1">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Methane %</p>
                     <p className="text-sm font-semibold text-slate-700">{currentFeedstock.methaneContent}</p>
                   </div>
                   <div className="col-span-1 space-y-1">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contamination</p>
                     <p className={`text-sm font-semibold ${currentFeedstock.styles.alertTitle}`}>{currentFeedstock.contaminationRisk}</p>
                   </div>
                   <div className="col-span-1 space-y-1">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Revenue Route</p>
                     <p className="text-sm font-semibold text-slate-700">{currentFeedstock.revenueRoutes}</p>
                   </div>
                   <div className="col-span-2 space-y-1 pt-2 border-t border-slate-100">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Filter size={12} /> Required Pre-treatment
                     </p>
                     <p className="text-sm text-slate-600">{currentFeedstock.requiredPreTreatment}</p>
                   </div>
                   <div className="col-span-2 space-y-1">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Digestate Quality</p>
                     <p className="text-sm text-slate-600">{currentFeedstock.digestateCharacteristics}</p>
                   </div>
                </div>
              </div>
            )}

            {/* General Impact Alert (Hidden for Feedstock Part as it's covered above) */}
            {currentFeedstock.impacts[part.id] && part.id !== 'feedstock' && (
                <div 
                  className={`rounded-xl p-4 border-l-4 ${currentFeedstock.styles.alertBg} ${currentFeedstock.styles.alertBorder}`}
                >
                  <h3 className={`text-sm font-bold mb-1 ${currentFeedstock.styles.alertTitle} flex items-center gap-2`}>
                    <AlertCircle size={16} />
                    Impact of {currentFeedstock.name}
                  </h3>
                  <p className={`${currentFeedstock.styles.alertText} text-sm leading-relaxed`}>
                    {currentFeedstock.impacts[part.id]}
                  </p>
                </div>
            )}

            {/* Educational Accordions */}
            <div className="space-y-3">
              
              <AccordionSection 
                title="Process Detail" 
                icon={Activity} 
                isOpen={openSection === 'overview'} 
                onToggle={() => toggleSection('overview')}
              >
                {part.whatItDoes}
              </AccordionSection>

              <AccordionSection 
                title="Equipment Types" 
                icon={Wrench} 
                isOpen={openSection === 'equipment'} 
                onToggle={() => toggleSection('equipment')}
              >
                <ul className="space-y-2">
                  {part.equipmentTypes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionSection>

              <AccordionSection 
                title="Performance Considerations" 
                icon={TrendingUp} 
                isOpen={openSection === 'performance'} 
                onToggle={() => toggleSection('performance')}
              >
                <ul className="space-y-2">
                  {part.performance.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionSection>

              <AccordionSection 
                title="Common Issues" 
                icon={AlertTriangle} 
                isOpen={openSection === 'issues'} 
                onToggle={() => toggleSection('issues')}
              >
                 <ul className="space-y-2">
                  {part.commonIssues.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionSection>

              <AccordionSection 
                title="Optimisation Tips" 
                icon={Lightbulb} 
                isOpen={openSection === 'optimisation'} 
                onToggle={() => toggleSection('optimisation')}
              >
                 <ul className="space-y-2">
                  {part.optimisation.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionSection>

               <AccordionSection 
                title="Regulatory Requirements" 
                icon={ShieldCheck} 
                isOpen={openSection === 'regulations'} 
                onToggle={() => toggleSection('regulations')}
              >
                 <ul className="space-y-2">
                  {part.regulations.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionSection>

            </div>

            {/* Technical Stats Footer */}
            <section className="mt-4 pt-4 border-t border-slate-200">
               <div className="flex flex-wrap gap-2">
                {part.technicalDetails.map((detail, idx) => (
                  <span key={idx} className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                    {detail}
                  </span>
                ))}
               </div>
            </section>
          </div>
        </motion.div>
    </AnimatePresence>
  );
};

export default InfoPanel;
