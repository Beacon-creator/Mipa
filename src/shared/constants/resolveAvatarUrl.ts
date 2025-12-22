// src/shared/utils/resolveAvatarUrl.ts
import { API_BASE } from "./api";

export function resolveAvatarUrl(url?: string) {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}
