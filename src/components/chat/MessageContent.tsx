import ReactMarkdown from 'react-markdown';

interface MessageContentProps {
  content: string;
  role: "user" | "assistant";
}

export const MessageContent = ({ content, role }: MessageContentProps) => {
  if (role === "user") {
    return <p className="text-xs font-mono whitespace-pre-wrap leading-relaxed">{content}</p>;
  }

  // Enhanced markdown rendering for assistant messages
  return (
    <div className="text-xs font-mono leading-relaxed prose prose-sm prose-invert max-w-none">
      <ReactMarkdown
        components={{
          // Headings
          h1: ({ children }) => <h1 className="text-sm font-bold mt-3 mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xs font-bold mt-2 mb-1.5">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xs font-semibold mt-2 mb-1">{children}</h3>,
          
          // Paragraphs
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          
          // Lists
          ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 mb-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-0.5 mb-2">{children}</ol>,
          li: ({ children }) => <li className="ml-2">{children}</li>,
          
          // Code
          code: ({ children, ...props }) => {
            const isInline = !String(children).includes('\n');
            return isInline ? (
              <code className="px-1.5 py-0.5 rounded bg-muted/50 text-[10px] font-mono border border-border">
                {children}
              </code>
            ) : (
              <code className="block p-2 rounded bg-muted/50 text-[10px] font-mono border border-border overflow-x-auto my-2">
                {children}
              </code>
            );
          },
          
          // Emphasis
          strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          
          // Links
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80"
            >
              {children}
            </a>
          ),
          
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-muted-foreground pl-3 italic my-2">
              {children}
            </blockquote>
          ),
          
          // Horizontal rule
          hr: () => <hr className="my-3 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
