import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Copy, 
  Check, 
  Trash2, 
  RotateCcw, 
  Info,
  Clock,
  Compass,
  Building,
  HelpCircle
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AIAssistantViewProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

const SAMPLE_QUESTIONS = [
  {
    category: 'Facilities',
    icon: Building,
    query: 'Where is GPU Lab 402 located and who manages access?',
  },
  {
    category: 'Attendance & Rules',
    icon: HelpCircle,
    query: 'What happens if my attendance in CS503 falls below 75%?',
  },
  {
    category: 'Library & Study',
    icon: Clock,
    query: 'What are the Central Library hours during mid-term exams?',
  },
  {
    category: 'Transport & Shuttle',
    icon: Compass,
    query: 'What is the schedule for the campus shuttle between North Gate and Metro Station?',
  },
  {
    category: 'Grievance & Support',
    icon: Info,
    query: 'How do I report an AC failure or maintenance issue in campus?',
  },
];

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'model',
      text: `Hello Aarav! I am **CampusConnect AI**, your official campus assistant at Apex Institute of Science & Technology.\n\nI can help you with:\n- **Campus Navigation & Facilities** (Labs, libraries, faculty offices)\n- **Academic & Attendance Rules** (75% criteria, mid-term datesheets)\n- **Hostel & Shuttle Schedules**\n- **Grievances & Administrative Support**\n\nHow can I help you excel today?`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle incoming initialPrompt from other components
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt.trim());
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build conversation history for context
      const history = messages.slice(-4).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const modelReply = data.reply || "I'm sorry, I could not generate a response at this moment.";

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'model',
        text: modelReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'model',
        text: `I encountered an issue connecting to the Gemini server (${err.message || 'Network issue'}). In the meantime, you can reach the Academic Office at Block A Room 104, or view campus guidelines in the Announcements tab.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'msg_welcome',
        role: 'model',
        text: `Chat history cleared. How can I assist you with your campus queries today?`,
        timestamp: 'Just now',
      },
    ]);
  };

  // Simple Markdown renderer for bold, lists, and headers
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      // Heading
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="font-bold text-slate-900 text-sm mt-2 mb-1">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="font-extrabold text-slate-900 text-base mt-2 mb-1">{line.replace('## ', '')}</h3>;
      }
      // Bullet
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletText = line.trim().replace(/^[-*]\s+/, '');
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
            <span className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {renderInlineStyles(bulletText)}
            </span>
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      // Normal line
      return (
        <p key={idx} className="text-xs sm:text-sm leading-relaxed text-slate-800 my-0.5">
          {renderInlineStyles(line)}
        </p>
      );
    });
  };

  // Render **bold** and `code` inline
  const renderInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-indigo-950">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 bg-slate-100 text-indigo-700 font-mono text-[11px] rounded border border-slate-200">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Chat Top Bar */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-base">CampusConnect AI Concierge</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-500">Live college database: AIST Fall 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearHistory}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isAi = msg.role === 'model';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? '' : 'flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                  isAi
                    ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
                    : 'bg-slate-900 text-white'
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3.5 shadow-xs ${
                  isAi
                    ? 'bg-slate-50/90 border border-slate-200/80 text-slate-900'
                    : 'bg-indigo-600 text-white border border-indigo-700'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className={`text-[11px] font-bold ${isAi ? 'text-indigo-700' : 'text-indigo-200'}`}>
                    {isAi ? 'CampusConnect AI' : 'You'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] ${isAi ? 'text-slate-400' : 'text-indigo-200'}`}>
                      {msg.timestamp}
                    </span>
                    {isAi && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  {isAi ? (
                    renderFormattedText(msg.text)
                  ) : (
                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span>Consulting AIST campus records & policies...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          Suggested:
        </span>
        {SAMPLE_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q.query)}
            className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors shrink-0 shadow-2xs font-medium"
          >
            {q.query}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything about campus facilities, exams, attendance rules, labs, or faculty..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:shadow-none hover:scale-102"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[11px] text-slate-400 text-center mt-2">
          CampusConnect AI combines real university statutes with Gemini 3.8 Flash for intelligent guidance.
        </p>
      </div>
    </div>
  );
};
