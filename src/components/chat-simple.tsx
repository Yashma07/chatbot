"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSimpleProps {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ChatSimple({ messages, input, setInput, onSubmit, isLoading }: ChatSimpleProps) {
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
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 m-4 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">✨</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">AI Assistant</h1>
            <p className="text-sm text-gray-300">Powered by Gemini</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl mx-4 mb-4 p-6 shadow-2xl overflow-hidden">
        <div className="h-full overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full mb-6 shadow-xl">
                <span className="text-3xl">🤖</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Hello! I'm your AI Assistant</h2>
              <p className="text-gray-300 text-lg">How can I help you today?</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
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
              </div>
            ))
          )}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 px-6 py-4 rounded-3xl shadow-xl">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="mx-4 mb-4">
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
            
            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white rounded-full px-5 py-2.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-300"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Send</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
