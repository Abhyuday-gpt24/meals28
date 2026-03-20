/** Converts a Prisma Decimal to a plain number for client components */
export function decimalToNumber(value: { toNumber(): number }): number {
  return value.toNumber();
}
