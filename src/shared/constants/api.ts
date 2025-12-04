import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://192.168.0.135:4000/api";

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
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const message = (data && data.message) || res.statusText || "Request failed";
    const err: any = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

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
  const res = await fetch(`${API_BASE}/orders`, {
    method: "GET",
    headers,
  });
  return handleResponse(res);
}

export async function getOrderById(orderId: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: "GET",
    headers,
  });
  return handleResponse(res);
}

export async function createReview(restaurantId: string, rating: number, comment?: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}/restaurants/${restaurantId}/reviews`, {
    method: "POST",
    headers,
    body: JSON.stringify({ rating, comment }),
  });
  return handleResponse(res);
}
