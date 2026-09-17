const API = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/$/, "");

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const response = await fetch(`${API}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data as T;
}

export type User = { id: string; name: string; email?: string; mobile?: string; role: "user" | "admin"; profileImage?: string };
export type AuthResponse = { token: string; user: User; devOtp?: string; message?: string };

export const authApi = {
  login: (identifier: string, password: string) => request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ identifier, password }) }),
  requestLoginOtp: (identifier: string) => request<{ message: string; devOtp?: string }>("/auth/otp/request", { method: "POST", body: JSON.stringify({ identifier }) }),
  verifyLoginOtp: (identifier: string, code: string) => request<AuthResponse>("/auth/otp/verify", { method: "POST", body: JSON.stringify({ identifier, code }) }),
  requestPasswordReset: (identifier: string) => request<{ message: string; devOtp?: string }>("/auth/password/forgot", { method: "POST", body: JSON.stringify({ identifier }) }),
  resetPassword: (identifier: string, code: string, password: string) => request<{ message: string }>("/auth/password/reset", { method: "POST", body: JSON.stringify({ identifier, code, password }) }),
  requestSignupOtp: (form: FormData) => request<{ message: string; devOtp?: string }>("/auth/register/request-otp", { method: "POST", body: form }),
  verifySignupOtp: (identifier: string, code: string) => request<AuthResponse>("/auth/register/verify-otp", { method: "POST", body: JSON.stringify({ identifier, code }) }),
  me: (token: string) => request<{ user: User }>("/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
  update: (token: string, payload: { name?: string; email?: string; mobile?: string }) => request<{ user: User }>("/auth/me", { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }),
};

export const complaintApi = {
  list: (token: string) => request<{ complaints: any[] }>("/complaints", { headers: { Authorization: `Bearer ${token}` } }),
  create: (token: string, payload: any) => request<{ complaint: any }>("/complaints", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }),
  track: (id: string) => request<{ complaint: any }>(`/complaints/track/${encodeURIComponent(id)}`),
  adminAll: (token: string) => request<{ complaints: any[] }>("/complaints/admin/all", { headers: { Authorization: `Bearer ${token}` } }),
};

export const contentApi = {
  documents: () => request<{ documents: any[] }>("/content/documents"),
  offices: (district?: string, taluka?: string) => {
    const params = new URLSearchParams(); if (district) params.set("district", district); if (taluka) params.set("taluka", taluka);
    return request<{ offices: any[] }>(`/content/offices?${params.toString()}`);
  },
};

export const aiApi = {
  ask: (token: string, message: string) => request<{ answer: string }>("/ai", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ message }) }),
};

export const fileUrl = (path?: string) => path ? (path.startsWith("http") ? path : `${API.replace(/\/api$/, "")}${path}`) : "";
export { API };

export async function uploadProfileImage(token: string, file: File) {
  const fd = new FormData(); fd.append("image", file);
  return request<{ user: User }>("/profile/image", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
}
