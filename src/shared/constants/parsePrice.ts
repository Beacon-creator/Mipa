export function parsePrice(p: string | number): number {
  if (typeof p === "number") return p;
  const cleaned = String(p ?? "").replace(/[^0-9.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}
