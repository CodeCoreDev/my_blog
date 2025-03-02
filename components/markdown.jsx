"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

const Markdown = ({ content }) => {
  if (!content) return null;

  const components = {
    // Заголовки с анимацией
    h1: ({ children }) => (
      <h1
        className="text-4xl font-bold my-4 border-b-2 pb-2 transition-all"
        style={{ borderColor: "rgba(255,255,255,0.3)" }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className="text-3xl font-bold my-3 border-b pb-1 transition-all"
        style={{ borderColor: "rgba(255,255,255,0.2)" }}
      >
        {children}
      </h2>
    ),

    // Улучшенный код с подсветкой
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          children={String(children).replace(/\n$/, "")}
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          className="rounded-xl overflow-hidden mb-4"
          wrapLongLines={true}
          showLineNumbers={true}
          showInlineLineNumbers={false}
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },

    // Изображения с ленивой загрузкой и заглушками
    img: ({ src, alt }) => (
      <Image
        src={src}
        alt={alt || "Изображение"}
        width={1200}
        height={600}
        className="rounded-2xl object-cover transition-transform hover:scale-105 mb-4"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhESMIAAAAABJRU5ErkJggg=="
      />
    ),

    // Ссылки с подсветкой и анимацией
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 underline underline-offset-4"
      >
        {children}
        <span className="sr-only">(в новой вкладке)</span>
      </a>
    ),

    // Таблицы с альтернирующими строками
    table: ({ children }) => (
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          {React.Children.map(children, (child, index) =>
            index % 2 === 0
              ? child
              : React.cloneElement(child, {
                  className: "bg-gray-50 dark:bg-gray-800",
                })
          )}
        </table>
      </div>
    ),

    // Улучшенные цитаты
    blockquote: ({ children }) => (
      <blockquote className="pl-6 pr-4 py-2 my-6 bg-gray-100 dark:bg-gray-900 rounded-lg border-l-4 border-blue-500">
        <p className="text-gray-100 italic">{children}</p>
      </blockquote>
    ),

    // Современные списки
    ul: ({ children }) => (
      <ul className="list-disc list-inside pl-6 my-5 space-y-1 text-gray-100">
        {children}
      </ul>
    ),

    // Добавим поддержку задач
    input: ({ checked }) => (
      <input
        type="checkbox"
        checked={checked}
        className="cursor-pointer accent-blue-500 transition-transform"
      />
    ),

    // Прозрачные разделители
    hr: () => (
      <hr className="my-8 border-t border-gray-200 dark:border-gray-700 opacity-20" />
    ),

    // Комбинации клавиш (кнопок)
    kbd: ({ children }) => (
      <kbd className="bg-gray-800 rounded px-2 py-0.5 text-gray-300 font-mono text-sm inline-block">
        {children}
      </kbd>
    ),
  };

  return (
    <article
      className="prose prose-invert max-w-none dark:bg-gray-900 rounded-xl p-4 md:p-8"
      style={{
        color: "rgba(255,255,255,0.85)",
        backgroundColor: "#1A202C",
      }}
    >
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        skipHtml={false}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default Markdown;
