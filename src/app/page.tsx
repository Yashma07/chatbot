"use client";

import { MeshGradient } from "@/components/mesh-gradient";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Date;
}

function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('Input changed:', newValue);
    setInput(newValue);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      createdAt: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        createdAt: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          
          // Parse the streaming format
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const data = JSON.parse(line.slice(2));
                if (data.type === 'text-delta' && data.textDelta) {
                  assistantContent += data.textDelta;
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: assistantContent }
                      : msg
                  ));
                }
              } catch (parseError) {
                // Try old format
                const textMatch = line.match(/0:"([^"]*)"/);
                if (textMatch) {
                  const text = textMatch[1];
                  assistantContent += text;
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: assistantContent }
                      : msg
                  ));
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        createdAt: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    isFocused,
    handleFocus,
    handleBlur
  };
}

export default function Home() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, isFocused, handleFocus, handleBlur } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <MeshGradient />
      
      <div className="relative z-10 flex h-full w-full">
        <div className="flex flex-col h-full max-w-4xl mx-auto w-full px-2 sm:px-4">
          {/* Chat Header */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 sm:p-4 m-2 sm:m-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm sm:text-lg">✨</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-white">AI Assistant</h1>
                <p className="text-xs sm:text-sm text-gray-300">Powered by Gemini</p>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl mx-2 sm:mx-4 mb-2 sm:mb-4 p-3 sm:p-6 shadow-2xl overflow-hidden">
            <div className="h-full overflow-y-auto space-y-3 sm:space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full mb-4 sm:mb-6 shadow-xl">
                    <span className="text-2xl sm:text-3xl">🤖</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">Hello! I'm your AI Assistant</h2>
                  <p className="text-gray-300 text-sm sm:text-lg">How can I help you today?</p>
                </div>
              ) : (
                messages.map((message: Message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-xs md:max-w-md lg:max-w-xl px-3 sm:px-4 py-2 sm:py-4 rounded-2xl sm:rounded-3xl shadow-xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white border-0'
                          : 'bg-gray-900/80 backdrop-blur-md border border-gray-700/50 text-gray-100'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="text-sm leading-relaxed">
                          <MarkdownRenderer content={message.content} />
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      )}
                      <p className={`text-xs mt-1 sm:mt-2 ${
                        message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        {message.createdAt?.toLocaleTimeString() || new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 px-3 sm:px-6 py-2 sm:py-4 rounded-2xl sm:rounded-3xl shadow-xl">
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

          {/* Input Area - Apple Siri Style */}
          <div className="mx-2 sm:mx-4 mb-2 sm:mb-4">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                {/* Animated Glow Background */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    background: [
                      "linear-gradient(135deg, rgba(236, 72, 153, 1), rgba(168, 85, 247, 1), rgba(59, 130, 246, 1))",
                      "linear-gradient(135deg, rgba(168, 85, 247, 1), rgba(59, 130, 246, 1), rgba(236, 72, 153, 1))",
                      "linear-gradient(135deg, rgba(59, 130, 246, 1), rgba(236, 72, 153, 1), rgba(168, 85, 247, 1))",
                      "linear-gradient(135deg, rgba(236, 72, 153, 1), rgba(168, 85, 247, 1), rgba(59, 130, 246, 1))"
                    ],
                    scale: isFocused ? 1.05 : 1.02,
                  }}
                  transition={{
                    background: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    },
                    scale: {
                      duration: 0.2,
                      ease: "easeOut"
                    }
                  }}
                  style={{
                    filter: "blur(35px)",
                    opacity: 0.9
                  }}
                />
                
                {/* Secondary Glow Layer */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.9), transparent 40%)",
                      "radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.9), transparent 40%)",
                      "radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.9), transparent 40%)",
                      "radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.9), transparent 40%)"
                    ],
                    scale: isFocused ? 1.08 : 1.03,
                  }}
                  transition={{
                    background: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    },
                    scale: {
                      duration: 0.2,
                      ease: "easeOut"
                    }
                  }}
                  style={{
                    filter: "blur(45px)",
                    opacity: 0.8
                  }}
                />
                
                {/* Tertiary Glow Layer */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    background: [
                      "radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.7), transparent 60%)",
                      "radial-gradient(circle at 30% 70%, rgba(168, 85, 247, 0.7), transparent 60%)",
                      "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.7), transparent 60%)",
                      "radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.7), transparent 60%)"
                    ],
                    scale: isFocused ? 1.06 : 1.01,
                  }}
                  transition={{
                    background: {
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    },
                    scale: {
                      duration: 0.2,
                      ease: "easeOut"
                    }
                  }}
                  style={{
                    filter: "blur(60px)",
                    opacity: 0.7
                  }}
                />
                
                {/* Glassmorphism Input Field */}
                <div
                  className={`relative rounded-full border transition-all duration-300 ${
                    isFocused 
                      ? "border-white/40 bg-white/10 backdrop-blur-md" 
                      : "border-white/20 bg-white/5 backdrop-blur-sm"
                  }`}
                  style={{
                    boxShadow: isFocused 
                      ? "0 0 60px rgba(236, 72, 153, 0.6), 0 0 80px rgba(168, 85, 247, 0.5), 0 0 100px rgba(59, 130, 246, 0.4), 0 0 120px rgba(236, 72, 153, 0.3)"
                      : "0 0 30px rgba(236, 72, 153, 0.3), 0 0 40px rgba(168, 85, 247, 0.2), 0 0 50px rgba(59, 130, 246, 0.1)"
                  }}
                >
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="Type your message..."
                    className="w-full bg-transparent border-none rounded-full px-4 sm:px-6 py-3 sm:py-4 pr-20 sm:pr-24 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 text-sm sm:text-base"
                    disabled={isLoading}
                    style={{
                      backdropFilter: "blur(10px)"
                    }}
                  />
                  
                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={isLoading || input.trim() === ''}
                    onClick={() => console.log('Button clicked', { isLoading, input, inputTrimmed: input.trim(), disabled: isLoading || input.trim() === '' })}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 font-semibold transition-all duration-300 text-xs sm:text-sm ${
                      isLoading || input.trim() === ''
                        ? "bg-white/20 text-white/50 cursor-not-allowed"
                        : "bg-white text-gray-900 hover:bg-white/90"
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span>Send</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
