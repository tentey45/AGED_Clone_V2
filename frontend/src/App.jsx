import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Bot, Sidebar as SidebarIcon, Check, AlertCircle } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

import './index.css';
import LandingPage from './components/layout/LandingPage';
import Sidebar from './components/chat/Sidebar';
import ChatMessage from './components/chat/ChatMessage';
import ChatInput from './components/chat/ChatInput';
import Thinking from './components/chat/Thinking';

function App() {
  const [persona, setPersona] = useState(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [nextActions, setNextActions] = useState([]);
  const [error, setError] = useState(null);
  const [docType, setDocType] = useState('auto');
  const [copyStatus, setCopyStatus] = useState(null); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const docOptions = {
    developer: [
      { value: 'auto', label: 'Auto-detect' },
      { value: 'README.md', label: 'README.md' },
      { value: 'Technical Spec', label: 'Technical Spec' },
      { value: 'API Reference', label: 'API Reference' },
      { value: 'Project Status', label: 'Project Status' }
    ],
    learner: [
      { value: 'auto', label: 'Auto-detect' },
      { value: 'Code Discovery', label: 'Code Discovery' },
      { value: 'Line-by-Line Analysis', label: 'Line-by-Line Analysis' },
      { value: 'High-Level Overview', label: 'High-Level Overview' },
      { value: 'Step-by-Step Tutorial', label: 'Step-by-Step Tutorial' }
    ]
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming, isThinking]);

  const handleSendMessage = async (textOverride = null) => {
    const text = textOverride || inputText;
    if (!text.trim() || isStreaming) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsThinking(true);
    setError(null);
    setNextActions([]);

    try {
      // API logic simplified for Vercel deployment
      const isLocal = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
      const API_URL = isLocal ? 'http://127.0.0.1:8000' : '';
      
      const response = await fetch(`${API_URL}/api/chat-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          user_context: persona,
          preferences: { doc_type: docType }
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Connection failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponseText = '';
      let done = false;

      setIsThinking(false);
      setIsStreaming(true);

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          aiResponseText += chunk;
          
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = aiResponseText;
            return newMessages;
          });
        }
      }

      setIsStreaming(false);

      if (aiResponseText.includes("**Next Steps:**")) {
        const parts = aiResponseText.split("**Next Steps:**");
        const stepsSection = parts[1].trim();
        const extractedSteps = stepsSection
          .split('\n')
          .filter(line => line.trim().match(/^[1-3]\./))
          .map(line => line.trim().replace(/^[1-3]\.\s*/, ''))
          .filter(Boolean);
        setNextActions(extractedSteps.slice(0, 3));
      }

    } catch (err) {
      setError(err.message);
      setIsThinking(false);
      setIsStreaming(false);
    }
  };

  const handleCopy = (text, idx) => {
    const contentLines = text.split('**Next Steps:**')[0].trim().split('\n');
    const cleanLines = contentLines.map(line => {
        let l = line.trim();
        l = l.replace(/^[#]+\s+/, '');
        l = l.replace(/^[\*\-\+]\s+/, '• ');
        l = l.replace(/\*\*(.*?)\*\*/g, '$1');
        l = l.replace(/`(.*?)`/g, '$1');
        return l;
    });

    navigator.clipboard.writeText(cleanLines.join('\n')).then(() => {
      setCopyStatus(idx);
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  const handleDownloadPDF = (content) => {
    const printWindow = window.open('', '_blank');
    const formattedContent = content.split('**Next Steps:**')[0]
      .replace(/^# (.*$)/gim, '<h1 style="color:#000;margin-bottom:20px;">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 style="color:#000;border-bottom:1px solid #ccc;padding-bottom:5px;margin-top:30px;">$1</h2>')
      .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
      .replace(/`(.*?)`/g, '<span style="color:#0056b3;font-family:monospace;font-weight:500;">$1</span>')
      .replace(/\n\n/gim, '<br><br>')
      .replace(/\n/gim, '<br>');

    printWindow.document.write(`
      <html><head><style>body{font-family:sans-serif;padding:60px;color:#000;line-height:1.8;max-width:850px;margin:0 auto;}</style></head><body>
      <div style="font-size:11px;color:#777;margin-bottom:40px;">PERSONA: ${persona.toUpperCase()} | ${new Date().toLocaleDateString()}</div>
      ${formattedContent}</body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const handleDownloadDoc = (content, index) => {
    const lines = content.split('**Next Steps:**')[0].trim().split('\n');
    const paragraphs = lines.map(line => {
        const text = line.trim();
        if (text.startsWith('# ')) return new Paragraph({ text: text.replace('# ', ''), heading: HeadingLevel.HEADING_1 });
        if (text.startsWith('## ')) return new Paragraph({ text: text.replace('## ', ''), heading: HeadingLevel.HEADING_2 });
        const runs = [];
        const regex = /(\*\*.*?\*\*|`.*?`)/g;
        let match, lastIdx = 0;
        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIdx) runs.push(new TextRun(text.slice(lastIdx, match.index)));
            const chunk = match[0];
            if (chunk.startsWith('**')) runs.push(new TextRun({ text: chunk.replace(/\*\*/g, ''), bold: true }));
            else if (chunk.startsWith('`')) runs.push(new TextRun({ text: chunk.replace(/`/g, ''), color: "0056B3" }));
            lastIdx = regex.lastIndex;
        }
        if (lastIdx < text.length) runs.push(new TextRun(text.slice(lastIdx)));
        return new Paragraph({ children: runs.length > 0 ? runs : [new TextRun(text)] });
    });
    const doc = new Document({ sections: [{ children: paragraphs }] });
    Packer.toBlob(doc).then(blob => saveAs(blob, `AGED_Export_${index}.docx`));
  };

  if (!persona) {
    return <LandingPage onSelect={(mode) => setPersona(mode)} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen p-0 md:p-4 gap-0 md:gap-4 overflow-hidden bg-aged-dark">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 glass rounded-none border-t-0 border-x-0 relative z-50 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="text-aged-cyan" size={20} />
          <h2 className="text-sm font-bold tracking-widest text-white">AGED AI</h2>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 glass">
          <SidebarIcon size={18} className="text-aged-cyan" />
        </button>
      </div>

      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        persona={persona}
        docType={docType}
        setDocType={setDocType}
        docOptions={docOptions}
        handleResetPersona={() => setPersona(null)}
        handleClearSession={() => setMessages([])}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="glass flex-1 flex flex-col overflow-hidden m-0 md:rounded-2xl border-none md:border md:border-white/10 relative z-10 bg-white/[0.02]">
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-10 scroll-smooth custom-scrollbar">
            {messages.length === 0 && !isThinking && (
              <div className="h-full flex flex-col items-center justify-center opacity-40 text-center px-6">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-aged-cyan/20 blur-2xl rounded-full"></div>
                  <Bot size={64} className="text-aged-cyan relative" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase tracking-[0.2em]">System Online</h2>
                <p className="text-sm text-slate-400 mt-4 max-w-xs">Enter a query to architect premium documentation or receive strategic guidance.</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <ChatMessage 
                key={idx}
                msg={msg}
                idx={idx}
                isStreaming={isStreaming && idx === messages.length - 1}
                isLast={idx === messages.length - 1}
                copyStatus={copyStatus}
                nextActions={nextActions}
                handleCopy={handleCopy}
                handleDownloadDoc={handleDownloadDoc}
                handleDownloadPDF={handleDownloadPDF}
                handleSendMessage={handleSendMessage}
              />
            ))}

            {isThinking && <Thinking />}

            {error && (
              <div className="glass p-4 border-l-4 border-red-500 bg-red-500/5 max-w-lg mx-auto mb-6">
                <div className="flex items-center gap-3 text-red-500">
                  <AlertCircle size={20} />
                  <p className="text-xs font-bold uppercase tracking-widest">Breach Detected: {error}</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput 
            inputText={inputText}
            setInputText={setInputText}
            handleSendMessage={handleSendMessage}
            isStreaming={isStreaming}
            isThinking={isThinking}
            docType={docType}
            persona={persona}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
