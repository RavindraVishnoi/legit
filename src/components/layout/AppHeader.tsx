
import { Scale, User, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { Skeleton } from '@/components/ui/skeleton';

interface AppHeaderProps {
  onNewChat: () => void; // Kept for potential future use or if sidebar triggers new chat through header
}

export function AppHeader({ onNewChat }: AppHeaderProps) {
  const { currentUser, signOutUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOutUser();
    // signOutUser in AuthContext handles navigation to /auth
  };

  const handleLogin = () => {
    router.push('/auth');
  };
  
  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-card shadow-sm h-16">
      <div className="flex items-center gap-2">
        <Scale className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-semibold text-primary">LEGIT</h1>
      </div>
      
      <div className="flex items-center gap-3">
        {authLoading ? (
          <Skeleton className="h-10 w-24 rounded-md" />
        ) : currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-10 w-10 border border-border shadow-sm">
                  <AvatarImage 
                    src={currentUser.photoURL || `https://placehold.co/40x40.png?text=${currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}`} 
                    alt={currentUser.displayName || 'User avatar'}
                    data-ai-hint="person silhouette" 
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {currentUser.displayName ? (
                      currentUser.displayName.charAt(0).toUpperCase()
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1 py-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser.displayName || "User"}
                  </p>
                  {currentUser.email && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Add other items like "Settings" or "Profile" here if needed */}
              {/* <DropdownMenuItem onClick={onNewChat}>
                 <PlusCircle className="mr-2 h-4 w-4" />
                 New Chat
              </DropdownMenuItem> 
              <DropdownMenuSeparator /> 
              */}
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={handleLogin} variant="outline" className="rounded-lg shadow-sm">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
