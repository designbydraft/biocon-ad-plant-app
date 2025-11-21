import React, { useState, useEffect, useRef } from 'react';
import { PlantPart, Feedstock } from '../constants';
import { X, ChevronRight, Zap, Activity, MessageSquare, Send, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askGeminiAboutPlant } from '../services/geminiService';

interface InfoPanelProps {
  part: PlantPart | null;
  currentFeedstock: Feedstock;
  metrics: { gas: number; power: string };
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ part, currentFeedstock, metrics, onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset chat when part changes
  useEffect(() => {
    setQuestion('');
    setAnswer(null);
    setIsLoading(false);
  }, [part, currentFeedstock]);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !part) return;

    setIsLoading(true);
    setAnswer(null);
    
    const response = await askGeminiAboutPlant(question, part.id, currentFeedstock, metrics);
    
    setAnswer(response);
    setIsLoading(false);
  };

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
            
            {/* Main Description */}
            <section>
              <h3 className="text-xs md:text-sm uppercase tracking-wider text-slate-400 font-bold mb-2 md:mb-3 flex items-center gap-2">
                <Activity size={16} /> Process Overview
              </h3>
              <p className="text-slate-700 leading-relaxed text-base md:text-lg">
                {part.fullDescription}
              </p>
            </section>

            {/* Feedstock Specific Impact Section - Shows only if impact exists */}
            {currentFeedstock.impacts[part.id] && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-4 border-l-4 bg-${currentFeedstock.themeClass}-50 border-${currentFeedstock.themeClass}-500`}
                >
                  <h3 className={`text-sm font-bold mb-1 text-${currentFeedstock.themeClass}-800 flex items-center gap-2`}>
                    <AlertCircle size={16} />
                    Impact of {currentFeedstock.name}
                  </h3>
                  <p className={`text-${currentFeedstock.themeClass}-900 text-sm leading-relaxed`}>
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

            {/* AI Assistant Section */}
            <section className="border-t border-slate-100 pt-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-4 md:p-5 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-4 text-indigo-900">
                    <MessageSquare size={20} className="text-indigo-600" />
                    <h3 className="font-bold">Ask Engineering AI</h3>
                  </div>
                  
                  {/* Chat Output */}
                  {answer && (
                    <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-lg shadow-sm text-slate-700 text-sm mb-4 border border-indigo-50"
                    >
                      <p>{answer}</p>
                    </motion.div>
                  )}

                  {/* Chat Input */}
                  <form onSubmit={handleAskAI} className="relative">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder={`Ask about ${part.title.toLowerCase()}...`}
                      className="w-full pl-4 pr-12 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm shadow-sm"
                      disabled={isLoading}
                    />
                    <button 
                    type="submit"
                    disabled={isLoading || !question}
                    className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                  </form>
                  <p className="text-xs text-indigo-400 mt-2 text-center">
                    AI context aware of {currentFeedstock.name} and real-time data.
                  </p>
                </div>
            </section>
            
            <div ref={messagesEndRef} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoPanel;