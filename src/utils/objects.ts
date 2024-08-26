export const createArrayXLength = (length: number): number[] => {
  if (length < 0) {
    return [];
  }

  // packed SMI
  return Array.from({ length }, (_, i) => i);
};
