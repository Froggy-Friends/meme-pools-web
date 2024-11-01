export function formatBalance(num: number, eth?: boolean): string {
    if (eth && num !== 0) {
        return `${(num).toFixed(4)}`;
    }
    if (num < 1000) return Math.round(num).toString();
    if (num < 1000000) {
      const formatted = num / 1000;
      return `${formatted.toFixed(2)}K`;
    }
    
    const formatted = num / 1000000;
    return `${formatted.toFixed(2)}M`;
  }