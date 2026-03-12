import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Volume2, X, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ChatAssistant = ({ 
  messages, onSendMessage, isTyping, onClose, onSpeak, onStop, isSpeaking, t 
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[200] w-full max-w-[400px] h-[600px] bg-white rounded-[40px] shadow-2xl border border-stone-100 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 bg-emerald-600 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-serif font-medium">{t.aiAssistant}</h3>
            <p className="text-[10px] uppercase tracking-widest opacity-70">{t.online}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button 
              onClick={onStop}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
              title="Stop Speaking"
            >
              <X size={16} />
              Stop
            </button>
          )}
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/50">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-stone-200 text-stone-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className="space-y-2">
                <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-stone-900 text-white rounded-tr-none' 
                    : 'bg-white text-stone-800 shadow-sm border border-stone-100 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onSpeak(msg.content)}
                      className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:opacity-70 transition-opacity"
                    >
                      <Volume2 size={12} />
                      {t.listen}
                    </button>
                    {isSpeaking && (
                      <button 
                        onClick={onStop}
                        className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-widest hover:opacity-70 transition-opacity"
                      >
                        <X size={12} />
                        {t.stop}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm border border-stone-100">
              <Loader2 size={16} className="animate-spin text-emerald-600" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-6 bg-white border-t border-stone-100">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.askAnything}
            className="w-full py-4 pl-6 pr-14 bg-stone-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChatAssistant;
