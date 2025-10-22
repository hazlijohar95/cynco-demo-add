
interface TrialBalanceProps {
  data: { account: string; debit: number; credit: number }[];
}

export const TrialBalance = ({ data }: TrialBalanceProps) => {
  const totalDebit = data.reduce((sum, item) => sum + item.debit, 0);
  const totalCredit = data.reduce((sum, item) => sum + item.credit, 0);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
          <div className="border-b border-border pb-4 mb-6">
            <h2 className="text-2xl font-mono font-bold tracking-tight">Trial Balance</h2>
            <p className="text-sm text-muted-foreground mt-1 font-mono">
              Verification of double-entry bookkeeping
            </p>
          </div>
          
          <table className="w-full border-collapse">
            <thead className="border-b border-border">
              <tr>
                <th className="p-3 text-left text-[10px] font-mono font-semibold uppercase tracking-wider">Account</th>
                <th className="p-3 text-right text-[10px] font-mono font-semibold uppercase tracking-wider">Debit</th>
                <th className="p-3 text-right text-[10px] font-mono font-semibold uppercase tracking-wider">Credit</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.account} className="border-b border-border hover:bg-gridHover transition-colors">
                  <td className="p-3 font-mono text-sm">{item.account}</td>
                  <td className="p-3 text-right font-mono text-sm tabular-nums">
                    {item.debit > 0 ? item.debit.toFixed(2) : "—"}
                  </td>
                  <td className="p-3 text-right font-mono text-sm tabular-nums">
                    {item.credit > 0 ? item.credit.toFixed(2) : "—"}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-foreground">
                <td className="p-3 text-right font-mono text-sm font-semibold">Total:</td>
                <td className="p-3 text-right font-mono text-sm font-semibold tabular-nums">
                  {totalDebit.toFixed(2)}
                </td>
                <td className="p-3 text-right font-mono text-sm font-semibold tabular-nums">
                  {totalCredit.toFixed(2)}
                </td>
              </tr>
              <tr className={`border-t border-border ${totalDebit === totalCredit ? "" : "bg-muted"}`}>
                <td className="p-4 text-right font-mono text-sm font-semibold">Status:</td>
                <td colSpan={2} className="p-4 text-center font-mono text-sm font-semibold">
                  {totalDebit === totalCredit ? (
                    <span>Balanced ✓</span>
                  ) : (
                    <span>Difference: {Math.abs(totalDebit - totalCredit).toFixed(2)}</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };
