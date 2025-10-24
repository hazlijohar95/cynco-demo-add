import { FileSpreadsheet, BookOpen, Scale, TrendingUp, Building, Table, History, Brain, CheckCircle } from "lucide-react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { ProfileSection } from "./ProfileSection";
import { SettingsDialog } from "./SettingsDialog";

const items = [
  { title: "Chart of Accounts", url: "/", view: "coa", icon: Table },
  { title: "Journal Entries", url: "/", view: "journal", icon: FileSpreadsheet },
  { title: "Ledger", url: "/", view: "ledger", icon: BookOpen },
  { title: "Trial Balance", url: "/", view: "trial", icon: Scale },
  { title: "P&L", url: "/", view: "pl", icon: TrendingUp },
  { title: "Balance Sheet", url: "/", view: "balance", icon: Building },
];

const openingBalanceItem = {
  title: "Opening Balance",
  url: "/",
  view: "opening",
  icon: History,
};

const knowledgeBaseItem = {
  title: "Knowledge Base",
  url: "/",
  view: "knowledge",
  icon: Brain,
};

const reconciliationItem = {
  title: "Bank Reconciliation",
  url: "/",
  view: "reconciliation",
  icon: CheckCircle,
};

interface AppSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onClearAllData: () => void;
  dataCounts?: {
    journalEntries: number;
    openingBalances: number;
    knowledgeEntries: number;
    isOpeningBalanced: boolean;
  };
}

export function AppSidebar({ activeView, onViewChange, onClearAllData, dataCounts }: AppSidebarProps) {
  const { open } = useSidebar();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const getDataIndicator = (view: string) => {
    if (!dataCounts || !open) return null;

    let count = 0;
    let badge = null;

    switch (view) {
      case "journal":
        count = dataCounts.journalEntries;
        break;
      case "opening":
        count = dataCounts.openingBalances;
        badge = dataCounts.isOpeningBalanced ? (
          <span className="text-[10px] text-green-600">✓</span>
        ) : count > 0 ? (
          <span className="text-[10px] text-destructive">✗</span>
        ) : null;
        break;
      case "knowledge":
        count = dataCounts.knowledgeEntries;
        break;
      case "reconciliation":
        // Show indicator if we have journal entries (reconciliation data ready)
        if (dataCounts.journalEntries > 20) {
          return (
            <span className="ml-auto flex items-center gap-1">
              <span className="text-[10px] font-mono font-semibold bg-green-600/20 text-green-600 px-1.5 py-0.5 rounded">
                READY
              </span>
            </span>
          );
        }
        return null;
      default:
        return null;
    }

    return (
      <span className="ml-auto flex items-center gap-1">
        {count > 0 && (
          <span className="text-[10px] font-mono font-semibold bg-accent text-accent-foreground px-1.5 py-0.5 rounded">
            {count}
          </span>
        )}
        {badge}
      </span>
    );
  };

  return (
    <>
      <Sidebar collapsible="icon" className="border-r-0">
        <SidebarContent className="gap-0">
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              {/* Section Label */}
              {open && (
                <div className="px-3 py-2 border-b border-border bg-muted/30">
                  <p className="text-[9px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Reports
                  </p>
                </div>
              )}
              
              <SidebarMenu className="gap-0">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => onViewChange(item.view)}
                      isActive={activeView === item.view}
                      className="font-mono text-xs h-10 rounded-none border-b border-border hover:bg-muted data-[active=true]:bg-foreground data-[active=true]:text-background data-[active=true]:border-l-2 data-[active=true]:border-l-foreground"
                      title={item.title}
                    >
                      <item.icon className="h-4 w-4" />
                      {open && (
                        <>
                          <span>{item.title}</span>
                          {getDataIndicator(item.view)}
                        </>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                
                {/* Data Entry Section */}
                {open && (
                  <div className="px-3 py-2 border-b border-border bg-muted/30 mt-2">
                    <p className="text-[9px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                      Data Entry
                    </p>
                  </div>
                )}

                {/* Opening Balance - Visually Distinct */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => onViewChange(openingBalanceItem.view)}
                    isActive={activeView === openingBalanceItem.view}
                    className="font-mono text-xs h-11 rounded-none border-b border-border hover:bg-muted data-[active=true]:bg-foreground data-[active=true]:text-background data-[active=true]:border-l-2 data-[active=true]:border-l-foreground"
                    title={openingBalanceItem.title}
                  >
                    <openingBalanceItem.icon className="h-4 w-4" />
                    {open && (
                      <>
                        <span className="font-semibold">{openingBalanceItem.title}</span>
                        {getDataIndicator(openingBalanceItem.view)}
                      </>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Resources Section */}
                {open && (
                  <div className="px-3 py-2 border-b border-border bg-muted/30 mt-2">
                    <p className="text-[9px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                      Resources
                    </p>
                  </div>
                )}

                {/* Knowledge Base - Visually Distinct */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => onViewChange(knowledgeBaseItem.view)}
                    isActive={activeView === knowledgeBaseItem.view}
                    className="font-mono text-xs h-11 rounded-none border-b border-border hover:bg-muted data-[active=true]:bg-foreground data-[active=true]:text-background data-[active=true]:border-l-2 data-[active=true]:border-l-foreground"
                    title={knowledgeBaseItem.title}
                  >
                    <knowledgeBaseItem.icon className="h-4 w-4" />
                    {open && (
                      <>
                        <span className="font-semibold">{knowledgeBaseItem.title}</span>
                        {getDataIndicator(knowledgeBaseItem.view)}
                      </>
                    )}
                  </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Bank Reconciliation */}
              <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => onViewChange(reconciliationItem.view)}
                    isActive={activeView === reconciliationItem.view}
                    className="font-mono text-xs h-11 rounded-none border-b border-border hover:bg-muted data-[active=true]:bg-foreground data-[active=true]:text-background data-[active=true]:border-l-2 data-[active=true]:border-l-foreground"
                    title={reconciliationItem.title}
                  >
                    <reconciliationItem.icon className="h-4 w-4" />
                    {open && (
                      <>
                        <span className="font-semibold">{reconciliationItem.title}</span>
                        {getDataIndicator(reconciliationItem.view)}
                      </>
                    )}
                  </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-0">
          <ProfileSection 
            onSettingsClick={() => setSettingsOpen(true)}
            collapsed={!open}
          />
        </SidebarFooter>
      </Sidebar>

      <SettingsDialog 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen}
        onClearAllData={onClearAllData}
        dataCounts={dataCounts}
      />
    </>
  );
}
