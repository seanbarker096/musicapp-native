export function isArray(arg: any): arg is readonly any[] {
  return Array.isArray(arg);
}


export function toNumber(value: string | number): number;
export function toNumber(
  value: string | number | null | undefined,
): number | undefined;
export function toNumber(
  value: string | number | null | undefined,
): number | undefined {
  return typeof value === 'number' || value ? Number(value) : undefined;
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}