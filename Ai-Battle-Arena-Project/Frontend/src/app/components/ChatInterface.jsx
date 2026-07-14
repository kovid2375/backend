import React, { useState, useRef, useEffect } from 'react';
import UserMessage from './UserMessage';
import ArenaResponse from './ArenaResponse';
import axios from "axios";

export default function ChatInterface() {
  const [ messages, setMessages ] = useState([]);
  const [ inputValue, setInputValue ] = useState('');
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ messages ]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isSubmitting) return;

    const userMsgId = Date.now();
    const currentInput = inputValue;

    // Immediately add the user message with a loading state
    const newUserMessage = {
      id: userMsgId,
      problem: currentInput,
      loading: true,
      error: null,
      solution_1: '',
      solution_2: '',
      judge: null
    };

    setMessages((prev) => [ ...prev, newUserMessage ]);
    setInputValue('');
    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:3000/invoke", {
        input: currentInput
      });

      const data = response.data;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMsgId
            ? { ...msg, ...data.result, loading: false }
            : msg
        )
      );
    } catch (error) {
      console.error("Failed to invoke backend arena:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to communicate with the arena backend. Make sure your server is running.";
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMsgId
            ? { ...msg, loading: false, error: errorMessage }
            : msg
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="py-4 px-8 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 flex justify-center">
        <h1 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-50">AI Chat Arena</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 w-full max-w-6xl mx-auto flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-zinc-400">
            <div className="text-center">
              <h2 className="text-2xl font-light mb-2 text-zinc-600 dark:text-zinc-300">Welcome to the Arena</h2>
              <p>Type a problem below to see two AI solutions go head-to-head.</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
              <UserMessage message={msg.problem} />
              <ArenaResponse
                solution1={msg.solution_1}
                solution2={msg.solution_2}
                judge={msg.judge}
                loading={msg.loading}
                error={msg.error}
              />
            </div>
          ))
        )}
        <div ref={endOfMessagesRef} />
      </main>

      <div className="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isSubmitting ? "Arena is generating answers..." : "Ask a coding question..."}
              disabled={isSubmitting}
              className="w-full bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-none rounded-full py-4 pl-6 pr-16 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-zinc-400 transition-shadow shadow-sm hover:shadow-md text-lg disabled:opacity-60"
            />
            <button
              type="submit"
              className="absolute right-2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!inputValue.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}