import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const API_BASE = "https://mipa-api.onrender.com/api";
export { API_BASE };

async function getAuthHeaders() {
  const token = await AsyncStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res: Response) {
  const text = await res.text();
  let data: any = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      const err: any = new Error(`Invalid JSON response from server (HTTP ${res.status})`);
      err.status = res.status;
      err.raw = text;
      throw err;
    }
  }

  if (!res.ok) {
 
    if (res.status === 401) {
      try { await AsyncStorage.removeItem("authToken"); } catch {}
    }

    const message = (data && (data.message || data.error)) || res.statusText || `HTTP ${res.status}`;
    const err: any = new Error(message);
    err.status = res.status;
    err.data = data ?? text;
    throw err;
  }

  return data;
}

// User API
export async function getMe() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/users/me`, { headers });
  return handleResponse(res);
}

export async function updateProfile(payload: {
  name?: string;
  location?: string;
  phone?: string;
  avatarUrl?: string;
}) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/users/me/profile`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/users/me/password`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse(res);
}

export async function contactUs(subject: string, message: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/users/contact`, {
    method: "POST",
    headers,
    body: JSON.stringify({ subject, message }),
  });
  return handleResponse(res);
}

// Orders API
export async function createOrder(payload: {
  restaurantId: string;
  items: { menuItemId: string; quantity: number }[];
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    fullName?: string;
    phone?: string;
  };
  paymentMethod?: "card" | "cash" | "wallet";
  notes?: string;
}) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function markOrderPaid(
  orderId: string,
  opts?: { paymentStatus?: "paid" | "failed"; paymentMethod?: "card" | "cash" | "wallet" }
) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/orders/${orderId}/pay`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(opts ?? { paymentStatus: "paid" }),
  });
  return handleResponse(res);
}

export async function listMyOrders() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/orders`, { method: "GET", headers });
  return handleResponse(res);
}

export async function getOrderById(orderId: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/orders/${orderId}`, { method: "GET", headers });
  return handleResponse(res);
}

// Reviews
export async function createReview(restaurantId: string, rating: number, comment?: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/restaurants/${restaurantId}/reviews`, {
    method: "POST",
    headers,
    body: JSON.stringify({ rating, comment }),
  });
  return handleResponse(res);
}

// Fetch restaurants 
export async function getRestaurants(opts?: {
  search?: string;
  location?: string;
  category?: string;
  minRating?: number;
  maxDistanceKm?: number;
  page?: number;
  limit?: number;
}) {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams();
  if (opts?.search) params.append("search", opts.search);
  if (opts?.location) params.append("location", opts.location);
  if (opts?.category) params.append("category", opts.category);
  if (opts?.minRating != null) params.append("minRating", String(opts.minRating));
  if (opts?.maxDistanceKm != null) params.append("maxDistanceKm", String(opts.maxDistanceKm));
  if (opts?.page != null) params.append("page", String(opts.page));
  if (opts?.limit != null) params.append("limit", String(opts.limit));

  const url = `${API_BASE}/restaurants${params.toString() ? `?${params.toString()}` : ""}`;
  const res = await fetch(url, { method: "GET", headers });
  const data = await handleResponse(res);
  return data?.items ?? data;
}

// Fetch menu items
export async function getMenuItems(restaurantId?: string, opts?: {
  search?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}) {
  const headers = await getAuthHeaders();
  const params = new URLSearchParams();
  if (restaurantId) params.append("restaurantId", restaurantId);
  if (opts?.search) params.append("search", opts.search);
  if (opts?.type) params.append("type", opts.type);
  if (opts?.minPrice != null) params.append("minPrice", String(opts.minPrice));
  if (opts?.maxPrice != null) params.append("maxPrice", String(opts.maxPrice));
  if (opts?.page != null) params.append("page", String(opts.page));
  if (opts?.limit != null) params.append("limit", String(opts.limit));

  const url = `${API_BASE}/menu${params.toString() ? `?${params.toString()}` : ""}`;
  const res = await fetch(url, { method: "GET", headers });
  const data = await handleResponse(res);
  // backend returns { items, page, limit, total } — return items for convenience
  return data?.items ?? data;
}

export const OrderService = {
  async quickOrder(payload: any) {
    const res = await axios.post(`${API_BASE}/orders`, payload);
    return res.data;
  },

  async getById(orderId: string) {
    const res = await axios.get(`${API_BASE}/orders/${orderId}`);
    return res.data;
  },

  async listMine() {
    const res = await axios.get(`${API_BASE}/orders`);
    return res.data;
  },

  async markPaid(orderId: string, body: { paymentStatus?: string; paymentMethod?: string }) {
    const res = await axios.patch(`${API_BASE}/orders/${orderId}/pay`, body);
    return res.data;
  },

  async payOrder(orderId: string) {
    const res = await axios.post(`${API_BASE}/orders/${orderId}/pay`);
    return res.data;
  }
};

export const payOrder = async (orderId: string) => {
  const res = await axios.post(`${API_BASE}/orders/${orderId}/pay`);
  return res.data;
}

export async function uploadAvatar(formData: FormData) {
  const token = await AsyncStorage.getItem("authToken");

  const res = await fetch(`${API_BASE}/users/me/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message ?? "Upload failed");
  }

  return data as { avatarUrl: string };
}

export function resolveAvatarUrl(url?: string) {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}


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
 

export function isValidObjectId(id?: string): boolean {
  // MongoDB ObjectId is 24 hex chars
  return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
}
