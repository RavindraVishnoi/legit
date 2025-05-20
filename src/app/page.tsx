"use client";

import { useState, useEffect, useCallback } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { HistorySidebar } from '@/components/history/HistorySidebar';
import type { Message, Conversation } from '@/lib/types';
import useLocalStorage from '@/hooks/use-local-storage';
import { legalQuery } from '@/ai/flows/legal-query';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid'; // Using uuid for robust ID generation

export default function HomePage() {
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('legitConversations', []);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Effect to load messages for the current conversation
  useEffect(() => {
    if (currentConversationId) {
      const currentConv = conversations.find(c => c.id === currentConversationId);
      setActiveMessages(currentConv ? currentConv.messages : []);
    } else {
      setActiveMessages([]);
    }
  }, [currentConversationId, conversations]);
  
  // Auto-select first conversation or create one if none exist and none is selected
  useEffect(() => {
    if (!currentConversationId && conversations.length > 0) {
      const sortedConversations = [...conversations].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setCurrentConversationId(sortedConversations[0].id);
    } else if (!currentConversationId && conversations.length === 0) {
      // Optionally, you could auto-start a new conversation here,
      // or let the ChatInterface's empty state handle it.
      // For now, let the empty state handle it.
    }
  }, [conversations, currentConversationId]);


  const handleNewConversation = useCallback(() => {
    const newConvId = uuidv4();
    const newConversation: Conversation = {
      id: newConvId,
      title: 'New Chat', // Will be updated with first user message
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConvId);
  }, [setConversations]);

  const handleSendMessage = async (queryText: string) => {
    if (!currentConversationId) {
      // This should ideally not happen if UI forces new chat creation, but as a safeguard:
      handleNewConversation(); 
      // We need to wait for state update or pass the new ID.
      // For simplicity, let's assume currentConversationId will be set by handleNewConversation
      // and the user might need to send message again or we enhance this.
      // A better approach would be for handleNewConversation to return the ID or for
      // handleSendMessage to operate on a given ID.
      // Let's refine: if no currentConversationId, create one and then proceed.
      
      // The new conversation logic in handleNewConversation already sets currentConversationId.
      // So, a subsequent call to handleSendMessage will have it.
      // However, to make it atomic:
      let convId = currentConversationId;
      if (!convId) {
        const newConvId = uuidv4();
        const newConversation: Conversation = {
          id: newConvId,
          title: queryText.substring(0, 30) + (queryText.length > 30 ? '...' : ''),
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setConversations(prev => [newConversation, ...prev]);
        setCurrentConversationId(newConvId);
        convId = newConvId; // Use the new ID for this message operation
      }
       if(!convId) return; // Should not happen with above logic
    }

    const userMessage: Message = {
      id: uuidv4(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toISOString(),
    };

    // Update active messages immediately for responsiveness
    setActiveMessages(prev => [...prev, userMessage]);

    // Update the specific conversation in the conversations list
    setConversations(prevConvs =>
      prevConvs.map(conv => {
        if (conv.id === (currentConversationId || convId) ) {
          const isNewChat = conv.messages.length === 0;
          return {
            ...conv,
            title: isNewChat ? (queryText.substring(0, 40) + (queryText.length > 40 ? '...' : '')) : conv.title,
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
          conv.id === (currentConversationId || convId)
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
      // Optionally, add an error message to chat
       const errorMessage: Message = {
        id: uuidv4(),
        sender: 'ai',
        text: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setActiveMessages(prev => [...prev, errorMessage]);
      setConversations(prevConvs =>
        prevConvs.map(conv =>
          conv.id === (currentConversationId || convId)
            ? { ...conv, messages: [...conv.messages, errorMessage], updatedAt: new Date().toISOString() }
            : conv
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null); // Deselect if current one is deleted
      // Next active conversation could be the most recent one after deletion
      const remainingConversations = conversations.filter(c => c.id !== id);
      if (remainingConversations.length > 0) {
         const sortedRemaining = [...remainingConversations].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
         setCurrentConversationId(sortedRemaining[0].id);
      }
    }
  };
  
  const handleClearHistory = () => {
    setConversations([]);
    setCurrentConversationId(null);
    setActiveMessages([]);
     toast({
        title: "History Cleared",
        description: "All conversations have been deleted.",
      });
  };


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
            startNewConversation={handleNewConversation}
          />
        </div>
      </div>
    </div>
  );
}
