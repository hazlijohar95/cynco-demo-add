import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Plus } from "lucide-react";
import { ReconciliationSummary as Summary, ReconciliationDiscrepancy } from "@/types/reconciliation";
import { formatCurrency } from "@/utils/reconciliationLogic";

interface ReconciliationSummaryProps {
  summary: Summary;
  discrepancies: ReconciliationDiscrepancy[];
  onAddAdjustment?: (discrepancy: ReconciliationDiscrepancy) => void;
}

export const ReconciliationSummary = ({ summary, discrepancies, onAddAdjustment }: ReconciliationSummaryProps) => {
  const getDiscrepancyLabel = (type: ReconciliationDiscrepancy['type']) => {
    const labels = {
      outstanding_check: 'Outstanding Check',
      deposit_in_transit: 'Deposit in Transit',
      bank_fee: 'Bank Fee',
      interest: 'Interest Income',
      nsf_check: 'NSF Check',
      bank_error: 'Bank Error',
      book_error: 'Book Error'
    };
    return labels[type];
  };

  const getDiscrepancyColor = (type: ReconciliationDiscrepancy['type']) => {
    if (type === 'outstanding_check' || type === 'deposit_in_transit') return 'default';
    if (type === 'bank_fee' || type === 'nsf_check') return 'destructive';
    if (type === 'interest') return 'default';
    return 'secondary';
  };

  return (
    <Card className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b">
        <h3 className="text-base sm:text-lg font-semibold">Reconciliation Summary</h3>
        {summary.isBalanced ? (
          <Badge className="bg-green-600 hover:bg-green-700 w-fit">
            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
            <span className="text-xs sm:text-sm">BALANCED</span>
          </Badge>
        ) : (
          <Badge variant="destructive" className="w-fit">
            <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
            <span className="text-xs sm:text-sm">UNBALANCED - {formatCurrency(summary.difference)} difference</span>
          </Badge>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Book Balance Calculation */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            📖 <span>Book Balance Calculation</span>
          </h4>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span>Book Balance (per GL)</span>
              <span className="font-medium">{formatCurrency(summary.bookBalance)}</span>
            </div>
            {summary.depositsInTransit > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span className="pl-3">+ Deposits in Transit</span>
                <span className="font-medium">{formatCurrency(summary.depositsInTransit)}</span>
              </div>
            )}
            {summary.outstandingChecks > 0 && (
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span className="pl-3">- Outstanding Checks</span>
                <span className="font-medium">({formatCurrency(summary.outstandingChecks)})</span>
              </div>
            )}
            {summary.bankAdjustments !== 0 && (
              <div className={`flex justify-between ${summary.bankAdjustments > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                <span className="pl-3">{summary.bankAdjustments > 0 ? '+' : '-'} Bank Adjustments</span>
                <span className="font-medium">{summary.bankAdjustments > 0 ? formatCurrency(summary.bankAdjustments) : `(${formatCurrency(Math.abs(summary.bankAdjustments))})`}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t font-semibold">
              <span>Adjusted Book Balance</span>
              <span>{formatCurrency(summary.adjustedBookBalance)}</span>
            </div>
          </div>
        </div>

        {/* Bank Balance Calculation */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            🏦 <span>Bank Statement Calculation</span>
          </h4>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span>Bank Statement Balance</span>
              <span className="font-medium">{formatCurrency(summary.bankBalance)}</span>
            </div>
            {summary.depositsInTransit > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span className="pl-3">+ Deposits in Transit</span>
                <span className="font-medium">{formatCurrency(summary.depositsInTransit)}</span>
              </div>
            )}
            {summary.outstandingChecks > 0 && (
              <div className="flex justify-between text-red-600 dark:text-red-400">
                <span className="pl-3">- Outstanding Checks</span>
                <span className="font-medium">({formatCurrency(summary.outstandingChecks)})</span>
              </div>
            )}
            {summary.bookAdjustments !== 0 && (
              <div className={`flex justify-between ${summary.bookAdjustments > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                <span className="pl-3">{summary.bookAdjustments > 0 ? '+' : '-'} Book Adjustments</span>
                <span className="font-medium">{summary.bookAdjustments > 0 ? formatCurrency(summary.bookAdjustments) : `(${formatCurrency(Math.abs(summary.bookAdjustments))})`}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t font-semibold">
              <span>Adjusted Bank Balance</span>
              <span>{formatCurrency(summary.adjustedBankBalance)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discrepancies */}
      {discrepancies.length > 0 && (
        <div className="space-y-3 pt-3 sm:pt-4 border-t">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Identified Discrepancies ({discrepancies.length})</span>
          </h4>
          <div className="space-y-2">
            {discrepancies.map((disc, index) => (
              <div key={disc.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 sm:p-3 bg-muted/30 rounded-lg">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getDiscrepancyColor(disc.type)} className="text-xs">
                      {getDiscrepancyLabel(disc.type)}
                    </Badge>
                    <span className="text-xs sm:text-sm font-medium truncate">{disc.description}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span>Ref: {disc.reference}</span>
                    <span className="mx-2">•</span>
                    <span className="font-medium">{formatCurrency(disc.amount)}</span>
                  </div>
                </div>
                {disc.needsAdjustment && onAddAdjustment && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddAdjustment(disc)}
                    className="text-xs w-full sm:w-auto"
                  >
                    <Plus className="h-3 w-3 mr-1.5" />
                    Create Adjustment
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Objective */}
      {!summary.isBalanced && (
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-3 sm:p-4 rounded-lg">
          <div className="flex gap-2 sm:gap-3">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <h5 className="font-medium text-xs sm:text-sm text-yellow-900 dark:text-yellow-100">Next Steps:</h5>
              <ul className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200 space-y-1 list-disc ml-4">
                <li>Review unmatched items and create adjustments as needed</li>
                <li>For bank fees and interest, create journal entries to record them</li>
                <li>For outstanding checks and deposits in transit, no action needed - they're timing differences</li>
                <li>Once adjustments are made, the reconciliation should balance</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
