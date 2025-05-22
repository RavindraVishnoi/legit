"use client";

import type { Conversation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pin, PinOff, Plus, Trash2, MessageSquareText, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, Fragment } from 'react';
import Link from 'next/link';
import { SettingsThemeToggle } from '@/components/ThemeToggle';

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
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false); // For pinning
  const [isHovering, setIsHovering] = useState(false); // For hover effect
  const sidebarEffectivelyExpanded = isManuallyExpanded || isHovering;

  const sortedConversations = conversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const togglePinState = () => {
    setIsManuallyExpanded(!isManuallyExpanded);
  };
  
  return (
    <Fragment>
      <aside
        className={cn(
          "group flex h-full flex-col bg-gradient-to-b from-sidebar-background/90 to-sidebar-background/70 border-r border-border transition-all duration-300 overflow-hidden shadow-xl rounded-r-2xl",
          sidebarEffectivelyExpanded ? "w-64" : "w-16"
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        data-expanded={sidebarEffectivelyExpanded} // Used by child components to adapt
      >
        {/* Top menu and actions */}
        <div className="flex flex-col gap-2 p-3 items-center">
          <Button
            variant="ghost"
            size="icon"
            title={isManuallyExpanded ? "Unpin sidebar" : "Pin sidebar to keep it open"}
            onClick={togglePinState}
            className="rounded-lg hover:bg-accent/30 w-full flex items-center justify-center group-data-[expanded=true]:justify-start group-data-[expanded=true]:px-3 h-9 text-sm font-medium"
          >
            {isManuallyExpanded ? (
              <PinOff className="h-5 w-5 shrink-0 group-data-[expanded=true]:mr-2" />
            ) : (
              <Pin className="h-5 w-5 shrink-0 group-data-[expanded=true]:mr-2" />
            )}
            <span className="hidden group-data-[expanded=true]:inline">
              {isManuallyExpanded ? "Unpin sidebar" : "Pin sidebar"}
            </span>
          </Button>
          <Button
            variant="ghost"
            title="New Chat"
            onClick={onNewConversation}
            className="rounded-lg hover:bg-primary/10 w-full flex items-center justify-center group-data-[expanded=true]:justify-start group-data-[expanded=true]:px-3 h-9 text-sm font-medium"
          >
            <Plus className="h-5 w-5 shrink-0 group-data-[expanded=true]:mr-2" />
            <span className="hidden group-data-[expanded=true]:inline">New Chat</span>
          </Button>
          <Button
            variant="ghost"
            title="Clear History"
            onClick={onClearHistory}
            className="rounded-lg hover:bg-destructive/10 w-full flex items-center justify-center group-data-[expanded=true]:justify-start group-data-[expanded=true]:px-3 h-9 text-sm font-medium"
          >
            <Trash2 className="h-5 w-5 shrink-0 group-data-[expanded=true]:mr-2" />
            <span className="hidden group-data-[expanded=true]:inline">Clear</span>
          </Button>
        </div>
        {/* Chat history */}
        <ScrollArea className="flex-1 px-1 group-data-[expanded=true]:px-3 overflow-y-auto">
          <div className="space-y-1">
            {sortedConversations.map(conv => (
              <div key={conv.id} className="relative group/item">
                <Button
                  variant={conv.id === currentConversationId ? 'secondary' : 'ghost'}
                  className={cn(
                    "w-full flex items-center py-2 px-1 group-data-[expanded=true]:px-2 text-left rounded-lg transition-colors h-9 text-sm font-medium",
                    conv.id === currentConversationId ? "bg-primary/20 text-primary" : "hover:bg-accent/20"
                  )}
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <MessageSquareText className="h-4 w-4 shrink-0 group-data-[expanded=true]:mr-2" />
                  <span className="hidden group-data-[expanded=true]:inline truncate">{conv.title}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 rounded-lg hover:bg-destructive/10 h-7 w-7"
                  onClick={(e) => { e.stopPropagation(); onDeleteConversation(conv.id); }}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        {/* Settings and About at bottom */}
        <div className="p-3 flex flex-col gap-1 items-center border-t border-border/50 mt-auto">
          <Link href="/about" passHref className="w-full">
            <Button 
              variant="ghost" 
              title="About" 
              className="rounded-lg hover:bg-accent/30 w-full flex items-center justify-center group-data-[expanded=true]:justify-start group-data-[expanded=true]:px-3 h-9 text-sm font-medium"
            >
              <Info className="h-5 w-5 shrink-0 group-data-[expanded=true]:mr-2" />
              <span className="hidden group-data-[expanded=true]:inline">About</span>
            </Button>
          </Link>
          <div className="w-full">
            <SettingsThemeToggle />
          </div>
        </div>
      </aside>
    </Fragment>
  );
}
