
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

export default function HomePage() {
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
      setActiveMessages(currentConv ? currentConv.messages : []);
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
    setActiveMessages([]);
  }, [setConversations, currentUser]);

  const handleSendMessage = async (queryText: string) => {
    if (!currentUser) { // Should not happen
      router.push('/auth');
      return;
    }
    let convId = currentConversationId;

    if (!convId) {
      const newConvId = uuidv4();
      const newConversation: Conversation = {
        id: newConvId,
        title: queryText.substring(0, 40) + (queryText.length > 40 ? '...' : ''),
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversationId(newConvId);
      convId = newConvId; 
    }
    
    if(!convId) return; 

    const userMessage: Message = {
      id: uuidv4(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toISOString(),
    };

    setActiveMessages(prev => [...prev, userMessage]);
    setConversations(prevConvs =>
      prevConvs.map(conv => {
        if (conv.id === convId) {
          const isNewChatBeingNamed = conv.messages.length === 0 && conv.title === "New Chat";
          return {
            ...conv,
            title: isNewChatBeingNamed ? (queryText.substring(0, 40) + (queryText.length > 40 ? '...' : '')) : conv.title,
            messages: [...conv.messages, userMessage],
            updatedAt: new Date().toISOString(),
          };
        }
        return conv;
      })
    );

    setIsLoading(true);
    try {
      const aiResponse = await legalQuery({ query: queryText });
      const aiMessage: Message = {
        id: uuidv4(),
        sender: 'ai',
        text: aiResponse.answer,
        timestamp: new Date().toISOString(),
      };
      setActiveMessages(prev => [...prev, aiMessage]);
      setConversations(prevConvs =>
        prevConvs.map(conv =>
          conv.id === convId
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
       const errorMessage: Message = {
        id: uuidv4(),
        sender: 'ai',
        text: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setActiveMessages(prev => [...prev, errorMessage]);
      setConversations(prevConvs =>
        prevConvs.map(conv =>
          conv.id === convId
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
        <div className="w-80 border-r border-border p-2 bg-muted/40 hidden md:block">
          <HistorySidebar
            conversations={conversations}
            currentConversationId={currentConversationId}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            onNewConversation={handleNewConversation}
            onClearHistory={handleClearHistory}
          />
        </div>
        <div className="flex-1 flex flex-col">
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
