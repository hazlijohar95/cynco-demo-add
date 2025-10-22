import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, CreditCard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileSectionProps {
  onSettingsClick: () => void;
  collapsed?: boolean;
}

export const ProfileSection = ({ onSettingsClick, collapsed }: ProfileSectionProps) => {
  return (
    <div className="border-t border-border">
      {/* Subscription Status */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded flex items-center justify-center bg-foreground text-background">
            <CreditCard className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Pro Plan
              </div>
              <div className="font-mono text-xs text-foreground">Active</div>
            </div>
          )}
        </div>
      </div>

      {/* Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full h-auto p-3 rounded-none hover:bg-accent hover:text-accent-foreground justify-start"
          >
            <div className="flex items-center gap-3 w-full">
              <Avatar className="h-8 w-8 border-2 border-foreground">
                <AvatarFallback className="bg-foreground text-background font-mono text-xs font-bold">
                  CA
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 text-left min-w-0">
                  <div className="font-mono text-xs font-semibold truncate">
                    Cynco Admin
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground truncate">
                    admin@cynco.com
                  </div>
                </div>
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-mono text-xs">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onSettingsClick}
            className="font-mono text-xs cursor-pointer"
          >
            <Settings className="mr-2 h-3 w-3" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="font-mono text-xs cursor-pointer">
            <CreditCard className="mr-2 h-3 w-3" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="font-mono text-xs cursor-pointer text-destructive">
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
