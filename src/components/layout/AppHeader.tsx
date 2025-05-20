import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  onNewChat: () => void;
}

export function AppHeader({ onNewChat }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-card shadow-sm h-16">
      <div className="flex items-center gap-2">
        <Scale className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-semibold text-primary">LlamaLegit</h1>
      </div>
      {/* Add any header actions here if needed, e.g., New Chat button */}
      {/* <Button onClick={onNewChat} variant="outline">New Chat</Button> */}
    </header>
  );
}
