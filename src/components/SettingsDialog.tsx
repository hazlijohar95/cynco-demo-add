import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [settings, setSettings] = useState({
    companyName: "Cynco Accounting",
    fiscalYearEnd: "12-31",
    autoSave: true,
    showBalanceWarnings: true,
    decimalPlaces: 2,
    currency: "USD",
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
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
    </Dialog>
  );
};
