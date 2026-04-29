"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string>("");

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(""), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <ReactMarkdown
        components={{
        code({ node, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : "";
          const codeString = String(children).replace(/\n$/, "");
          const isInline = !match;

          if (!isInline) {
            return (
              <div className="relative group">
                <SyntaxHighlighter
                  style={oneDark}
                  language={language}
                  PreTag="div"
                  className="!rounded-lg !text-sm"
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
                <button
                  onClick={() => copyToClipboard(codeString)}
                  className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1"
                >
                  {copiedCode === codeString ? (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            );
          }

          return (
            <code className={`${className} bg-gray-800 px-1.5 py-0.5 rounded text-sm`} {...props}>
              {children}
            </code>
          );
        },
        p({ children }: any) {
          return <p className="text-gray-100 leading-relaxed">{children}</p>;
        },
        h1({ children }: any) {
          return <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>;
        },
        h2({ children }: any) {
          return <h2 className="text-xl font-bold text-white mb-3">{children}</h2>;
        },
        h3({ children }: any) {
          return <h3 className="text-lg font-semibold text-white mb-2">{children}</h3>;
        },
        ul({ children }: any) {
          return <ul className="list-disc list-inside text-gray-100 mb-4 space-y-1">{children}</ul>;
        },
        ol({ children }: any) {
          return <ol className="list-decimal list-inside text-gray-100 mb-4 space-y-1">{children}</ol>;
        },
        li({ children }: any) {
          return <li className="text-gray-100">{children}</li>;
        },
        blockquote({ children }: any) {
          return (
            <blockquote className="border-l-4 border-purple-500 pl-4 py-2 my-4 bg-purple-500/10 rounded-r-lg">
              {children}
            </blockquote>
          );
        },
        strong({ children }: any) {
          return <strong className="text-white font-semibold">{children}</strong>;
        },
        em({ children }: any) {
          return <em className="text-purple-300 italic">{children}</em>;
        },
        a({ children, href }: any) {
          return (
            <a
              href={href}
              className="text-purple-400 hover:text-purple-300 underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
