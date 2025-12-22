
export function isValidObjectId(id?: string): boolean {
  // MongoDB ObjectId is 24 hex chars
  return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
}
