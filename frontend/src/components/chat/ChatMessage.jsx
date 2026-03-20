import React from 'react';
import { User, Bot, Copy, FileText, Download, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { BookOpen } from 'lucide-react';

const ChatMessage = ({ 
  msg, 
  idx, 
  isStreaming, 
  isLast, 
  copyStatus, 
  nextActions, 
  handleCopy, 
  handleDownloadDoc, 
  handleDownloadPDF, 
  handleSendMessage 
}) => {
  const isUser = msg.role === 'user';

  if (isUser) {
    return (
      <div className="max-w-[95%] md:max-w-[85%] animate-message-in ml-auto">
        <div className="bg-aged-cyan/10 border border-aged-cyan/20 px-5 md:px-6 py-3.5 md:py-4 rounded-2xl rounded-br-none shadow-[0_0_15px_rgba(0,242,255,0.05)]">
          <div className="flex items-start gap-3">
            <User size={16} className="mt-1 text-aged-cyan shrink-0" />
            <p className="text-sm md:text-base leading-relaxed text-white/90">{msg.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[95%] md:max-w-[85%] animate-message-in">
      <div className="glass bg-white/[0.03] p-5 md:p-8 rounded-2xl md:rounded-3xl rounded-bl-none overflow-hidden relative group">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-aged-cyan">
            <Bot size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">AGED v4.1 CORE</span>
          </div>
          <div className="flex gap-1.5 md:gap-2">
            <button 
              onClick={() => handleCopy(msg.content, idx)} 
              title="Copy Content" 
              className="w-8 h-8 md:w-9 md:h-9 glass flex items-center justify-center text-slate-400 hover:text-aged-cyan hover:border-aged-cyan transition-all"
            >
              {copyStatus === idx ? <Check size={14} className="text-aged-cyan" /> : <Copy size={14} />}
            </button>
            <button 
              onClick={() => handleDownloadDoc(msg.content, idx)} 
              title="Export DOCX" 
              className="w-8 h-8 md:w-9 md:h-9 glass flex items-center justify-center text-slate-400 hover:text-aged-cyan hover:border-aged-cyan transition-all"
            >
              <FileText size={14} />
            </button>
            <button 
              onClick={() => handleDownloadPDF(msg.content)} 
              title="Export PDF" 
              className="w-8 h-8 md:w-9 md:h-9 glass flex items-center justify-center text-slate-400 hover:text-aged-cyan hover:border-aged-cyan transition-all"
            >
              <Download size={14} />
            </button>
          </div>
        </div>
        
        <div className="prose prose-sm md:prose-base prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-white prose-headings:font-bold prose-headings:mb-4 prose-code:text-aged-cyan prose-code:bg-white/5 prose-code:px-1.5 prose-code:rounded">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="my-4 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                    <SyntaxHighlighter 
                      style={vscDarkPlus} 
                      language={match[1]} 
                      PreTag="div" 
                      customStyle={{ padding: '1.25rem', background: 'transparent' }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : ( 
                  <code className="bg-white/10 px-1.5 py-0.5 rounded text-aged-cyan text-[0.9em]" {...props}>
                    {children}
                  </code> 
                );
              }
            }}
          >
            {msg.content}
          </ReactMarkdown>
        </div>

        {isLast && !isStreaming && nextActions.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/5">
            <h4 className="flex items-center gap-2 text-aged-cyan text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              <BookOpen size={14} /> Strategic Escalation
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {nextActions.map((action, i) => (
                <button 
                  key={i} 
                  className="glass py-2.5 px-4 text-xs text-left hover:border-aged-cyan/50 hover:bg-aged-cyan/5 transition-all text-white/80" 
                  onClick={() => handleSendMessage(action)}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
