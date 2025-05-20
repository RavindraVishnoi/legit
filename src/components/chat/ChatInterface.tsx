
"use client";

import type { Message } from '@/lib/types';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { Scale } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (query: string) => void;
  isLoading: boolean;
  currentConversationId: string | null;
}

function WelcomeContent() {
  const { currentUser } = useAuth(); // Get currentUser

  const greetingName = currentUser?.displayName ? currentUser.displayName.split(' ')[0] : 'there'; // Get first name or "there"

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 text-center">
      <Scale className="w-20 h-20 md:w-24 md:w-24 mb-6 text-primary opacity-70" />
      <h1 className="text-4xl md:text-5xl font-semibold mb-3 text-foreground">
        Hello, {greetingName}!
      </h1>
      <h2 className="text-xl md:text-2xl text-muted-foreground max-w-md md:max-w-lg">
        How can LEGIT help you today?
      </h2>
    </div>
  );
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  currentConversationId,
}: ChatInterfaceProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background relative">
      <div className="flex-1 overflow-y-auto">
        {currentConversationId && messages.length > 0 ? (
          <ChatMessages messages={messages} />
        ) : (
          <WelcomeContent />
        )}
      </div>
      <div className="px-4 pb-4 sticky bottom-0 left-0 right-0 bg-background">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
         <p className="text-xs text-muted-foreground text-center mt-3 px-4">
          LEGIT can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
