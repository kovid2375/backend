import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../../auth/hook/useAuth';
import { setCurrentChatId } from '../chat.slice';
import {
  Plus,
  MessageSquare,
  History,
  Settings,
  User,
  Paperclip,
  ArrowUp,
  SlidersHorizontal,
  Trash2,
  Copy,
  Check,
  Bot,
  Terminal,
  LogOut
} from 'lucide-react';

const Dasboard = () => {
  const dispatch = useDispatch();
  const chats = useSelector(state => state.chat.chats);
  const currentChatId = useSelector(state => state.chat.currentChatId);
  const isLoading = useSelector(state => state.chat.isLoading);
  const user = useSelector(state => state.auth.user);

  const { handleSendMessage, handleGetChats, handleOpenChat, handleDeleteChat, initializeSocketConnection } = useChat();
  const { handleLogout } = useAuth();

  const [selectedModel, setSelectedModel] = useState('Claude 3.5');
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Grouping list for sidebar display dynamically
  const todayChats = [];
  const yesterdayChats = [];
  const olderChats = [];

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

  Object.values(chats).forEach(chat => {
    const updatedTime = new Date(chat.lastUpdated || Date.now()).getTime();
    if (updatedTime >= startOfToday) {
      todayChats.push(chat);
    } else if (updatedTime >= startOfYesterday) {
      yesterdayChats.push(chat);
    } else {
      olderChats.push(chat);
    }
  });

  const activeChat = chats[currentChatId];
  const messages = activeChat?.messages || [];

  // Fetch chats on mount and initialize sockets
  useEffect(() => {
    handleGetChats();
    initializeSocketConnection();
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e, customMessage = null) => {
    if (e) e.preventDefault();
    const text = customMessage || messageInput;
    if (!text.trim()) return;

    if (!customMessage) setMessageInput('');

    setIsTyping(true);
    await handleSendMessage({ message: text, chatId: currentChatId, model: selectedModel });
    setIsTyping(false);
  };

  const handleNewChat = () => {
    dispatch(setCurrentChatId(null));
  };

  const handleDelete = async (chatId, e) => {
    e.stopPropagation();
    await handleDeleteChat(chatId);
  };

  // Chat Starter Prompt lists
  const starters = [
    {
      title: "Optimizing React Rendering",
      desc: "Implement a resize listener hook using useLayoutEffect.",
      prompt: "Can you explain how to implement a custom hook in React for handling window resize events? Please include a code example that uses the useLayoutEffect hook."
    },
    {
      title: "Rust Memory Management",
      desc: "Details ownership, references, and borrowing rules.",
      prompt: "Can you explain how Rust manages memory without a garbage collector? Please details ownership, references, and borrowing."
    },
    {
      title: "Tailwind Configuration Help",
      desc: "Define custom brand colors and screen media queries.",
      prompt: "How do I configure custom colors and screens in Tailwind v4?"
    },
    {
      title: "PostgreSQL Indexing Strategy",
      desc: "Explore covering indexes and INCLUDE queries.",
      prompt: "What are the best indexing strategies in PostgreSQL for large read-heavy tables?"
    }
  ];

  // Custom Markdown Code Block component
  const CodeBlock = ({ lang, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="my-4 rounded-xl overflow-hidden border border-neutral-800 bg-[#161616] text-left max-w-full">
        <div className="flex items-center justify-between px-4 py-2 bg-[#202020] border-b border-neutral-800 text-[10px] font-bold text-neutral-400 font-mono">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>{lang || 'CODE'}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={11} className="text-green-400" />
                <span className="text-green-400">COPIED</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-[13.5px] text-neutral-200 font-mono leading-relaxed max-w-full">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  const renderMarkdown = (text) => {
    if (!text) return null;

    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const lang = match ? match[1] : 'CODE';
        const code = match ? match[2].trim() : part.replace(/```/g, '').trim();

        return <CodeBlock key={index} lang={lang} code={code} />;
      } else {
        const lines = part.split('\n');
        return (
          <div key={index} className="space-y-3 text-neutral-300 text-[14.5px] leading-relaxed text-left">
            {lines.map((line, idx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={idx} className="h-2" />;

              const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
              const displayLine = isBullet ? trimmed.substring(2) : line;

              const partsOfLine = displayLine.split(/(\*\*.*?\*\*|`.*?`)/g);
              const formattedLine = partsOfLine.map((subPart, sIdx) => {
                if (subPart.startsWith('**') && subPart.endsWith('**')) {
                  return (
                    <strong key={sIdx} className="font-semibold text-white">
                      {subPart.slice(2, -2)}
                    </strong>
                  );
                } else if (subPart.startsWith('`') && subPart.endsWith('`')) {
                  return (
                    <code
                      key={sIdx}
                      className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-100 border border-neutral-700/40 font-mono text-xs font-semibold"
                    >
                      {subPart.slice(1, -1)}
                    </code>
                  );
                }
                return subPart;
              });

              if (isBullet) {
                return (
                  <ul key={idx} className="list-disc pl-5 my-0.5">
                    <li>{formattedLine}</li>
                  </ul>
                );
              }

              return <p key={idx}>{formattedLine}</p>;
            })}
          </div>
        );
      }
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0e0e0e] text-neutral-200 font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 flex-shrink-0 flex flex-col bg-[#131313] border-r border-neutral-900 select-none">
        {/* Brand Logo Header */}
        <div className="p-4 flex items-center gap-3 border-b border-neutral-900/50">
          <div className="w-9 h-9 rounded-lg bg-[#202020] border border-neutral-800 flex items-center justify-center text-white">
            <Terminal size={18} className="text-neutral-200" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-[15px] tracking-tight leading-tight">AI Assistant</h1>
            <span className="text-[10px] tracking-widest text-neutral-500 font-bold uppercase block">
              Technical Precision
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#202020] hover:bg-[#282828] text-neutral-300 hover:text-white rounded-xl border border-neutral-800/80 font-semibold text-[13.5px] transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-sm"
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>

        {/* Chronological Chat List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-6 pb-4">
          {/* TODAY SECTION */}
          {todayChats.length > 0 && (
            <div className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                Today
              </h3>
              {todayChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleOpenChat(chat.id, chats)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] font-medium cursor-pointer transition-all duration-150 ${
                    currentChatId === chat.id
                      ? 'bg-[#272727] text-white shadow-sm'
                      : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare size={14} className="flex-shrink-0 opacity-80" />
                    <span className="truncate">{chat.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(chat.id, e)}
                    className=" text-red-600 flex-shrink-0 p-0.5 rounded transition-all cursor-pointer"
                    title="Delete Chat"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* YESTERDAY SECTION */}
          {yesterdayChats.length > 0 && (
            <div className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                Yesterday
              </h3>
              {yesterdayChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleOpenChat(chat.id, chats)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] font-medium cursor-pointer transition-all duration-150 ${
                    currentChatId === chat.id
                      ? 'bg-[#272727] text-white shadow-sm'
                      : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <History size={14} className="flex-shrink-0 opacity-80" />
                    <span className="truncate">{chat.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(chat.id, e)}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 hover:text-red-400 p-0.5 rounded transition-all cursor-pointer"
                    title="Delete Chat"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* OLDER SECTION */}
          {olderChats.length > 0 && (
            <div className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                Last 30 Days
              </h3>
              {olderChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleOpenChat(chat.id, chats)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] font-medium cursor-pointer transition-all duration-150 ${
                    currentChatId === chat.id
                      ? 'bg-[#272727] text-white shadow-sm'
                      : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <History size={14} className="flex-shrink-0 opacity-80" />
                    <span className="truncate">{chat.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDelete(chat.id, e)}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 hover:text-red-400 p-0.5 rounded transition-all cursor-pointer"
                    title="Delete Chat"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty fallback */}
          {Object.keys(chats).length === 0 && (
            <div className="flex flex-col items-center justify-center text-center h-32 px-4">
              <MessageSquare size={20} className="text-neutral-700 mb-2" />
              <p className="text-[12px] text-neutral-500">No chat history. Create one to begin.</p>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-900/60 bg-[#111] space-y-1 relative">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a] text-[13.5px] font-medium transition-all cursor-pointer">
            <Settings size={15} />
            Settings
          </button>

          <div className="relative">
            <button
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-[#1a1a1a] text-[13.5px] font-medium transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <User size={15} />
                <span>Account</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            </button>

            {showAccountDropdown && (
              <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#1c1c1c] border border-neutral-800 rounded-xl p-2.5 shadow-xl z-50">
                <div className="px-2 py-1.5 border-b border-neutral-800 mb-1.5">
                  <p className="text-[12px] font-bold text-white">{user?.username || 'Technical Member'}</p>
                  <p className="text-[10px] text-neutral-500">{user?.email || 'pro@deepintelligence.ai'}</p>
                </div>
                <button
                  onClick={() => {
                    setShowAccountDropdown(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-left text-red-400 hover:bg-[#262626] rounded-lg text-[12px] font-medium transition-all cursor-pointer"
                >
                  <LogOut size={13} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* CHAT CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0e0e0e] h-full relative">
        {/* Header */}
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-neutral-900 select-none">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-white text-[16px] tracking-wide">
              {activeChat ? activeChat.title : 'Technical Assistant'}
            </h2>
          </div>

          {/* Model toggle switcher */}
          <div className="flex bg-[#1a1a1a] rounded-full p-0.5 border border-neutral-800/80">
            {['GPT-4o', 'Claude 3.5', 'Gemini Pro'].map((model) => (
              <button
                key={model}
                onClick={() => setSelectedModel(model)}
                className={`px-3.5 py-1 rounded-full text-[11px] font-bold tracking-tight transition-all duration-200 cursor-pointer ${
                  selectedModel === model
                    ? 'bg-neutral-100 text-neutral-900 shadow-md font-extrabold'
                    : 'text-neutral-400 hover:text-neutral-200 bg-transparent'
                }`}
              >
                {model}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button className="text-[10.5px] font-extrabold tracking-wider text-neutral-400 hover:text-white px-3 py-1.5 border border-neutral-800 hover:border-neutral-700 rounded-full transition-all cursor-pointer uppercase">
              Upgrade
            </button>
            <button className="text-neutral-400 hover:text-white p-1 transition-all cursor-pointer">
              <SlidersHorizontal size={15} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-slate-900 font-extrabold text-xs shadow-md">
              {(user?.username || 'K').substring(0, 1).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Message Feed Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          <div className="max-w-3xl mx-auto">
            {!activeChat || messages.length === 0 ? (
              // Welcome suggestion screen
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#141414] border border-neutral-800 flex items-center justify-center text-blue-400 mb-6 shadow-sm">
                  <Bot size={28} />
                </div>
                <h2 className="text-2.5xl font-extrabold text-white mb-2 tracking-tight">How can I help you today?</h2>
                <p className="text-sm text-neutral-400 max-w-md mb-10 leading-relaxed">
                  Choose a starter template prompt or submit an query below to trigger the code generation assistant.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {starters.map((s, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(null, s.prompt)}
                      className="p-5 rounded-2xl bg-[#131313] hover:bg-[#1a1a1a] border border-neutral-900 hover:border-neutral-800/80 transition-all text-left group cursor-pointer shadow-sm flex flex-col justify-between min-h-[105px]"
                    >
                      <h4 className="font-semibold text-[14px] text-white group-hover:text-blue-400 transition-colors mb-1.5">
                        {s.title}
                      </h4>
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {s.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Message Logs
              <div className="space-y-6">
                {messages.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div key={index} className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
                      {!isUser && (
                        <div className="w-8 h-8 rounded-lg bg-[#202020] border border-neutral-800 flex items-center justify-center text-neutral-200 flex-shrink-0 mt-1 shadow-sm">
                          <Bot size={15} />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[85%] rounded-2xl px-5 py-4 border relative ${
                          isUser
                            ? 'bg-[#181818] border-neutral-800/50 text-neutral-100'
                            : 'bg-[#131313] border-neutral-900/60 text-neutral-300'
                        }`}
                      >
                        <div className="text-sm">
                          {isUser ? (
                            <p className="text-left leading-relaxed text-neutral-200">{msg.content}</p>
                          ) : (
                            renderMarkdown(msg.content)
                          )}
                        </div>

                        {/* Date metadata footer */}
                        <div className="text-[9px] text-neutral-500 font-extrabold uppercase tracking-widest mt-3 text-right select-none">
                          {isUser ? 'YOU' : selectedModel} &bull; {msg.time}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* AI Typing Indicator bubble */}
                {isTyping && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#202020] border border-neutral-800 flex items-center justify-center text-neutral-200 flex-shrink-0 mt-1 animate-pulse">
                      <Bot size={15} />
                    </div>
                    <div className="bg-[#131313] border border-neutral-900 max-w-[85%] rounded-2xl px-5 py-3">
                      <div className="flex items-center gap-1.5 py-1">
                        <span className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-6 border-t border-neutral-900 bg-[#0e0e0e] flex-shrink-0">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            
            <form onSubmit={handleSend} className="w-full relative flex items-center">
              <div className="w-full bg-[#131313] border border-neutral-800/80 rounded-2xl focus-within:border-neutral-700/80 focus-within:ring-1 focus-within:ring-neutral-700/50 transition-all flex items-center px-4 py-3 shadow-md">
                <button
                  type="button"
                  className="text-neutral-400 hover:text-white p-1 transition-all mr-2 cursor-pointer animate-pulse"
                  title="Attach asset"
                >
                  <Paperclip size={18} />
                </button>

                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Message ${activeChat ? activeChat.title : 'Technical Assistant'}...`}
                  className="flex-1 bg-transparent text-sm text-neutral-200 placeholder-neutral-500 outline-none border-none py-1 pr-12"
                />

                <button
                  type="submit"
                  disabled={!messageInput.trim() || isTyping}
                  className={`absolute right-3.5 p-2 rounded-xl flex items-center justify-center transition-all ${
                    messageInput.trim() && !isTyping
                      ? 'bg-neutral-200 text-[#0e0e0e] hover:bg-white cursor-pointer active:scale-95'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <ArrowUp size={16} className="stroke-[2.5]" />
                </button>
              </div>
            </form>

            <span className="text-[9px] font-bold tracking-widest text-neutral-600 uppercase mt-4 select-none">
              Deep Intelligence v4.2.0 &bull; Pro License
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dasboard;