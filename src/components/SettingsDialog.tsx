import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClearAllData: () => void;
  dataCounts?: {
    journalEntries: number;
    openingBalances: number;
    knowledgeEntries: number;
    isOpeningBalanced: boolean;
  };
}

export const SettingsDialog = ({ open, onOpenChange, onClearAllData, dataCounts }: SettingsDialogProps) => {
  const [settings, setSettings] = useState({
    companyName: "Cynco Accounting",
    fiscalYearEnd: "12-31",
    autoSave: true,
    showBalanceWarnings: true,
    decimalPlaces: 2,
    currency: "USD",
  });
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSave = () => {
    toast.success("Settings saved successfully");
    onOpenChange(false);
  };

  const handleClearData = () => {
    onClearAllData();
    setShowClearConfirm(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-lg">Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="font-mono text-sm font-semibold">Company Information</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="font-mono text-xs">
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) =>
                    setSettings({ ...settings, companyName: e.target.value })
                  }
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fiscalYearEnd" className="font-mono text-xs">
                  Fiscal Year End (MM-DD)
                </Label>
                <Input
                  id="fiscalYearEnd"
                  value={settings.fiscalYearEnd}
                  onChange={(e) =>
                    setSettings({ ...settings, fiscalYearEnd: e.target.value })
                  }
                  className="font-mono text-xs"
                  placeholder="12-31"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Display Preferences */}
          <div className="space-y-4">
            <h3 className="font-mono text-sm font-semibold">Display Preferences</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="currency" className="font-mono text-xs">
                  Currency
                </Label>
                <Input
                  id="currency"
                  value={settings.currency}
                  onChange={(e) =>
                    setSettings({ ...settings, currency: e.target.value })
                  }
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="decimalPlaces" className="font-mono text-xs">
                  Decimal Places
                </Label>
                <Input
                  id="decimalPlaces"
                  type="number"
                  min="0"
                  max="4"
                  value={settings.decimalPlaces}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      decimalPlaces: parseInt(e.target.value),
                    })
                  }
                  className="font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Automation */}
          <div className="space-y-4">
            <h3 className="font-mono text-sm font-semibold">Automation</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-mono text-xs">Auto-save Changes</Label>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Automatically save edits as you type
                  </p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoSave: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-mono text-xs">Balance Warnings</Label>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Show warnings when debits don't equal credits
                  </p>
                </div>
                <Switch
                  checked={settings.showBalanceWarnings}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showBalanceWarnings: checked })
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Data Management */}
          <div className="space-y-4">
            <h3 className="font-mono text-sm font-semibold text-destructive">Data Management</h3>
            <div className="space-y-3 p-4 border border-destructive/30 rounded-lg bg-destructive/5">
              <div className="space-y-2">
                <Label className="font-mono text-xs font-semibold">Clear All Accounting Data</Label>
                <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">
                  This will permanently delete all journal entries and opening balances. 
                  Your knowledge base and settings will be preserved. This action cannot be undone.
                </p>
                {dataCounts && (
                  <div className="text-[10px] font-mono text-muted-foreground mt-2">
                    <p>• Journal Entries: {dataCounts.journalEntries}</p>
                    <p>• Opening Balances: {dataCounts.openingBalances}</p>
                    <p className="text-green-600 mt-1">✓ Knowledge Base: {dataCounts.knowledgeEntries} (will be kept)</p>
                  </div>
                )}
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowClearConfirm(true)}
                className="w-full font-mono text-xs"
                disabled={!dataCounts || (dataCounts.journalEntries === 0 && dataCounts.openingBalances === 0)}
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Clear All Accounting Data
              </Button>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-mono text-xs"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="font-mono text-xs">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono">Clear All Accounting Data?</AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-xs space-y-2">
              <p>This will permanently delete:</p>
              <ul className="list-disc list-inside space-y-1 my-2">
                <li>{dataCounts?.journalEntries || 0} journal entries</li>
                <li>{dataCounts?.openingBalances || 0} opening balances</li>
                <li>All calculated reports (Balance Sheet, P&L, etc.)</li>
              </ul>
              <p className="text-green-600">Your knowledge base ({dataCounts?.knowledgeEntries || 0} entries) will be preserved.</p>
              <p className="font-semibold mt-3 text-destructive">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearData}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-mono text-xs"
            >
              Yes, Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};
