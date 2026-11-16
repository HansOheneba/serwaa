const ghs = new Intl.NumberFormat("en-GH", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const ghs2 = new Intl.NumberFormat("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Format an amount in Ghana cedis. Pass `exact` to always show pesewas. */
export function cedis(amount: number, exact = false) {
  return `GH₵\u00a0${(exact ? ghs2 : ghs).format(amount)}`;
}

export function percent(value: number, total: number) {
  return total === 0 ? 0 : Math.round((value / total) * 100);
}
