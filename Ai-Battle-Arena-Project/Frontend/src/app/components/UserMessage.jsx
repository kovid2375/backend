import React from 'react';

export default function UserMessage({ message }) {
  return (
    <div className="flex items-start justify-end gap-3 my-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col items-end max-w-[80%] md:max-w-[70%]">
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mb-1 mr-1">
          User Question
        </span>
        <div className="bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-950 text-zinc-800 dark:text-zinc-200 px-5 py-3.5 rounded-2xl rounded-tr-none shadow-sm border border-zinc-200 dark:border-zinc-800/80 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message}
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 text-zinc-600 dark:text-zinc-300 flex items-center justify-center text-xs font-semibold border border-zinc-300 dark:border-zinc-700/50 shadow-sm flex-shrink-0 mt-5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      </div>
    </div>
  );
}