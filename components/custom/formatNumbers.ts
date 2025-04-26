export function formatPrice(value: number): string {
    if (value === 0) return "0";
    if (value >= 1) return value.toFixed(2);
    if (value < 0.000001) return value.toExponential(2);
    return parseFloat(value.toPrecision(3)).toString();
  }