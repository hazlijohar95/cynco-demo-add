import { JournalEntry, OpeningBalanceEntry, AIToolExecutionResult } from "@/types";
import { toast } from "sonner";

/**
 * Execute AI tool calls and manage data updates
 */
export class AIToolExecutor {
  private setJournalEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  private setOpeningBalances: React.Dispatch<React.SetStateAction<OpeningBalanceEntry[]>>;
  private setActiveView: React.Dispatch<React.SetStateAction<string>>;

  constructor(
    setJournalEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>,
    setOpeningBalances: React.Dispatch<React.SetStateAction<OpeningBalanceEntry[]>>,
    setActiveView: React.Dispatch<React.SetStateAction<string>>
  ) {
    this.setJournalEntries = setJournalEntries;
    this.setOpeningBalances = setOpeningBalances;
    this.setActiveView = setActiveView;
  }

  /**
   * Execute a single tool call
   */
  async executeTool(functionName: string, args: any): Promise<AIToolExecutionResult> {
    try {
      switch (functionName) {
        case 'add_journal_entry':
          return this.addJournalEntry(args);
        
        case 'update_journal_entry':
          return this.updateJournalEntry(args);
        
        case 'delete_journal_entry':
          return this.deleteJournalEntry(args);
        
        case 'add_opening_balance':
          return this.addOpeningBalance(args);
        
        default:
          console.warn('Unknown function called:', functionName);
          return {
            success: false,
            message: `Unknown function: ${functionName}`
          };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to execute ${functionName}: ${errorMsg}`);
      return {
        success: false,
        message: `Error: ${errorMsg}`
      };
    }
  }

  private addJournalEntry(args: any): AIToolExecutionResult {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: args.date || new Date().toISOString().split('T')[0],
      account: args.account,
      debit: Number(args.debit) || 0,
      credit: Number(args.credit) || 0,
      description: args.description,
      reference: args.reference || `REF-${Date.now()}`,
    };

    this.setJournalEntries((prev) => [...prev, newEntry]);
    this.setActiveView('journal');
    toast.success('✅ Journal entry added - View updated', { duration: 4000 });

    return {
      success: true,
      message: `Added journal entry: ${args.description}`,
      viewToSwitch: 'journal'
    };
  }

  private updateJournalEntry(args: any): AIToolExecutionResult {
    this.setJournalEntries((prev) => 
      prev.map((entry) => 
        entry.id === args.entryId 
          ? { ...entry, ...args }
          : entry
      )
    );

    this.setActiveView('journal');
    toast.success('✅ Journal entry updated - View refreshed', { duration: 4000 });

    return {
      success: true,
      message: `Updated journal entry ${args.entryId}`,
      viewToSwitch: 'journal'
    };
  }

  private deleteJournalEntry(args: any): AIToolExecutionResult {
    this.setJournalEntries((prev) => 
      prev.filter((entry) => entry.id !== args.entryId)
    );

    this.setActiveView('journal');
    toast.success('✅ Journal entry deleted - View refreshed', { duration: 4000 });

    return {
      success: true,
      message: `Deleted journal entry ${args.entryId}`,
      viewToSwitch: 'journal'
    };
  }

  private addOpeningBalance(args: any): AIToolExecutionResult {
    const newBalance: OpeningBalanceEntry = {
      id: Date.now().toString(),
      account: args.account,
      debit: Number(args.debit) || 0,
      credit: Number(args.credit) || 0,
      date: args.date || new Date().toISOString().split('T')[0],
    };

    this.setOpeningBalances((prev) => [...prev, newBalance]);
    this.setActiveView('opening');
    toast.success('✅ Opening balance added - View updated', { duration: 4000 });

    return {
      success: true,
      message: `Added opening balance for ${args.account}`,
      viewToSwitch: 'opening'
    };
  }
}
