import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, X } from 'lucide-react'; // X 아이콘 추가

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
}

// 닫기 기능을 위한 props 정의
interface AIChatbotProps {
  onClose?: () => void;
}

export function AIChatbot({ onClose }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'ai',
      content: 'Hello! I\'m your AI Travel Planner. Where would you like to go today?',
    },
    {
      id: 2,
      role: 'user',
      content: 'Find a cafe near Kyoto Station',
    },
    {
      id: 3,
      role: 'ai',
      content: 'Here are 3 cozy cafes near Kyoto Station:\n\n1. % Arabica Kyoto - Great matcha lattes\n2. Café Bibliotic Hello! - Vintage charm\n3. Weekenders Coffee - Minimalist space',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = { id: messages.length + 1, role: 'user', content: input };
    setMessages([...messages, newMessage]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        role: 'ai',
        content: 'I\'m here to help you plan your journey. What else would you like to know?',
      }]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 둥근 카드 디자인 유지 */}
      <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/50">

        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#87CEEB] to-[#90EE90] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-400 w-2.5 h-2.5 rounded-full border-2 border-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-base">AI Planner</h2>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FFD700]" />
                Online
              </p>
            </div>
          </div>

          {/* 닫기 버튼 (onClose가 있을 때만 표시) */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 채팅 내용 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-gray-50/30">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-[#87CEEB]" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm leading-relaxed ${message.role === 'user'
                      ? 'bg-gradient-to-br from-[#87CEEB] to-[#4ECDC4] text-white rounded-br-none'
                      : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                    }`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 입력창 */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="w-full bg-gray-100/80 text-gray-700 placeholder-gray-400 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#87CEEB]/50 transition-all pr-12"
            />
            <button
              onClick={handleSend}
              className="absolute right-1.5 top-1.5 bottom-1.5 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#87CEEB] hover:text-[#4ECDC4] transition-all"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}