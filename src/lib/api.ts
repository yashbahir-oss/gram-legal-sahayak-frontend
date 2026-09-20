const API = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/$/, "");
//authApi
let refreshPromise: Promise<string | null> | null = null;

async function refreshSession(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("gls_token");
          localStorage.removeItem("gls_user");
          window.dispatchEvent(new Event("gls-auth-expired"));
        }
        return null;
      }
      const data = await response.json();
      if (!data?.token) return null;
      localStorage.setItem("gls_token", data.token);
      if (data.user) localStorage.setItem("gls_user", JSON.stringify(data.user));
      window.dispatchEvent(new CustomEvent("gls-auth-refreshed", { detail: data }));
      return data.token as string;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const makeRequest = async (tokenOverride?: string) => {
    const headers = new Headers(options.headers);
    if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
    const token = tokenOverride || localStorage.getItem("gls_token");
    if (token && !headers.has("Authorization") && !path.startsWith("/auth/")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return fetch(`${API}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  let response = await makeRequest();
  let data = await response.json().catch(() => ({}));

  if (response.status === 401 && !path.startsWith("/auth/refresh") && !path.startsWith("/auth/login")) {
    const newToken = await refreshSession();
    if (newToken) {
      response = await makeRequest(newToken);
      data = await response.json().catch(() => ({}));
    }
  }

  if (!response.ok) throw new Error(data.message || "Request failed");
  return data as T;
}

export type User = {
  id: string; name: string; email?: string; mobile?: string;
  age?: number | null; gender?: string; role: "user" | "admin"; status?: "active" | "inactive" | "blocked"; profileImage?: string;
};
export type AuthResponse = { token: string; user: User; devOtp?: string; message?: string };

export const authApi = {
  login: (identifier: string, password: string) => request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ identifier, password }) }),
  requestContactOtp: () =>
  request<{ message: string; devOtp?: string }>("/auth/me/contact-otp", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("gls_token") || ""}`,
    },
  }),
  changePassword: (
  currentPassword: string,
  newPassword: string
) =>
  request<{ message: string }>("/auth/password/change", {
    method: "POST",
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  }),
  requestLoginOtp: (identifier: string) => request<{ message: string; devOtp?: string }>("/auth/otp/request", { method: "POST", body: JSON.stringify({ identifier }) }),
  verifyLoginOtp: (identifier: string, code: string) => request<AuthResponse>("/auth/otp/verify", { method: "POST", body: JSON.stringify({ identifier, code }) }),
  requestPasswordReset: (identifier: string) => request<{ message: string; devOtp?: string }>("/auth/password/forgot", { method: "POST", body: JSON.stringify({ identifier }) }),
  resetPassword: (identifier: string, code: string, password: string) => request<{ message: string }>("/auth/password/reset", { method: "POST", body: JSON.stringify({ identifier, code, password }) }),
  requestSignupOtp: (form: FormData) => request<{ message: string; devOtp?: string }>("/auth/register/request-otp", { method: "POST", body: form }),
  verifySignupOtp: (identifier: string, code: string) => request<AuthResponse>("/auth/register/verify-otp", { method: "POST", body: JSON.stringify({ identifier, code }) }),
  me: (token?: string) => request<{ user: User }>("/auth/me", token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  update: (token: string, payload: { name?: string; email?: string; mobile?: string; otp?: string }) =>
    request<{ user: User }>("/auth/me", { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }),
  logout: () => request<{ ok: boolean }>("/auth/logout", { method: "POST" }),
};

export const complaintApi = {
  list: (token: string) => request<{ complaints: any[] }>("/complaints", { headers: { Authorization: `Bearer ${token}` } }),
  create: (token: string, payload: any) => request<{ complaint: any }>("/complaints", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }),
  track: (id: string) => request<{ complaint: any }>(`/complaints/track/${encodeURIComponent(id)}`),
  adminAll: (token: string) => request<{ complaints: any[] }>("/complaints/admin/all", { headers: { Authorization: `Bearer ${token}` } }),
  adminUpdate: (token: string, id: string, payload: { status: string; notes?: string }) =>
    request<{ complaint: any }>(`/complaints/admin/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) }),
};

export const contentApi = {
  documents: (query?: string) => {
    const q = query?.trim();
    return request<{ documents: any[] }>(`/content/documents${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  },
   officeLocations: (district?: string) => {
    const qs = district
      ? `?district=${encodeURIComponent(district)}`
      : "";

    return request<{
      districts: string[];
      subDistricts: string[];
    }>(`/content/offices/locations${qs}`);
  },

  offices: (query?: string) => {
    const q = query?.trim();

    const qs = q
      ? `?q=${encodeURIComponent(q)}`
      : "";

    return request<{
      offices: any[];
      source?: string;
      fallback?: string;
    }>(`/content/offices${qs}`);
  },
};

