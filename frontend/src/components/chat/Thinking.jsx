import React from 'react';
import { Loader2 } from 'lucide-react';

const Thinking = () => {
  return (
    <div className="flex flex-col gap-3 px-4 py-8 animate-pulse text-aged-cyan">
      <div className="flex items-center gap-3">
        <Loader2 className="animate-spin" size={18} />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Neural Processing...</span>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="h-2 w-48 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-aged-cyan/40 animate-loading-bar"></div>
        </div>
        <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-aged-cyan/20 animate-loading-bar-slow"></div>
        </div>
      </div>
    </div>
  );
};

export default Thinking;
