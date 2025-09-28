
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleIcon, SendIcon, CloseIcon } from './icons/Icons';
import { chatbotAPI } from '../services/apiService';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hi! I'm Sparkle. Ask me about parenting, child development, or fun activities!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await chatbotAPI.getResponse(input);
      const botMessage: Message = { text: botResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = { text: "I'm having a little trouble thinking right now. Please try again later.", sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-purple-500 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center"
          aria-label="Open Chatbot"
        >
          <AnimatePresence>
            {isOpen ? <CloseIcon className="w-8 h-8"/> : <ChatBubbleIcon className="w-8 h-8"/>}
          </AnimatePresence>
        </motion.button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border"
          >
            <header className="bg-purple-500 text-white p-4 font-bold text-lg text-center">Ask Sparkle</header>
            <div className="flex-grow p-4 overflow-y-auto bg-purple-50">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
               {isLoading && (
                  <div className="flex justify-start mb-3">
                    <div className="max-w-[80%] p-3 rounded-2xl bg-white text-slate-800 rounded-bl-none">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                      </div>
                    </div>
                  </div>
                )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                  placeholder="Type your question..."
                  className="flex-grow px-4 py-2 rounded-full border-2 border-slate-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
                  disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading} className="bg-purple-500 text-white rounded-full p-3 hover:bg-purple-600 disabled:bg-slate-300 transition-colors">
                  <SendIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
