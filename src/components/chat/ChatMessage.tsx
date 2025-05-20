
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Scale } from 'lucide-react'; // Changed Sparkles to Scale
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const timestamp = message.timestamp ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true }) : '';

  return (
    <div
      className={cn(
        'flex items-start gap-3 my-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300 px-4', // Added px-4 for horizontal padding
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 border-0 shadow-none bg-transparent"> {/* Removed border, shadow, bg for AI */}
          {/* <AvatarImage src="https://placehold.co/40x40.png" alt="AI Avatar" data-ai-hint="robot face" /> REMOVED for AI */}
          <AvatarFallback className="bg-transparent"> {/* Transparent fallback background */}
            <Scale className="h-5 w-5 text-primary" /> {/* Using Scale icon (LEGIT logo) for AI */}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[70%] rounded-lg p-3 shadow-md text-sm',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-card text-card-foreground rounded-bl-none border border-border'
        )}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
        {timestamp && (
          <p className={cn(
            "text-xs mt-1",
            isUser ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left"
            )}>
            {timestamp}
          </p>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 border border-border shadow-sm">
           <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="person silhouette" />
          <AvatarFallback>
            <User className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
