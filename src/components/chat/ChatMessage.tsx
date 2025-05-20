
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Scale } from 'lucide-react'; // User icon is no longer needed here
import { formatDistanceToNow } from 'date-fns';
// useAuth is no longer needed here directly as we are removing user-specific avatar logic that used it.
// If other user-specific info was needed, we'd keep it.

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const timestamp = message.timestamp ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true }) : '';

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
      {/* User avatar block has been removed as per request */}
    </div>
  );
}
