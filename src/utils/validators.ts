export const isValidColor = (color: string | null | undefined): boolean =>
  color ? CSS.supports('color', color) : false;
