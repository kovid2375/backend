import React, { useState, useRef, useEffect } from 'react';
import UserMessage from './UserMessage';
import ArenaResponse from './ArenaResponse';
import axios from "axios";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeBattleId, setActiveBattleId] = useState(null);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('arena-theme') || 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0); // 0: Idle, 1: Solutions, 2: Judging
  
  const endOfMessagesRef = useRef(null);
  const loadingTimerRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load history and initialize theme on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('arena-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history:", e);
      }
    }
  }, []);

  // Theme Sync Effect
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    localStorage.setItem('arena-theme', theme);
  }, [theme]);

  // Scroll to bottom when messages or loading step changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isSubmitting, loadingStep]);

  // Simulated LangGraph status step timer
  useEffect(() => {
    if (isSubmitting) {
      setLoadingStep(1); // Node 1: Solutions
      loadingTimerRef.current = setTimeout(() => {
        setLoadingStep(2); // Node 2: Judging
      }, 3500); // Shift to judging after ~3.5s
    } else {
      setLoadingStep(0);
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    }
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [isSubmitting]);

  const handleSend = async (e, customInput) => {
    if (e) e.preventDefault();
    const promptToSend = customInput || inputValue;
    if (!promptToSend.trim() || isSubmitting) return;

    const userMsgId = Date.now();
    const currentInput = promptToSend;

    // Clear and set the battle
    const newUserMessage = {
      id: userMsgId,
      problem: currentInput,
      loading: true,
      error: null,
      solution_1: '',
      solution_2: '',
      judge: null
    };

    setMessages([newUserMessage]);
    setInputValue('');
    setIsSubmitting(true);
    setActiveBattleId(userMsgId);

    try {
      const response = await axios.post("http://localhost:3000/invoke", {
        input: currentInput
      });

      const data = response.data;
      const result = data.result;

      // Update active message list
      const finishedMessage = {
        ...newUserMessage,
        ...result,
        loading: false
      };
      setMessages([finishedMessage]);

      // Save to local storage history
      const newHistoryItem = {
        id: userMsgId,
        prompt: currentInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' | ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
        messages: [finishedMessage]
      };

      setHistory((prev) => {
        const updated = [newHistoryItem, ...prev.filter(item => item.prompt !== currentInput)];
        localStorage.setItem('arena-history', JSON.stringify(updated));
        return updated;
      });

    } catch (error) {
      console.error("Failed to invoke backend arena:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to communicate with the arena backend. Make sure your server is running.";
      
      const failedMessage = {
        ...newUserMessage,
        loading: false,
        error: errorMessage
      };
      setMessages([failedMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startNewBattle = () => {
    setMessages([]);
    setInputValue('');
    setActiveBattleId(null);
    setIsSidebarOpen(false);
  };

  const loadHistoryItem = (item) => {
    setMessages(item.messages || []);
    setInputValue('');
    setActiveBattleId(item.id);
    setIsSidebarOpen(false);
  };

  const deleteHistoryItem = (e, id) => {
    e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem('arena-history', JSON.stringify(updated));
      return updated;
    });
    if (activeBattleId === id) {
      startNewBattle();
    }
  };

  const clearAllHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire battle history?")) {
      setHistory([]);
      localStorage.removeItem('arena-history');
      startNewBattle();
    }
  };

  // Quick Start cards templates
  const quickStarts = [
    {
      title: "Trie Implementation",
      icon: "🧬",
      prompt: "Compare Python vs JavaScript implementation of a Trie (Prefix Tree) data structure with insert, search, and startsWith operations.",
      desc: "Prefix-tree architectures compared side-by-side"
    },
    {
      title: "Rust vs Go Quicksort",
      icon: "🦀",
      prompt: "Show Quicksort implementations in Go and Rust, contrasting memory safety rules, syntax readability, and idiomatic styles.",
      desc: "Compare safety features and speed syntax"
    },
    {
      title: "React vs Zustand",
      icon: "⚡",
      prompt: "Compare React Context API vs Zustand for state management with short, readable code examples illustrating boilerplate.",
      desc: "Examine component re-rendering strategies"
    },
    {
      title: "Password Validation Regex",
      icon: "🧪",
      prompt: "Create a complex password validation regex (requiring lowercase, uppercase, digit, special char, 8+ length) with full explanation and tests.",
      desc: "Regex patterns evaluated for robustness"
    }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-300">
      
      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 flex w-[280px] flex-col border-r border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/90 backdrop-blur-md lg:static lg:translate-x-0 transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-100 dark:border-zinc-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚔️</span>
            <span className="font-heading font-extrabold text-base tracking-wide bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 dark:from-blue-400 dark:via-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              BATTLE ARENA
            </span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Action Button */}
        <div className="p-4">
          <button
            onClick={startNewBattle}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white py-2.5 px-4 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Battle
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Battle History
          </div>
          {history.length === 0 ? (
            <div className="px-3 py-6 text-xs text-zinc-400 dark:text-zinc-500 text-center italic">
              No previous battles
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => loadHistoryItem(item)}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                  activeBattleId === item.id
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-zinc-400 flex-shrink-0 text-xs">💬</span>
                  <div className="truncate flex-1 pr-2">
                    <div className="truncate leading-snug">{item.prompt}</div>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono font-medium mt-0.5 block">{item.timestamp}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => deleteHistoryItem(e, item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 text-zinc-400 transition-opacity cursor-pointer"
                  title="Delete Battle"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 9m-4.78 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Sidebar Footer Controls */}
        <div className="border-t border-zinc-100 dark:border-zinc-900/50 p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/30">
          
          {/* System status */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500 font-medium">Arena Engine</span>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider text-[9px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </div>
          </div>

          {/* Theme Toggles */}
          <div className="flex items-center justify-between rounded-xl bg-zinc-100 dark:bg-zinc-950 p-1">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                theme === 'light'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
              title="Light Mode"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
              title="Dark Mode"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                theme === 'system'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
              title="System Theme"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25M19.5 3h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 18h15a2.25 2.25 0 0 0 2.25-2.25V5.25A2.25 2.25 0 0 0 19.5 3Z" />
              </svg>
            </button>
          </div>

          {/* Clear history */}
          {history.length > 0 && (
            <button
              onClick={clearAllHistory}
              className="text-[10px] text-center block w-full text-zinc-400 hover:text-red-500 transition-colors uppercase font-bold tracking-wider cursor-pointer"
            >
              Clear Saved Battles
            </button>
          )}
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 relative bg-grid-pattern">
        
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            
            {/* Current Models Setup Badge */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-200/50 dark:border-zinc-800/80">
                Setup
              </span>
              <div className="flex items-center text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                <span className="text-orange-500 font-bold dark:font-semibold">Mistral Large</span>
                <span className="mx-1.5 text-zinc-300 dark:text-zinc-700">⚔️</span>
                <span className="text-violet-500 font-bold dark:font-semibold">Cohere Command</span>
                <span className="mx-2 text-zinc-300 dark:text-zinc-700">|</span>
                <span className="text-zinc-400 dark:text-zinc-500 font-normal">Judge:</span>
                <span className="text-orange-500 ml-1 font-bold">Mistral</span>
              </div>
            </div>
            <div className="sm:hidden text-sm font-bold text-zinc-700 dark:text-zinc-300 font-heading">
              AI Battle Arena
            </div>
          </div>

          {/* Quick Stats indicator */}
          <div className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
            {history.length} Battle{history.length !== 1 ? 's' : ''} Saved
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 w-full max-w-6xl mx-auto flex flex-col relative">
          {messages.length === 0 ? (
            // Premium Welcome/Dashboard screen
            <div className="flex-1 flex flex-col items-center justify-center my-auto py-12 animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
              <div className="text-center max-w-2xl px-4">
                {/* Branding Glow */}
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 blur-2xl opacity-20 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full scale-125"></div>
                  <div className="relative text-5xl md:text-6xl font-black tracking-tight font-heading leading-none bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:via-purple-400 dark:to-violet-400 bg-clip-text text-transparent pb-2 uppercase select-none">
                    AI Battle Arena
                  </div>
                </div>

                <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10 font-normal">
                  Put two advanced language models head-to-head. Watch <strong className="text-orange-500 dark:font-semibold">Mistral Large</strong> and <strong className="text-violet-500 dark:font-semibold">Cohere Command</strong> draft solutions, evaluated by <strong className="text-orange-500 dark:font-semibold">Mistral AI</strong>.
                </p>
              </div>

              {/* Quickstart suggestions */}
              <div className="w-full max-w-3xl px-4">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4 text-center">
                  Select a Battle Challenge
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickStarts.map((card, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSend(null, card.prompt)}
                      className="group p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 rounded-2xl cursor-pointer hover:border-violet-500/40 dark:hover:border-violet-400/40 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-start gap-4 text-left shadow-sm relative overflow-hidden"
                    >
                      {/* Gradient hover background */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="text-2xl p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {card.icon}
                      </span>
                      <div className="space-y-1 relative z-10">
                        <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors leading-tight">
                          {card.title}
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal pr-4">
                          {card.desc}
                        </p>
                      </div>
                      <span className="absolute right-4 bottom-4 text-zinc-300 dark:text-zinc-700 group-hover:translate-x-1 group-hover:text-violet-500 transition-all duration-300">
                        →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Chat Battles History list
            <div className="flex-1 flex flex-col justify-start">
              {messages.map((msg) => (
                <div key={msg.id} className="mb-8">
                  <UserMessage message={msg.problem} />
                  
                  {/* Simulated loading step pipeline */}
                  {isSubmitting && activeBattleId === msg.id && (
                    <div className="flex flex-col items-center justify-center my-6 py-4 animate-pulse">
                      <div className="flex items-center gap-6 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                        <span className={`flex items-center gap-1.5 transition-colors duration-300 ${loadingStep >= 1 ? 'text-blue-500' : ''}`}>
                          <span className={`h-2 w-2 rounded-full ${loadingStep >= 1 ? 'bg-blue-500 animate-ping' : 'bg-zinc-300'}`}></span>
                          Node 1: Solutions
                        </span>
                        <span>➔</span>
                        <span className={`flex items-center gap-1.5 transition-colors duration-300 ${loadingStep >= 2 ? 'text-violet-500' : ''}`}>
                          <span className={`h-2 w-2 rounded-full ${loadingStep >= 2 ? 'bg-violet-500 animate-ping' : 'bg-zinc-300'}`}></span>
                          Node 2: Mistral Judge
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-3 pulse-slow">
                        {loadingStep === 1 ? "🧠 Generating Mistral & Cohere codes..." : "⚖️ Mistral AI is evaluating solutions..."}
                      </p>
                    </div>
                  )}

                  <ArenaResponse
                    solution1={msg.solution_1}
                    solution2={msg.solution_2}
                    judge={msg.judge}
                    loading={msg.loading}
                    error={msg.error}
                  />
                </div>
              ))}
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </main>

        {/* Input Bar Section */}
        <div className="p-6 bg-white dark:bg-zinc-900/60 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-900 sticky bottom-0 z-30">
          <div className="max-w-4xl mx-auto relative">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isSubmitting ? "Generating results..." : "Enter your coding challenge..."}
                disabled={isSubmitting}
                className="w-full bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-6 pr-16 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-600 transition-all shadow-sm hover:shadow-md text-base md:text-lg disabled:opacity-60"
              />
              <button
                type="submit"
                className="absolute right-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white p-2.5 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 shadow-md"
                disabled={!inputValue.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}