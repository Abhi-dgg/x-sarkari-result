import React, { useState } from 'react';
import { 
  X, Send, Sparkles, Bot, ShieldCheck, Copy, Check, 
  ExternalLink, HelpCircle, Loader2, ArrowRight 
} from 'lucide-react';

export type AIModelType = 'gpt-4o' | 'claude-3-5' | 'grok' | 'gemini';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const MODEL_OPTIONS: { id: AIModelType; name: string; badge: string; creator: string; color: string }[] = [
  { id: 'gpt-4o', name: 'GPT-4o', badge: 'ChatGPT', creator: 'OpenAI', color: 'bg-emerald-600 text-white' },
  { id: 'claude-3-5', name: 'Claude 3.5', badge: 'Claude', creator: 'Anthropic', color: 'bg-amber-600 text-white' },
  { id: 'grok', name: 'Grok-2', badge: 'Grok', creator: 'xAI', color: 'bg-indigo-600 text-white' },
  { id: 'gemini', name: 'Gemini 2.5', badge: 'Gemini', creator: 'Google', color: 'bg-blue-600 text-white' }
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  modelUsed?: string;
  verifiedOfficialLinks?: { label: string; url: string }[];
  timestamp: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  initialQuery = ''
}) => {
  const [selectedModel, setSelectedModel] = useState<AIModelType>('gpt-4o');
  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedLinkIndex, setCopiedLinkIndex] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Namaste! I am your Sarkari Exam AI Assistant.\nYou can choose to ask questions using **GPT-4o (OpenAI)**, **Claude 3.5 (Anthropic)**, **Grok (xAI)**, or **Gemini**.\n\nAsk me anything about:\n- SSC GD / CGL eligibility, age relaxation, and running criteria\n- RRB NTPC vacancies, CBT syllabus, and selection process\n- UP Police, Bihar Police, or UPSC notifications and official links!`,
      modelUsed: 'Multi-Model AI (GPT / Claude / Grok)',
      timestamp: 'Just now'
    }
  ]);

  const quickPrompts = [
    'SSC GD 2026 Running Distance & Time',
    'RRB NTPC CEN 05/2026 Age Relaxation',
    'UP Police Constable Answer Key Link',
    'SSC CGL Tier 1 Syllabus & Negative Marking'
  ];

  const handleSend = async (queryToSend?: string) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          model: selectedModel
        })
      });

      if (!res.ok) throw new Error('AI response failed');

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Information retrieved.',
        modelUsed: data.modelName || selectedModel,
        verifiedOfficialLinks: data.verifiedOfficialLinks || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `Error connecting to AI service. Please check your network or try another model.\n${err?.message || ''}`,
        modelUsed: selectedModel,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLinkIndex(id);
    setTimeout(() => setCopiedLinkIndex(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-gray-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 bg-[#0f2347] text-white flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Bot className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wide flex items-center gap-2">
                <span>Sarkari AI Assistant</span>
                <span className="text-[10px] bg-yellow-400 text-black px-1.5 py-0.5 rounded font-extrabold uppercase">
                  GPT / Claude / Grok
                </span>
              </h2>
              <p className="text-xs text-blue-200">
                Direct government exam answers & official links
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-800 rounded-md transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Model Switcher Bar */}
        <div className="p-2.5 bg-gray-100 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700">
          <div className="text-[11px] font-bold text-gray-600 dark:text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Select AI Engine:</span>
            <span className="text-emerald-700 dark:text-emerald-400">
              Active: {MODEL_OPTIONS.find(m => m.id === selectedModel)?.name}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {MODEL_OPTIONS.map((model) => {
              const isSelected = selectedModel === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  type="button"
                  className={`py-1.5 px-2 rounded text-xs font-bold transition-all text-center cursor-pointer border ${
                    isSelected
                      ? `${model.color} border-transparent shadow-xs scale-102`
                      : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:border-gray-400'
                  }`}
                >
                  <div className="truncate">{model.badge}</div>
                  <div className="text-[9px] opacity-80 truncate">{model.creator}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-xl p-3.5 text-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#1e40af] text-white rounded-br-none'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-bl-none border border-gray-200 dark:border-slate-700'
                }`}
              >
                {/* Model badge if AI */}
                {msg.sender === 'ai' && msg.modelUsed && (
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-700 dark:text-blue-400 mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{msg.modelUsed}</span>
                  </div>
                )}

                {/* Message Text formatted */}
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </div>

                {/* Verified Links if any */}
                {msg.verifiedOfficialLinks && msg.verifiedOfficialLinks.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-gray-200 dark:border-slate-700 space-y-1.5">
                    <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Official Portal Links:</span>
                    </div>
                    {msg.verifiedOfficialLinks.map((link, idx) => {
                      const linkId = `${msg.id}-link-${idx}`;
                      const isCopied = copiedLinkIndex === linkId;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 p-1.5 bg-white dark:bg-slate-900 rounded border border-gray-200 dark:border-slate-700 text-xs"
                        >
                          <span className="font-semibold truncate text-gray-800 dark:text-slate-200">
                            {link.label}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleCopy(link.url, linkId)}
                              type="button"
                              className="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 transition-colors cursor-pointer border border-gray-300 dark:border-slate-600 inline-flex items-center gap-1"
                              title="Copy link to clipboard"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{isCopied ? 'Copied' : 'Copy'}</span>
                            </button>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-700 hover:bg-blue-600 text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <span>Open</span>
                              <ExternalLink className="w-3 h-3 text-yellow-300" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg border border-gray-200 dark:border-slate-700 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Querying {MODEL_OPTIONS.find(m => m.id === selectedModel)?.name}...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 overflow-x-auto">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
            Suggested Questions:
          </div>
          <div className="flex gap-1.5 whitespace-nowrap">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                type="button"
                className="text-xs bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-300 dark:border-slate-700 px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask ${MODEL_OPTIONS.find(m => m.id === selectedModel)?.name} about exams, eligibility...`}
              disabled={isLoading}
              className="flex-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-3.5 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="bg-[#1e40af] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1.5 text-center">
            AI answers are grounded in official notices. Always cross-check with official gazettes.
          </p>
        </div>

      </div>
    </div>
  );
};
