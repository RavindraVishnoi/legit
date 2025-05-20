
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
      setActiveMessages([]); // Clear messages if no conversation is selected
    }
  }, [currentConversationId, conversations]);
  
  // Auto-select most recent conversation if one exists and none is selected
  useEffect(() => {
    if (!currentConversationId && conversations.length > 0) {
      const sortedConversations = [...conversations].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      if (sortedConversations.length > 0) {
        setCurrentConversationId(sortedConversations[0].id);
      }
    }
    // If no currentConversationId and no conversations, the ChatInterface will show WelcomeContent
  }, [conversations, currentConversationId]);


  const handleNewConversation = useCallback(() => {
    const newConvId = uuidv4();
    // Initial title, will be updated by first message if user types directly
    // or can be kept generic if new chat is initiated from button
    const newConversation: Conversation = {
      id: newConvId,
      title: 'New Chat', 
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConvId);
    setActiveMessages([]); // Start with empty messages for the new chat
  }, [setConversations]);

  const handleSendMessage = async (queryText: string) => {
    let convId = currentConversationId;

    if (!convId) {
      const newConvId = uuidv4();
      const newConversation: Conversation = {
        id: newConvId,
        title: queryText.substring(0, 40) + (queryText.length > 40 ? '...' : ''), // Set title from first query
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

    // Update active messages immediately for responsiveness
    // If it's a new chat (convId was just set), activeMessages would be empty
    setActiveMessages(prev => [...prev, userMessage]);

    setConversations(prevConvs =>
      prevConvs.map(conv => {
        if (conv.id === convId) {
          // Update title only if it's the first message of a "New Chat" titled conversation
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
    setCurrentConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
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
            // startNewConversation prop removed as it's no longer used by ChatInterface
          />
        </div>
      </div>
    </div>
  );
}

