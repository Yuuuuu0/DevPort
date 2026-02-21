export function getLocalizedField(
  item: object,
  field: string,
  locale: 'zh' | 'en'
): string {
  const obj = item as Record<string, unknown>
  const zhKey = `${field}Zh`
  const enKey = `${field}En`
  if (locale === 'en') {
    return ((obj[enKey] as string) || (obj[zhKey] as string) || '')
  }
  return ((obj[zhKey] as string) || (obj[enKey] as string) || '')
}
