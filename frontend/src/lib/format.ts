export function formatPrice(amount: number, currency = 'XOF'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatWeight(kg: number): string {
  if (kg < 1) {
    return `${Math.round(kg * 1000)} g`;
  }
  return `${kg} kg`;
}

export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
