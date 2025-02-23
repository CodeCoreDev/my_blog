"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

const CopyButton = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-200"
      onClick={copy}
    >
      {isCopied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      )}
    </button>
  );
};

const Code = ({ inline, className, children }) => {
  const match = /language-(\w+)/.exec(className || "");

  if (!inline && match) {
    return (
      <div className="relative group">
        <div className="absolute right-2 top-2 z-10 flex items-center gap-4">
          <span className="text-xs text-gray-400 uppercase">{match[1]}</span>
          <CopyButton text={String(children).replace(/\n$/, "")} />
        </div>
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          className="rounded-md my-4"
          showLineNumbers={true}
          customStyle={{
            margin: 0,
            padding: "1.5rem 1rem",
            background: "#1a1b26",
          }}
          codeTagProps={{
            style: {
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
            },
          }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code className="px-1.5 py-0.5 text-sm rounded-md bg-gray-800 text-gray-200 font-mono">
      {children}
    </code>
  );
};

export default Code;
