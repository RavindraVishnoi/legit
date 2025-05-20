
"use client";

import type { Message } from '@/lib/types';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { Scale } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (query: string) => void;
  isLoading: boolean;
  currentConversationId: string | null;
  // startNewConversation is no longer needed here as ChatInput is always present
  // startNewConversation: () => void; 
}

function WelcomeContent() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 text-center">
      <Scale className="w-20 h-20 md:w-24 md:h-24 mb-6 text-primary opacity-70" />
      <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-foreground">
        LEGIT at your service.
      </h1>
      <p className="text-md md:text-lg text-muted-foreground max-w-md md:max-w-lg">
        Ask any legal question. From understanding complex clauses to exploring case precedents, I'm here to assist.
      </p>
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
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      {currentConversationId ? (
        <ChatMessages messages={messages} />
      ) : (
        <WelcomeContent />
      )}
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
}
