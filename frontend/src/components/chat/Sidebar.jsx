import React from 'react';
import { Sparkles, FileCode, FileText, RefreshCw, Trash2, Check, X } from 'lucide-react';

const Sidebar = ({ 
  isOpen, 
  onClose, 
  persona, 
  docType, 
  setDocType, 
  docOptions, 
  handleResetPersona, 
  handleClearSession 
}) => {
  return (
    <>
      <aside className={`
        fixed md:relative z-50 inset-y-0 left-0 w-[280px] md:w-[280px] 
        glass shadow-2xl md:shadow-none p-6 flex flex-col shrink-0 
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full md:translate-x-0 opacity-0 md:opacity-100'}
      `}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="text-aged-cyan fill-aged-cyan" size={22} />
            <h2 className="text-lg font-bold">AGED CORE</h2>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400">
             <X size={20} className="text-aged-cyan" />
          </button>
        </div>

        <div className="flex flex-col gap-6 flex-1">
          <div className="glass p-4 border-l-4 border-aged-cyan">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Active Persona</p>
            <h4 className="capitalize font-bold text-aged-cyan">{persona}</h4>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
              <FileCode size={12} /> Doc Format
            </p>
            <div className="relative">
              <select 
                value={docType} 
                onChange={(e) => setDocType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-aged-cyan appearance-none cursor-pointer"
              >
                {docOptions[persona]?.map(opt => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <FileText size={14} />
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <button 
              onClick={handleResetPersona} 
              className="glass py-2.5 flex items-center justify-center gap-2 text-xs font-semibold hover:border-aged-cyan transition-colors"
            >
              <RefreshCw size={14} /> Reset Persona
            </button>
            <button 
              onClick={handleClearSession} 
              className="glass py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-red-400 hover:border-red-500/50 transition-colors"
            >
              <Trash2 size={14} /> Clear Session
            </button>
          </div>
        </div>
      </aside>

      {/* Click overlay for mobile sidebar */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
