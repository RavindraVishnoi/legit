"use client";

import * as React from "react";
import { Moon, Sun, Settings2 as SettingsIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

// Compact version for embedding within other menus
export function ThemeSubMenu() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2" />
        <span>Theme</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}

// Standalone button for theme selection, suitable for sidebars
export function SettingsThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-center group-data-[expanded=true]:justify-start group-data-[expanded=true]:px-3 h-9 text-sm font-medium rounded-lg hover:bg-accent/30"
          title="Settings"
        >
          <SettingsIcon className="h-5 w-5 shrink-0 group-data-[expanded=true]:mr-2" /> 
          <span className="hidden group-data-[expanded=true]:inline">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Using the compact ThemeSubMenu here for consistency */}
        <ThemeSubMenu /> 
        {/* Example of how other settings could be added in the future */}
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
        {/* <DropdownMenuItem>Billing</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
