import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export default function ArenaResponse({ solution1, solution2, judge, loading, error }) {
  useEffect(() => {
    if (!loading && !error) {
      hljs.highlightAll();
    }
  }, [solution1, solution2, loading, error]);

  if (error) {
    return (
      <div className="my-6 p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-3xl text-red-600 dark:text-red-400">
        <h4 className="text-lg font-semibold flex items-center gap-2 mb-2">
          <span>⚠️</span> Execution Failed
        </h4>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8 my-8 px-4 w-full animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Solution 1 Skeleton */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
              <div className="h-24 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
                <div className="h-3 bg-zinc-200 dark:bg-zinc-850 rounded w-1/2"></div>
                <div className="h-3 bg-zinc-200 dark:bg-zinc-850 rounded w-5/6"></div>
                <div className="h-3 bg-zinc-200 dark:bg-zinc-850 rounded w-2/3"></div>
              </div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
            </div>
          </div>

          {/* Solution 2 Skeleton */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/5"></div>
              <div className="h-24 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
                <div className="h-3 bg-zinc-200 dark:bg-zinc-850 rounded w-2/3"></div>
                <div className="h-3 bg-zinc-200 dark:bg-zinc-850 rounded w-3/4"></div>
                <div className="h-3 bg-zinc-200 dark:bg-zinc-850 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Judge Skeleton */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
          <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800"></div>
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
            </div>
            <div className="space-y-4">
              <div className="h-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800"></div>
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 my-8 px-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Solution 1 */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col transition-all hover:shadow-md">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-500 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Solution 1
          </h3>
          <div className="text-zinc-700 dark:text-zinc-300">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4 text-zinc-900 dark:text-white" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3 text-zinc-900 dark:text-white" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2 text-zinc-900 dark:text-white" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-zinc-700 dark:text-zinc-300 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-zinc-700 dark:text-zinc-300 space-y-1" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-500 underline" {...props} />,
                code: ({node, inline, className, children, ...props}) => {
                  return !inline ? (
                    <div className="rounded-xl overflow-hidden my-4 border border-zinc-200 dark:border-zinc-800">
                       <pre className="p-4 bg-zinc-950 overflow-x-auto text-sm text-zinc-100">
                         <code className={className} {...props}>
                           {children}
                         </code>
                       </pre>
                    </div>
                  ) : (
                    <code className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >{solution1}</ReactMarkdown>
          </div>
        </div>

        {/* Solution 2 */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col transition-all hover:shadow-md">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-500 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500"></span> Solution 2
          </h3>
          <div className="text-zinc-700 dark:text-zinc-300">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4 text-zinc-900 dark:text-white" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3 text-zinc-900 dark:text-white" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2 text-zinc-900 dark:text-white" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-zinc-700 dark:text-zinc-300 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-zinc-700 dark:text-zinc-300 space-y-1" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-500 underline" {...props} />,
                code: ({node, inline, className, children, ...props}) => {
                  return !inline ? (
                    <div className="rounded-xl overflow-hidden my-4 border border-zinc-200 dark:border-zinc-800">
                       <pre className="p-4 bg-zinc-950 overflow-x-auto text-sm text-zinc-100">
                         <code className={className} {...props}>
                           {children}
                         </code>
                       </pre>
                    </div>
                  ) : (
                    <code className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >{solution2}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Judge Panel */}
      {judge && (
        <div className="mt-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-3 mb-6">
            ⚖️ Judge Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white dark:bg-zinc-900 px-5 py-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <span className="font-medium text-zinc-600 dark:text-zinc-400">Solution 1 Score</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{judge.solution_1_score}/10</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed px-2">
                {judge.solution_1_reasoning}
              </p>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center bg-white dark:bg-zinc-900 px-5 py-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <span className="font-medium text-zinc-600 dark:text-zinc-400">Solution 2 Score</span>
                <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">{judge.solution_2_score}/10</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed px-2">
                {judge.solution_2_reasoning}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}