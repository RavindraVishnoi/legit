
"use client";

import type { Conversation } from '@/lib/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, MessageSquareText, Settings, HelpCircle, Edit3 } from 'lucide-react'; // Changed PlusCircle to Plus, MessageSquare to MessageSquareText
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from '@/components/ui/separator';


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
  return (
    <div className="flex h-full flex-col bg-sidebar-background text-sidebar-foreground">
      <div className="p-3">
        <Button onClick={onNewConversation} variant="outline" className="w-full justify-start bg-transparent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-sidebar-border">
          <Edit3 className="mr-0 group-hover:mr-2 h-4 w-4 flex-shrink-0" /> <span className="hidden group-hover:inline">New Chat</span>
        </Button>
      </div>
      
      <div className="flex items-center justify-between px-3 pt-2 pb-1">
        <h2 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase hidden group-hover:inline">Recent</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" title="Clear all history" disabled={conversations.length === 0} className="h-7 w-7 group-hover:ml-auto"> {/* Adjust margin for collapsed state */}
              <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete all your conversation history. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onClearHistory} className={cn(buttonVariants({variant: "destructive"}))}>
                Delete All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <ScrollArea className="flex-1 px-3 mb-2">
        {conversations.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground text-center hidden group-hover:inline">No conversations yet.</p>
        ) : (
          <div className="space-y-1">
            {conversations.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((conv) => (
              <div key={conv.id} className="group/item relative"> {/* Changed to group/item for specific hover on delete */}
                <Button
                  variant={conv.id === currentConversationId ? 'secondary' : 'ghost'}
                  className={cn(
                    "w-full justify-start h-auto py-2 px-2.5 text-left rounded-md",
                    conv.id === currentConversationId ? "bg-sidebar-accent/80 text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"
                  )}
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <MessageSquareText className="mr-0 group-hover:mr-2 h-4 w-4 flex-shrink-0" />
                  <div className="flex-col overflow-hidden flex-1 hidden group-hover:flex">
                     <span className="font-medium truncate text-sm">{conv.title}</span>
                     <span className="text-xs text-muted-foreground/80">
                        {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                     </span>
                  </div>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 h-7 w-7" // Use group-hover/item
                        title="Delete conversation"
                      >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Conversation?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this conversation: "{conv.title}"? This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDeleteConversation(conv.id)} className={cn(buttonVariants({variant: "destructive"}))}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <Separator className="my-2 bg-sidebar-border" />
      <div className="p-3 space-y-1">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
          <HelpCircle className="mr-0 group-hover:mr-2 h-4 w-4 flex-shrink-0" /> <span className="hidden group-hover:inline">Help</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
          <Settings className="mr-0 group-hover:mr-2 h-4 w-4 flex-shrink-0" /> <span className="hidden group-hover:inline">Settings</span>
        </Button>
      </div>
    </div>
  );
}
