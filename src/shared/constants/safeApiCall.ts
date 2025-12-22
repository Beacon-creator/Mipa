// src/shared/utils/safeApiCall.ts

export async function safeApiCall<T>(
  fn: () => Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const res = await fn();
    return [res, null]; // ✅ DATA FIRST
  } catch (error: any) {
    return [null, error];
  }
}
 