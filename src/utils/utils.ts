export function isArray(arg: any): arg is readonly any[] {
  return Array.isArray(arg);
}
