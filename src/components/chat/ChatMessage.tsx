
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Scale } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { currentUser } = useAuth();
  const isUser = message.sender === 'user';
  const timestamp = message.timestamp ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true }) : '';

  const userAvatarSrc = currentUser?.photoURL;
  const userAvatarFallback = currentUser?.displayName
    ? currentUser.displayName.charAt(0).toUpperCase()
    : <User className="h-5 w-5 text-muted-foreground" />;

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
      {isUser && (
        <Avatar className="h-8 w-8 border border-border shadow-sm">
           <AvatarImage src={userAvatarSrc || "https://placehold.co/40x40.png"} alt={currentUser?.displayName || "User Avatar"} data-ai-hint="person silhouette" />
          <AvatarFallback>
            {userAvatarFallback}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
