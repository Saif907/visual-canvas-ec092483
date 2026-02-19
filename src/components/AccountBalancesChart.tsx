export default function AccountBalancesChart() {
  return (
    <div className="bg-card rounded-lg p-6 card-boundary">
      <h3 className="text-base font-semibold text-foreground mb-1">Account Balances</h3>
      <p className="text-sm text-text-secondary mb-6">Total Balance by Account Number</p>

      <div className="h-48 flex items-center justify-center border border-dashed border-divider rounded-lg">
        <p className="text-sm text-text-secondary">No account data available</p>
      </div>
    </div>
  );
}
