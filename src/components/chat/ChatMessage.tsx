import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Scale } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={cn(
        'flex items-start gap-3 my-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 px-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 border-0 shadow-none bg-transparent">
          <AvatarFallback className="bg-transparent">
            <Scale className="h-5 w-5 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          isUser
            ? 'max-w-[70%] rounded-lg p-3 shadow-md text-sm bg-primary text-primary-foreground rounded-br-none'
            : 'w-full bg-card text-card-foreground p-4 rounded-lg border border-border'
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.text}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="font-semibold mb-2" {...props} />
              ),
              ul: ({ node, ...props }) => <ul className="pl-5" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              strong: ({ node, ...props }) => (
                <strong className="font-bold" {...props} />
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
