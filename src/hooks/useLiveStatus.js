export function useLiveStatus(etaMinutes) {
  const coverage = Math.min(85, Math.max(55, 100 - etaMinutes))

  return {
    coverage,
    label: 'Copertura attiva nella tua zona',
    distanceLabel: `Arrivo stimato: da ${etaMinutes} minuti`,
  }
}
