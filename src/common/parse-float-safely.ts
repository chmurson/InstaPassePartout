export function parseFloatSafely(maybeNumber: string) {
  const result = parseFloat(maybeNumber);
  if (!Number.isNaN(result)) {
    return result;
  }
  return 0;
}
