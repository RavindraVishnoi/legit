"use client";

import type { Message } from '@/lib/types';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { Scale, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (query: string) => void;
  isLoading: boolean;
  currentConversationId: string | null;
  startNewConversation: () => void;
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  currentConversationId,
  startNewConversation,
}: ChatInterfaceProps) {
  if (!currentConversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background text-center">
        <Scale className="w-20 h-20 mb-6 text-primary opacity-70" />
        <h2 className="text-3xl font-bold mb-3 text-foreground">Welcome to LEGIT</h2>
        <p className="text-lg text-muted-foreground mb-6 max-w-md">
          Your AI-powered legal query assistant. Get insights and guidance on your legal questions.
        </p>
        <Button onClick={startNewConversation} size="lg" className="shadow-md">
          <PlusCircle className="mr-2 h-5 w-5" /> Start New Chat
        </Button>
        <p className="text-sm text-muted-foreground mt-8">
          Or select a previous conversation from the history panel.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      <ChatMessages messages={messages} />
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
}
