// components/MarkdownViewer.jsx

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkdownViewer = ({ content }) => {
  // Компонент для рендеринга кодовых блоков
  const CodeBlock = ({ language, value }) => {
    return (
      <SyntaxHighlighter language={language} style={dark}>
        {value}
      </SyntaxHighlighter>
    );
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]} // Поддержка GFM
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          if (!inline && match) {
            return (
              <CodeBlock
                key={node.position?.start.line}
                language={match[1]}
                value={String(children).replace(/\n$/, "")}
                {...props}
              />
            );
          }
          return <code className={className}>{children}</code>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownViewer;
