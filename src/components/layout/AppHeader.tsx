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
  onNewChat: () => void; 
}

export function AppHeader({ onNewChat }: AppHeaderProps) {
  const { currentUser, signOutUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOutUser();
    // Navigation is handled by signOutUser in AuthContext
  };

  const handleLogin = () => {
    router.push('/auth');
  };
  
  return (
    <header className="flex items-center justify-between p-3 md:p-4 bg-background text-foreground h-16">
      <div className="flex items-center gap-2">
        <Scale className="h-7 w-7 md:h-8 md:w-8 text-primary" />
        <h1 className="text-xl md:text-2xl font-semibold text-primary">LEGIT</h1>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        {authLoading ? (
          <Skeleton className="h-10 w-24 rounded-md" />
        ) : currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 md:h-10 md:w-10 rounded-full p-0">
                <Avatar className="h-9 w-9 md:h-10 md:w-10 border border-border">
                  <AvatarImage 
                    src={currentUser.photoURL || `https://placehold.co/40x40.png?text=${currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}`} 
                    alt={currentUser.displayName || 'User avatar'}
                    data-ai-hint="person silhouette" 
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {currentUser.displayName ? (
                      currentUser.displayName.charAt(0).toUpperCase()
                    ) : (
                      <User className="h-4 w-4 md:h-5 md:w-5" />
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
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={handleLogin} variant="outline" size="sm" className="rounded-lg">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        )}
      </div>
    </header>
  );
}
