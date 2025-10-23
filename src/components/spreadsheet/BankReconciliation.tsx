import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Circle, AlertCircle, FileText, Download } from "lucide-react";
import { ReconciliationSession, ReconciliationMatch, DemoCase } from "@/types/reconciliation";
import { JournalEntry } from "@/types";
import { generateDemoCases, getDemoCaseJournalEntries } from "@/utils/reconciliationData";
import { autoMatchTransactions, calculateReconciliationSummary, identifyDiscrepancies, calculateBookBalance, formatCurrency } from "@/utils/reconciliationLogic";
import { ReconciliationSummary } from "./ReconciliationSummary";
import { toast } from "sonner";

interface BankReconciliationProps {
  journalEntries: JournalEntry[];
  onAddJournalEntry: (entry: Omit<JournalEntry, "id">) => void;
}

export const BankReconciliation = ({ journalEntries, onAddJournalEntry }: BankReconciliationProps) => {
  const [demoCases] = useState<DemoCase[]>(generateDemoCases());
  const [selectedCase, setSelectedCase] = useState<DemoCase | null>(null);
  const [session, setSession] = useState<ReconciliationSession | null>(null);
  const [matches, setMatches] = useState<ReconciliationMatch[]>([]);
  const [relevantJournalEntries, setRelevantJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    if (selectedCase) {
      // Get demo journal entries for this case
      const demoEntries = getDemoCaseJournalEntries(selectedCase.session.id);
      setRelevantJournalEntries(demoEntries);
      setSession(selectedCase.session);
      setMatches([]);
    }
  }, [selectedCase]);

  const handleLoadDemoCase = (caseId: string) => {
    const demoCase = demoCases.find(c => c.id === caseId);
    if (demoCase) {
      setSelectedCase(demoCase);
      toast.success(`Loaded: ${demoCase.name}`);
    }
  };

  const handleAutoMatch = () => {
    if (!session) return;
    
    const newMatches = autoMatchTransactions(
      session.bankStatementEntries,
      relevantJournalEntries,
      matches
    );
    
    setMatches([...matches, ...newMatches]);
    
    // Update cleared status
    const updatedBankEntries = session.bankStatementEntries.map(entry => ({
      ...entry,
      isCleared: [...matches, ...newMatches].some(m => m.bankEntryId === entry.id)
    }));
    
    setSession({
      ...session,
      bankStatementEntries: updatedBankEntries
    });
    
    toast.success(`Auto-matched ${newMatches.length} transactions`);
  };

  const handleManualMatch = (bankEntryId: string, journalEntryId: string) => {
    if (matches.some(m => m.bankEntryId === bankEntryId || m.journalEntryId === journalEntryId)) {
      toast.error("One of these items is already matched");
      return;
    }

    const newMatch: ReconciliationMatch = {
      id: `match-${Date.now()}`,
      bankEntryId,
      journalEntryId,
      matchDate: new Date().toISOString(),
      matchType: 'manual',
      confidence: 100
    };

    setMatches([...matches, newMatch]);
    
    // Update cleared status
    if (session) {
      const updatedBankEntries = session.bankStatementEntries.map(entry => ({
        ...entry,
        isCleared: entry.id === bankEntryId ? true : [...matches, newMatch].some(m => m.bankEntryId === entry.id)
      }));
      
      setSession({
        ...session,
        bankStatementEntries: updatedBankEntries
      });
    }
    
    toast.success("Manually matched transaction");
  };

  const handleUnmatch = (matchId: string) => {
    setMatches(matches.filter(m => m.id !== matchId));
    
    // Update cleared status
    if (session) {
      const match = matches.find(m => m.id === matchId);
      if (match) {
        const updatedBankEntries = session.bankStatementEntries.map(entry => ({
          ...entry,
          isCleared: entry.id === match.bankEntryId ? false : matches.filter(m => m.id !== matchId).some(m => m.bankEntryId === entry.id)
        }));
        
        setSession({
          ...session,
          bankStatementEntries: updatedBankEntries
        });
      }
    }
    
    toast.info("Transaction unmatched");
  };

  const isMatched = (id: string, type: 'bank' | 'journal') => {
    if (type === 'bank') {
      return matches.some(m => m.bankEntryId === id);
    }
    return matches.some(m => m.journalEntryId === id);
  };

  const getMatchedPair = (id: string, type: 'bank' | 'journal') => {
    if (type === 'bank') {
      return matches.find(m => m.bankEntryId === id);
    }
    return matches.find(m => m.journalEntryId === id);
  };

  const bookBalance = calculateBookBalance(relevantJournalEntries);
  const discrepancies = session ? identifyDiscrepancies(session.bankStatementEntries, relevantJournalEntries, matches) : [];
  const summary = session ? calculateReconciliationSummary(bookBalance, session.endingBalance, discrepancies) : null;

  if (!selectedCase) {
    return (
      <div className="h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <FileText className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-primary/60" />
            <h2 className="text-xl sm:text-2xl font-semibold">Bank Reconciliation</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Match your book records with bank statements to ensure accuracy
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Select a Demo Case to Start:</label>
            <Select onValueChange={handleLoadDemoCase}>
              <SelectTrigger className="h-10 sm:h-11">
                <SelectValue placeholder="Choose a reconciliation scenario..." />
              </SelectTrigger>
              <SelectContent>
                {demoCases.map(demoCase => (
                  <SelectItem key={demoCase.id} value={demoCase.id}>
                    <div className="flex flex-col py-1">
                      <span className="font-medium text-sm sm:text-base">{demoCase.name}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">{demoCase.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              What you'll learn:
            </h3>
            <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li>Match book records with bank statements</li>
              <li>Identify timing differences (outstanding checks, deposits in transit)</li>
              <li>Handle bank fees, interest, and errors</li>
              <li>Create adjustment entries when needed</li>
              <li>Complete a full reconciliation cycle</li>
            </ul>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">{selectedCase.name}</h2>
            <Badge variant="outline" className="text-xs">{selectedCase.session.month} {selectedCase.session.year}</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">{selectedCase.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleAutoMatch} size="sm" variant="outline" className="text-xs sm:text-sm">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
            Auto Match
          </Button>
          <Select value={selectedCase.id} onValueChange={handleLoadDemoCase}>
            <SelectTrigger className="w-[140px] sm:w-[160px] h-8 sm:h-9 text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {demoCases.map(dc => (
                <SelectItem key={dc.id} value={dc.id} className="text-xs sm:text-sm">
                  Case {dc.id.split('_')[0]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 min-h-0">
        {/* Book Records */}
        <Card className="flex flex-col overflow-hidden">
          <div className="p-3 sm:p-4 border-b bg-muted/30">
            <h3 className="font-semibold text-sm sm:text-base">📖 Book Records (Cash Account 1011)</h3>
            <p className="text-xs text-muted-foreground mt-1">Balance: {formatCurrency(bookBalance)}</p>
          </div>
          <div className="flex-1 overflow-auto p-2 sm:p-3 space-y-1.5 sm:space-y-2">
            {relevantJournalEntries.map(entry => {
              const matched = isMatched(entry.id, 'journal');
              const matchPair = getMatchedPair(entry.id, 'journal');
              
              return (
                <div
                  key={entry.id}
                  className={`p-2.5 sm:p-3 rounded-lg border transition-all ${
                    matched 
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                      : 'bg-card hover:bg-muted/50 cursor-pointer'
                  }`}
                  onClick={() => !matched && console.log('Select to match:', entry.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {matched ? (
                          <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className="text-xs sm:text-sm font-medium truncate">{entry.description}</span>
                      </div>
                      <div className="text-xs text-muted-foreground ml-5 sm:ml-6 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span>Date: {entry.date}</span>
                          <span>•</span>
                          <span>Ref: {entry.reference}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {entry.debit > 0 && (
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              +{formatCurrency(entry.debit)}
                            </span>
                          )}
                          {entry.credit > 0 && (
                            <span className="text-red-600 dark:text-red-400 font-medium">
                              -{formatCurrency(entry.credit)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {matched && matchPair && (
                      <Button 
                        onClick={() => handleUnmatch(matchPair.id)}
                        size="sm" 
                        variant="ghost"
                        className="text-xs h-7 px-2"
                      >
                        Unmatch
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Bank Statement */}
        <Card className="flex flex-col overflow-hidden">
          <div className="p-3 sm:p-4 border-b bg-muted/30">
            <h3 className="font-semibold text-sm sm:text-base">🏦 Bank Statement</h3>
            <p className="text-xs text-muted-foreground mt-1">Ending Balance: {session && formatCurrency(session.endingBalance)}</p>
          </div>
          <div className="flex-1 overflow-auto p-2 sm:p-3 space-y-1.5 sm:space-y-2">
            {session?.bankStatementEntries.map(entry => {
              const matched = isMatched(entry.id, 'bank');
              const matchPair = getMatchedPair(entry.id, 'bank');
              
              return (
                <div
                  key={entry.id}
                  className={`p-2.5 sm:p-3 rounded-lg border transition-all ${
                    matched 
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                      : entry.type === 'fee' || entry.type === 'interest'
                      ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
                      : 'bg-card hover:bg-muted/50 cursor-pointer'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {matched ? (
                          <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : entry.type === 'fee' || entry.type === 'interest' ? (
                          <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className="text-xs sm:text-sm font-medium truncate">{entry.description}</span>
                      </div>
                      <div className="text-xs text-muted-foreground ml-5 sm:ml-6 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span>Date: {entry.date}</span>
                          <span>•</span>
                          <span>Ref: {entry.reference}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {entry.deposit > 0 && (
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              +{formatCurrency(entry.deposit)}
                            </span>
                          )}
                          {entry.withdrawal > 0 && (
                            <span className="text-red-600 dark:text-red-400 font-medium">
                              -{formatCurrency(entry.withdrawal)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {matched && matchPair && (
                      <Button 
                        onClick={() => handleUnmatch(matchPair.id)}
                        size="sm" 
                        variant="ghost"
                        className="text-xs h-7 px-2"
                      >
                        Unmatch
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Summary */}
      {summary && (
        <ReconciliationSummary
          summary={summary}
          discrepancies={discrepancies}
          onAddAdjustment={(disc) => {
            // Create adjustment journal entry
            if (disc.type === 'bank_fee') {
              onAddJournalEntry({
                date: session?.date || new Date().toISOString().split('T')[0],
                account: '6920 - Bank Service Charges',
                description: disc.description,
                debit: disc.amount,
                credit: 0,
                reference: disc.reference
              });
              onAddJournalEntry({
                date: session?.date || new Date().toISOString().split('T')[0],
                account: '1011 - Cash',
                description: disc.description,
                debit: 0,
                credit: disc.amount,
                reference: disc.reference
              });
              toast.success("Adjustment entry created for bank fee");
            } else if (disc.type === 'interest') {
              onAddJournalEntry({
                date: session?.date || new Date().toISOString().split('T')[0],
                account: '1011 - Cash',
                description: disc.description,
                debit: disc.amount,
                credit: 0,
                reference: disc.reference
              });
              onAddJournalEntry({
                date: session?.date || new Date().toISOString().split('T')[0],
                account: '6950 - Interest Income',
                description: disc.description,
                debit: 0,
                credit: disc.amount,
                reference: disc.reference
              });
              toast.success("Adjustment entry created for interest income");
            }
          }}
        />
      )}
    </div>
  );
};
