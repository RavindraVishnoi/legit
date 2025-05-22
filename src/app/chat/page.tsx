"use client";

import { useState, useEffect, useCallback } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { HistorySidebar } from '@/components/history/HistorySidebar';
import type { Message, Conversation } from '@/lib/types';
import useLocalStorage from '@/hooks/use-local-storage';
import { legalQuery } from '@/ai/flows/legal-query';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ChatPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [conversations, setConversations] = useLocalStorage<Conversation[]>('legitConversations', []);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false); // For AI response loading
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/auth');
    }
  }, [currentUser, authLoading, router]);

  // Effect to load messages for the current conversation
  useEffect(() => {
    if (currentUser && currentConversationId) {
      const currentConv = conversations.find(c => c.id === currentConversationId);
      // Only update activeMessages if it doesn't already match the current conversation's messages
      if (
        currentConv &&
        (activeMessages.length !== currentConv.messages.length ||
          !activeMessages.every((msg, index) => msg.id === currentConv.messages[index].id))
      ) {
        setActiveMessages(currentConv.messages);
      }
    } else if (currentUser) { // User is logged in but no conversation selected
      setActiveMessages([]);
    }
    // If no user, this effect should not run to change activeMessages, as page will redirect
  }, [currentConversationId, conversations, currentUser]);

  // Auto-select most recent conversation if one exists and none is selected
  useEffect(() => {
    if (currentUser && !currentConversationId && conversations.length > 0) {
      const sortedConversations = [...conversations].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      if (sortedConversations.length > 0) {
        setCurrentConversationId(sortedConversations[0].id);
      }
    }
  }, [conversations, currentConversationId, currentUser]);

  const handleNewConversation = useCallback(() => {
    if (!currentUser) return; // Should not happen if page is protected
    const newConvId = uuidv4();
    const newConversation: Conversation = {
      id: newConvId,
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConvId);
    setActiveMessages([]); // Initialize with no messages for new conversation
  }, [setConversations, currentUser]);

  const handleSendMessage = async (queryText: string) => {
    if (!currentUser) {
      router.push('/auth');
      return;
    }

    const userMessage: Message = {
      id: uuidv4(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toISOString(),
    };

    let targetConversationId = currentConversationId;

    if (!targetConversationId) {
      // No current conversation, create a new one
      const newConvId = uuidv4();
      const newConversation: Conversation = {
        id: newConvId,
        title: queryText.substring(0, 40) + (queryText.length > 40 ? '...' : ''),
        messages: [userMessage], // Include userMessage directly
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversationId(newConvId);
      setActiveMessages([userMessage]);
      targetConversationId = newConvId;
    } else {
      // Existing conversation or "New Chat" placeholder
      setConversations(prevConvs =>
        prevConvs.map(conv => {
          if (conv.id === targetConversationId) {
            const isRenamingNewChatPlaceholder = conv.messages.length === 0 && conv.title === "New Chat";
            return {
              ...conv,
              title: isRenamingNewChatPlaceholder ? (queryText.substring(0, 40) + (queryText.length > 40 ? '...' : '')) : conv.title,
              messages: [...conv.messages, userMessage],
              updatedAt: new Date().toISOString(),
            };
          }
          return conv;
        })
      );
      // Immediately show user message
      setActiveMessages(prev => [...prev, userMessage]);
    }

    if (!targetConversationId) return; // Should not be reached

    setIsLoading(true);
    try {
      const aiResponse = await legalQuery({ query: queryText });
      const aiMessage: Message = {
        id: uuidv4(),
        sender: 'ai',
        text: aiResponse.answer,
        timestamp: new Date().toISOString(),
      };
      // No useEffect reliance here; update active messages directly
      setActiveMessages(prev => [...prev, aiMessage]);
      setConversations(prevConvs =>
        prevConvs.map(conv =>
          conv.id === targetConversationId
            ? { ...conv, messages: [...conv.messages, aiMessage], updatedAt: new Date().toISOString() }
            : conv
        )
      );
    } catch (error) {
      console.error('Error fetching AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get response from LEGIT. Please try again.",
        variant: "destructive",
      });
      // Ensure error message is also added to view
      setActiveMessages(prev => [...prev, { id: uuidv4(), sender: 'ai', text: "Sorry, I encountered an error. Please try again.", timestamp: new Date().toISOString() }]);
      const errorMessage: Message = {
        id: uuidv4(),
        sender: 'ai',
        text: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      // No setActiveMessages here; rely on conversation state
      setConversations(prevConvs =>
        prevConvs.map(conv =>
          conv.id === targetConversationId
            ? { ...conv, messages: [...conv.messages, errorMessage], updatedAt: new Date().toISOString() }
            : conv
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (id: string) => {
    if (!currentUser) return;
    setCurrentConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    if (!currentUser) return;
    const remainingConversations = conversations.filter(c => c.id !== id);
    setConversations(remainingConversations);

    if (currentConversationId === id) {
      if (remainingConversations.length > 0) {
         const sortedRemaining = [...remainingConversations].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
         setCurrentConversationId(sortedRemaining[0].id);
      } else {
        setCurrentConversationId(null);
        setActiveMessages([]);
      }
    }
  };

  const handleClearHistory = () => {
    if (!currentUser) return;
    setConversations([]);
    setCurrentConversationId(null);
    setActiveMessages([]);
     toast({
        title: "History Cleared",
        description: "All conversations have been deleted.",
      });
  };

  if (authLoading || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <AppHeader onNewChat={handleNewConversation} />
      <div className="flex flex-1 overflow-hidden">
        <HistorySidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onNewConversation={handleNewConversation}
          onClearHistory={handleClearHistory}
        />
        <div className="flex-1 flex flex-col bg-background">
          <ChatInterface
            messages={activeMessages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            currentConversationId={currentConversationId}
          />
        </div>
      </div>
    </div>
  );
}
