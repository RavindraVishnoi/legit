"use client";

import type { Conversation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu, Plus, Trash2, MessageSquareText, Settings, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistorySidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewConversation: () => void;
  onClearHistory: () => void;
}

export function HistorySidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
  onClearHistory,
}: HistorySidebarProps) {
  const sorted = conversations
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return (
    <aside className="group flex h-full flex-col bg-gradient-to-b from-sidebar-background/90 to-sidebar-background/70 border-r border-border w-16 hover:w-64 transition-all duration-300 overflow-hidden shadow-xl rounded-r-2xl">
      {/* Top menu and new chat */}
      <div className="flex flex-col gap-2 p-3">
        <Button variant="ghost" size="icon" title="Menu" className="rounded-lg hover:bg-accent/30 w-full flex justify-center">
          <Menu className="h-5 w-5" />
        </Button>
        <Button variant="ghost" title="New Chat" onClick={onNewConversation} className="rounded-lg hover:bg-primary/10 w-full flex items-center justify-center group-hover:justify-start transition-all">
          <Plus className="h-5 w-5" />
          <span className="ml-2 hidden group-hover:inline text-sm font-medium">New Chat</span>
        </Button>
        <Button variant="ghost" title="Clear History" onClick={onClearHistory} className="rounded-lg hover:bg-destructive/10 w-full flex items-center justify-center group-hover:justify-start transition-all">
          <Trash2 className="h-5 w-5" />
          <span className="ml-2 hidden group-hover:inline text-sm font-medium">Clear</span>
        </Button>
      </div>
      {/* Chat history */}
      <ScrollArea className="flex-1 px-1 group-hover:px-3 overflow-y-auto">
        <div className="space-y-1">
          {sorted.map(conv => (
            <div key={conv.id} className="relative group/item">
              <Button
                variant={conv.id === currentConversationId ? 'secondary' : 'ghost'}
                className={cn(
                  "w-full flex items-center py-2 px-1 group-hover:px-2 text-left rounded-lg transition-colors",
                  conv.id === currentConversationId ? "bg-primary/20 text-primary" : "hover:bg-accent/20"
                )}
                onClick={() => onSelectConversation(conv.id)}
              >
                <MessageSquareText className="h-4 w-4" />
                <span className="ml-2 hidden group-hover:inline truncate text-sm font-medium">{conv.title}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 rounded-lg hover:bg-destructive/10"
                onClick={() => onDeleteConversation(conv.id)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      {/* Settings at bottom */}
      <div className="p-3 flex flex-col gap-2">
        <Button variant="ghost" title="About" className="rounded-lg hover:bg-accent/30 w-full flex items-center justify-center group-hover:justify-start transition-all">
          <Info className="h-5 w-5" />
          <span className="ml-2 hidden group-hover:inline text-sm font-medium">About</span>
        </Button>
        <Button variant="ghost" title="Settings" className="rounded-lg hover:bg-accent/30 w-full flex items-center justify-center group-hover:justify-start transition-all">
          <Settings className="h-5 w-5" />
          <span className="ml-2 hidden group-hover:inline text-sm font-medium">Settings</span>
        </Button>
      </div>
    </aside>
  );
}
