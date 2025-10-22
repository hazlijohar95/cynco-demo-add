import { ScrollArea } from "@/components/ui/scroll-area";

interface TrialBalanceProps {
  data: { account: string; debit: number; credit: number }[];
}

export const TrialBalance = ({ data }: TrialBalanceProps) => {
  const totalDebit = data.reduce((sum, item) => sum + item.debit, 0);
  const totalCredit = data.reduce((sum, item) => sum + item.credit, 0);

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <table className="w-full border-collapse">
          <thead className="bg-gridHeader sticky top-0">
            <tr>
              <th className="border border-gridBorder p-3 text-left text-sm font-semibold">Account</th>
              <th className="border border-gridBorder p-3 text-right text-sm font-semibold">Debit</th>
              <th className="border border-gridBorder p-3 text-right text-sm font-semibold">Credit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.account} className="hover:bg-gridHover transition-colors">
                <td className="border border-gridBorder p-3 text-sm">{item.account}</td>
                <td className="border border-gridBorder p-3 text-right text-sm text-debit">
                  {item.debit > 0 ? item.debit.toFixed(2) : ""}
                </td>
                <td className="border border-gridBorder p-3 text-right text-sm text-credit">
                  {item.credit > 0 ? item.credit.toFixed(2) : ""}
                </td>
              </tr>
            ))}
            <tr className="bg-gridHeader font-semibold">
              <td className="border border-gridBorder p-3 text-right">Total:</td>
              <td className="border border-gridBorder p-3 text-right text-debit">
                {totalDebit.toFixed(2)}
              </td>
              <td className="border border-gridBorder p-3 text-right text-credit">
                {totalCredit.toFixed(2)}
              </td>
            </tr>
            <tr className={totalDebit === totalCredit ? "bg-accent/10" : "bg-destructive/10"}>
              <td className="border border-gridBorder p-3 text-right font-semibold">Difference:</td>
              <td colSpan={2} className="border border-gridBorder p-3 text-center font-semibold">
                {totalDebit === totalCredit ? (
                  <span className="text-credit">Balanced ✓</span>
                ) : (
                  <span className="text-destructive">
                    {Math.abs(totalDebit - totalCredit).toFixed(2)}
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
};
