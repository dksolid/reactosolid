export function generateId({ excludedIds }: { excludedIds: Array<string> }): string {
  const id = String(Math.random()).replace('.', '');
  const idIsAlreadyUsed = excludedIds.includes(id);

  return idIsAlreadyUsed ? generateId({ excludedIds }) : id;
}
