import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

// Custom CodeBlock Component with Copy Functionality
function CodeBlock({ children, className, ...props }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  const handleCopy = async () => {
    const codeText = codeRef.current ? codeRef.current.innerText : children;
    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const language = className ? className.replace(/language-/, '') : 'code';

  return (
    <div className="rounded-2xl overflow-hidden my-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-950 shadow-sm relative group">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800/80 text-xs text-zinc-400 font-mono">
        <span className="uppercase tracking-wider font-semibold text-[10px]">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-zinc-200 focus:outline-none cursor-pointer text-xs"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-zinc-100 font-mono leading-relaxed">
        <code ref={codeRef} className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function ArenaResponse({ solution1, solution2, judge, loading, error }) {
  useEffect(() => {
    if (!loading && !error) {
      // Small timeout to ensure DOM nodes are drawn for highlight.js
      const timer = setTimeout(() => {
        hljs.highlightAll();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [solution1, solution2, loading, error]);

  if (error) {
    return (
      <div className="my-6 p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-3xl text-red-600 dark:text-red-400 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h4 className="text-base font-semibold flex items-center gap-2 mb-2 font-heading">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.401 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
          </svg>
          Arena Execution Failed
        </h4>
        <p className="text-sm opacity-90">{error}</p>
      </div>
    );
  }

  const isEvaluated = judge !== null && judge !== undefined;
  const score1 = isEvaluated ? Number(judge.solution_1_score) : 0;
  const score2 = isEvaluated ? Number(judge.solution_2_score) : 0;

  const isSol1Winner = isEvaluated && score1 > score2;
  const isSol2Winner = isEvaluated && score2 > score1;
  const isTie = isEvaluated && score1 === score2;

  if (loading) {
    return (
      <div className="flex flex-col gap-6 my-8 px-1 w-full animate-pulse">
        {/* Progress Pipeline bar */}
        <div className="flex justify-between items-center max-w-md mx-auto w-full px-5 py-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-full text-xs text-zinc-500 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Invoking Models...</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">Solutions</span>
            <span className="text-zinc-400">➔</span>
            <span className="text-zinc-400 opacity-60">Mistral Judge</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Solution 1 Skeleton */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
              <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
              <div className="h-4 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-md"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
              <div className="h-32 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-850 p-4 space-y-2">
                <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
                <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
                <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
              </div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
            </div>
          </div>

          {/* Solution 2 Skeleton */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
              <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
              <div className="h-4 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-md"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/5"></div>
              <div className="h-32 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-850 p-4 space-y-2">
                <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
                <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded.w-3/4"></div>
                <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card classes
  let card1Classes = "bg-white dark:bg-zinc-900 border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col transition-all duration-350 relative overflow-hidden ";
  if (isEvaluated) {
    if (isSol1Winner) {
      card1Classes += "border-emerald-500/50 dark:border-emerald-500/35 bg-gradient-to-b from-emerald-50/10 to-white dark:from-emerald-950/5 dark:to-zinc-900 winner-glow-emerald ring-1 ring-emerald-500/10";
    } else if (isSol2Winner) {
      card1Classes += "border-zinc-200 dark:border-zinc-800 opacity-60 dark:opacity-50 scale-[0.99] hover:opacity-90";
    } else {
      card1Classes += "border-zinc-300 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/40";
    }
  } else {
    card1Classes += "border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700";
  }

  let card2Classes = "bg-white dark:bg-zinc-900 border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col transition-all duration-350 relative overflow-hidden ";
  if (isEvaluated) {
    if (isSol2Winner) {
      card2Classes += "border-violet-500/50 dark:border-violet-500/35 bg-gradient-to-b from-violet-50/10 to-white dark:from-violet-950/5 dark:to-zinc-900 winner-glow-violet ring-1 ring-violet-500/10";
    } else if (isSol1Winner) {
      card2Classes += "border-zinc-200 dark:border-zinc-800 opacity-60 dark:opacity-50 scale-[0.99] hover:opacity-90";
    } else {
      card2Classes += "border-zinc-300 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/40";
    }
  } else {
    card2Classes += "border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700";
  }

  // Component overrides for Markdown
  const markdownComponents = {
    h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-6 mb-3 text-zinc-900 dark:text-white font-heading" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-5 mb-2.5 text-zinc-900 dark:text-white font-heading" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-base font-semibold mt-4 mb-2 text-zinc-900 dark:text-white font-heading" {...props} />,
    p: ({ node, ...props }) => <p className="mb-3.5 leading-relaxed text-sm md:text-base text-zinc-700 dark:text-zinc-300" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 text-sm md:text-base text-zinc-700 dark:text-zinc-300 space-y-1" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 text-sm md:text-base text-zinc-700 dark:text-zinc-300 space-y-1" {...props} />,
    a: ({ node, ...props }) => <a className="text-blue-600 dark:text-blue-400 hover:underline font-medium" {...props} />,
    code: ({ node, inline, className, children, ...props }) => {
      return !inline ? (
        <CodeBlock className={className} {...props}>
          {children}
        </CodeBlock>
      ) : (
        <code className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-1.5 py-0.5 rounded-md text-xs font-mono font-semibold" {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div className="flex flex-col gap-8 my-8 px-1 w-full animate-in fade-in slide-in-from-bottom-6 duration-500 ease-out">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Solution 1 Card */}
        <div className={card1Classes}>
          {/* Winner Badge & Score */}
          {isEvaluated && (
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              {isSol1Winner && (
                <span className="flex items-center gap-1 bg-emerald-500 text-white dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  🏆 Winner
                </span>
              )}
              {isTie && (
                <span className="flex items-center gap-1 bg-zinc-500 text-white dark:bg-zinc-800 dark:text-zinc-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  🤝 Tied
                </span>
              )}
              <span className={`text-xs font-extrabold px-2.5 py-1.5 rounded-xl flex items-center gap-1 border ${
                isSol1Winner 
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50" 
                  : isSol2Winner
                  ? "bg-zinc-50 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800"
                  : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
              }`}>
                {score1} <span className="text-[9px] text-zinc-400 font-normal">/10</span>
              </span>
            </div>
          )}

          {/* Model Header */}
          <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800/80 pb-4 mb-6">
            <span className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-extrabold text-xs border border-orange-500/20 shadow-inner">
              M1
            </span>
            <div>
              <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 leading-tight">Mistral Large</h4>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider">Solution 1</span>
            </div>
          </div>

          {/* Markdown Content */}
          <div className="text-zinc-700 dark:text-zinc-300 flex-1 prose dark:prose-invert max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {solution1}
            </ReactMarkdown>
          </div>
        </div>

        {/* Solution 2 Card */}
        <div className={card2Classes}>
          {/* Winner Badge & Score */}
          {isEvaluated && (
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              {isSol2Winner && (
                <span className="flex items-center gap-1 bg-violet-500 text-white dark:bg-violet-500/20 dark:text-violet-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  🏆 Winner
                </span>
              )}
              {isTie && (
                <span className="flex items-center gap-1 bg-zinc-500 text-white dark:bg-zinc-800 dark:text-zinc-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  🤝 Tied
                </span>
              )}
              <span className={`text-xs font-extrabold px-2.5 py-1.5 rounded-xl flex items-center gap-1 border ${
                isSol2Winner 
                  ? "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800/50" 
                  : isSol1Winner
                  ? "bg-zinc-50 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800"
                  : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
              }`}>
                {score2} <span className="text-[9px] text-zinc-400 font-normal">/10</span>
              </span>
            </div>
          )}

          {/* Model Header */}
          <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800/80 pb-4 mb-6">
            <span className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center font-extrabold text-xs border border-violet-500/20 shadow-inner">
              C2
            </span>
            <div>
              <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 leading-tight">Cohere Command</h4>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider">Solution 2</span>
            </div>
          </div>

          {/* Markdown Content */}
          <div className="text-zinc-700 dark:text-zinc-300 flex-1 prose dark:prose-invert max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {solution2}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Judge Evaluation Panel */}
      {judge && (
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5 mb-6 gap-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-sm text-base">
                ⚖️
              </span>
              <div>
                <h3 className="text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 font-heading leading-tight">
                  Mistral Evaluation Dashboard
                </h3>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium uppercase tracking-wider mt-0.5">
                  Official Verdict & Analysis
                </p>
              </div>
            </div>

            {/* Victor callout badge */}
            <div className="flex items-center">
              {isSol1Winner && (
                <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs px-4 py-1.5 rounded-full font-bold shadow-sm">
                  🏆 Mistral Large wins by {score1 - score2} pt{score1 - score2 > 1 ? 's' : ''}
                </div>
              )}
              {isSol2Winner && (
                <div className="bg-violet-500/15 border border-violet-500/30 text-violet-600 dark:text-violet-400 text-xs px-4 py-1.5 rounded-full font-bold shadow-sm">
                  🏆 Cohere Command wins by {score2 - score1} pt{score2 - score1 > 1 ? 's' : ''}
                </div>
              )}
              {isTie && (
                <div className="bg-zinc-500/15 border border-zinc-500/30 text-zinc-600 dark:text-zinc-300 text-xs px-4 py-1.5 rounded-full font-bold shadow-sm">
                  🤝 It's a draw! Both models scored {score1}/10
                </div>
              )}
            </div>
          </div>

          {/* Absolute Score Bar Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800/60 shadow-inner">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-zinc-500 dark:text-zinc-400">Mistral Large Score</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-black">{score1} <span className="text-[10px] text-zinc-400 font-normal">/ 10</span></span>
              </div>
              <div className="h-3.5 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden border border-zinc-200/50 dark:border-zinc-800/80">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 ease-out shadow-sm" 
                  style={{ width: `${score1 * 10}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-zinc-500 dark:text-zinc-400">Cohere Command Score</span>
                <span className="text-violet-600 dark:text-violet-400 text-sm font-black">{score2} <span className="text-[10px] text-zinc-400 font-normal">/ 10</span></span>
              </div>
              <div className="h-3.5 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden border border-zinc-200/50 dark:border-zinc-800/80">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full transition-all duration-700 ease-out shadow-sm" 
                  style={{ width: `${score2 * 10}%` }}
                />
              </div>
            </div>
          </div>

          {/* Reasoning Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 border-r border-zinc-100 dark:border-zinc-800/40 pr-0 md:pr-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Mistral Assessment
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap font-normal">
                {judge.solution_1_reasoning}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                Cohere Assessment
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap font-normal">
                {judge.solution_2_reasoning}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}