export const aiApi = {
  ask: (token: string, message: string) => request<{ answer: string }>("/ai", {
    method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ message })
  }),
};

export const fileUrl = (path?: string) => path ? (path.startsWith("http") ? path : `${API.replace(/\/api$/, "")}${path}`) : "";
export { API };

export async function uploadProfileImage(token: string, file: File) {
  const fd = new FormData(); fd.append("image", file);
  return request<{ user: User }>("/profile/image", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
}


export type AdminStats = {
  totalUsers: number;
  totalComplaints: number;
  totalDocuments: number;
  totalOffices: number;
  notificationCount: number;
  complaintsByStatus: { pending: number; processing: number; resolved: number; rejected: number };
  recentComplaints: any[];
};

export const adminApi = {
  stats: () => request<AdminStats>("/admin/dashboard/stats"),
  clearNotifications: () =>
  request<{ ok: boolean; clearedAt: string }>("/admin/notifications/clear", {
    method: "POST",
  }),
  complaintsTrend: (days = 14) => request<{ trend: { date: string; count: number }[] }>(`/admin/dashboard/complaints-trend?days=${days}`),
  complaintsStatus: () => request<{ statuses: { status: string; count: number }[] }>("/admin/dashboard/complaints-status"),
  usersTrend: (days = 14) => request<{ trend: { date: string; count: number }[] }>(`/admin/dashboard/users-trend?days=${days}`),
  users: (params: { q?: string; status?: string; role?: string; page?: number; limit?: number } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k,v]) => { if (v !== undefined && v !== "") q.set(k, String(v)); });
    return request<{ users: User[]; total: number; page: number; limit: number; pages: number }>(`/admin/users${q.toString() ? `?${q}` : ""}`);
  },
  userStatus: (id: string, status: string) => request<{ user: User }>(`/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteUser: (id: string) => request<{ ok: boolean }>(`/admin/users/${id}`, { method: "DELETE" }),
  documents: (params: { q?: string; category?: string; language?: string; status?: string; fileType?: string; page?: number; limit?: number } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k,v]) => { if (v !== undefined && v !== "") q.set(k, String(v)); });
    return request<{ documents: any[]; total: number; page: number; limit: number; pages: number }>(`/admin/documents${q.toString() ? `?${q}` : ""}`);
  },
  document: (id: string) => request<{ document: any }>(`/admin/documents/${id}`),
  createDocument: (fd: FormData) => request<{ document: any }>("/admin/documents", { method: "POST", body: fd }),
  updateDocument: (id: string, fd: FormData) => request<{ document: any }>(`/admin/documents/${id}`, { method: "PATCH", body: fd }),
  deleteDocument: (id: string) => request<{ ok: boolean }>(`/admin/documents/${id}`, { method: "DELETE" }),
  complaints: (params: { q?: string; status?: string } = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k,v]) => { if (v) q.set(k, v); });
    return request<{ complaints: any[] }>(`/admin/complaints${q.toString() ? `?${q}` : ""}`);
  },
  updateComplaint: (id: string, payload: { status: string; notes?: string }) => request<{ complaint: any }>(`/admin/complaints/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  offices: () => request<{ offices: any[] }>("/admin/offices"),
  createOffice: (payload: any) => request<{ office: any }>("/admin/offices", { method: "POST", body: JSON.stringify(payload) }),
  updateOffice: (id: string, payload: any) => request<{ office: any }>(`/admin/offices/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteOffice: (id: string) => request<{ ok: boolean }>(`/admin/offices/${id}`, { method: "DELETE" }),
};




