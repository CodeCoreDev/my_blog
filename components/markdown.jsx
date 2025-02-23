"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Code from './code';

const Markdown = ({ content }) => {
  if (!content) {
    return null;
  }

  const components = {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold my-4 border-b pb-2">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold my-3 border-b pb-2">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold my-2">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-bold my-2">{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-lg font-bold my-2">{children}</h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-base font-bold my-2">{children}</h6>
    ),

    p: ({ children }) => {
      const childrenArray = React.Children.toArray(children);
      const isImageOnly =
        childrenArray.length === 1 &&
        React.isValidElement(childrenArray[0]) &&
        childrenArray[0].type === "img";

      if (isImageOnly) {
        return <figure className="my-4">{children}</figure>;
      }

      return <p className="my-4 leading-relaxed text-gray-100">{children}</p>;
    },

    img: ({ src, alt }) => (
      <Image
        src={src}
        alt={alt || ""}
        width={800}
        height={400}
        className="rounded-lg object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
      />
    ),

    code: Code,

    ul: ({ children }) => (
      <ul className="list-disc list-inside my-4 space-y-2">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside my-4 space-y-2">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="my-1 text-gray-100 ml-4">{children}</li>
    ),

    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic bg-blue-50 py-2 rounded">
        {children}
      </blockquote>
    ),

    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-gray-100">
          {children}
        </table>
      </div>
    ),

    th: ({ children }) => (
      <th className="border border-gray-300 px-4 py-2 bg-gray-100">
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td className="border border-gray-100 px-4 py-2">{children}</td>
    ),

    hr: () => <hr className="my-8 border-t border-gray-100" />,

    strong: ({ children }) => (
      <strong className="font-bold text-gray-100">{children}</strong>
    ),

    em: ({ children }) => <em className="italic text-gray-100">{children}</em>,

    del: ({ children }) => (
      <del className="line-through text-gray-100">{children}</del>
    ),
  };

  return (
    <article className="prose max-w-none">
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default Markdown;
