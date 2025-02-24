export function formatToMexicoCity(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}
