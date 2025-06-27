
export function formatCurrency(amount: number, symbol: string = '$'): string {
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);
  const formattedAmount = absoluteAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${isNegative ? '-' : ''}${symbol}${formattedAmount}`;
}
