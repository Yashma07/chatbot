"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatLayoutProps {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ChatLayout({ messages, input, setInput, onSubmit, isLoading }: ChatLayoutProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 m-4 shadow-2xl"
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-white font-bold text-lg">✨</span>
          </motion.div>
          <div>
            <h1 className="text-xl font-semibold text-white">AI Assistant</h1>
            <p className="text-sm text-gray-300">Powered by Gemini</p>
          </div>
        </div>
      </motion.div>

      {/* Messages Container - Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl mx-4 mb-4 p-6 shadow-2xl overflow-hidden"
      >
        <div className="h-full overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full mb-6 shadow-xl"
              >
                <span className="text-3xl">🤖</span>
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-3">Hello! I'm your AI Assistant</h2>
              <p className="text-gray-300 text-lg">How can I help you today?</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300
                  }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-xl px-6 py-4 rounded-3xl shadow-xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white border-0'
                        : 'bg-gray-900/80 backdrop-blur-md border border-gray-700/50 text-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          
          {/* Loading Indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="flex justify-start"
              >
                <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 px-6 py-4 rounded-3xl shadow-xl">
                  <div className="flex space-x-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-pink-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </motion.div>

      {/* Floating Input Area - Pill-shaped Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-4 mb-4"
      >
        <form onSubmit={onSubmit} className="relative">
          <div className="relative group">
            {/* Glassmorphism pill container */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300" />
            
            {/* Input field */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="relative w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-6 py-4 pr-24 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
              disabled={isLoading}
            />
            
            {/* Glowing Send Button */}
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white rounded-full px-5 py-2.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-300"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <motion.span
                  animate={{ textShadow: ["0 0 0px rgba(255,255,255,0.5)", "0 0 20px rgba(255,255,255,0.8)", "0 0 0px rgba(255,255,255,0.5)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Send
                </motion.span>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
