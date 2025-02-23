import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

const Markdown = ({ content }) => {
  if (!content) {
    return null; // Проверка на отсутствие контента
  }

  const components = {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold my-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold my-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold my-2">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-bold my-2">{children}</h4>
    ),

    p: ({ children }) => {
      const childrenArray = React.Children.toArray(children);
      const isImageOnly =
        childrenArray.length === 1 &&
        React.isValidElement(childrenArray[0]) &&
        childrenArray[0].type === "img";

      // Если параграф содержит только изображение, используем <figure>
      if (isImageOnly) {
        return <figure className="my-4">{children}</figure>;
      }

      // Иначе возвращаем обычный параграф
      return <p className="my-4 leading-relaxed">{children}</p>;
    },

    img: ({ src, alt }) => (
      <Image
        src={src}
        alt={alt || ""}
        width={600} 
        height={300}
        className="rounded-lg object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    ),

    code: ({ inline, className, children }) => {
      const match = /language-(\w+)/.exec(className || "");
      if (!inline && match) {
        return (
          <pre className="rounded-md my-4">
            <SyntaxHighlighter
              style={tomorrow}
              language={match[1]}
              PreTag="div"
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </pre>
        );
      }
      return (
        <code className="bg-gray-100 rounded-md px-2 py-1">{children}</code>
      );
    },

    ul: ({ children }) => (
      <ul className="list-disc list-inside my-4">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside my-4">{children}</ol>
    ),
    li: ({ children }) => <li className="my-1">{children}</li>,

    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic">
        {children}
      </blockquote>
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
