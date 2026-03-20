import React from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ 
  inputText, 
  setInputText, 
  handleSendMessage, 
  isStreaming, 
  isThinking, 
  docType, 
  persona 
}) => {
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 md:p-8 mt-auto relative z-10 w-full">
      <div className="glass bg-white/5 border border-white/10 focus-within:border-aged-cyan/50 focus-within:ring-4 focus-within:ring-aged-cyan/5 p-2 md:p-3 flex items-center gap-3 md:gap-4 transition-all duration-300 rounded-2xl">
        <textarea
          placeholder={`Query for ${docType === 'auto' ? 'General' : docType} as ${persona}...`}
          className="flex-1 bg-transparent border-none text-white text-sm md:text-base resize-none outline-none py-2 px-3 md:px-4 max-h-40 min-h-[44px]"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
          }}
          onKeyDown={onKeyDown}
          rows={1}
        />
        <button 
          className="bg-aged-cyan text-black w-11 md:w-12 h-11 md:h-12 rounded-xl flex items-center justify-center hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:scale-105 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all shrink-0 shadow-lg"
          onClick={() => handleSendMessage()}
          disabled={isStreaming || isThinking || !inputText.trim()}
        >
          <Send size={20} />
        </button>
      </div>
      <p className="text-[9px] text-center text-slate-500 mt-3 uppercase tracking-[0.3em] font-medium opacity-50 font-mono">
        AGED Integrated Intelligence v4.1 • Secure Core x64
      </p>
    </div>
  );
};

export default ChatInput;
