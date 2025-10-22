import { FileSpreadsheet, BookOpen, Scale, TrendingUp, Building, Table } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Chart of Accounts", url: "/", view: "coa", icon: Table },
  { title: "Journal Entries", url: "/", view: "journal", icon: FileSpreadsheet },
  { title: "Ledger", url: "/", view: "ledger", icon: BookOpen },
  { title: "Trial Balance", url: "/", view: "trial", icon: Scale },
  { title: "P&L", url: "/", view: "pl", icon: TrendingUp },
  { title: "Balance Sheet", url: "/", view: "balance", icon: Building },
];

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="gap-0">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.view)}
                    isActive={activeView === item.view}
                    className="font-mono text-xs h-10 rounded-none border-b border-border hover:bg-muted data-[active=true]:bg-foreground data-[active=true]:text-background"
                  >
                    <item.icon className="h-4 w-4" />
                    {open && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
