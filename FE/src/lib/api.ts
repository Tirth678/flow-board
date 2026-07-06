"use client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:5001/api";

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export type User = {
  id: string;
  role: "user" | "admin";
};

export type Organization = {
  _id?: string;
  id?: string;
  orgName: string;
  description: string;
  createdBy?: string;
};

export type OrgMember = {
  _id: string;
  orgId: string;
  userId:
    | string
    | {
        _id: string;
        username: string;
        email: string;
      };
  username?: string;
  role: "user" | "admin";
};

export type Board = {
  _id: string;
  name: string;
  description?: string;
  orgId: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CardStatus = "up_next" | "in_progress" | "done";

export type FlowCard = {
  _id: string;
  title: string;
  description?: string;
  status: CardStatus;
  boardId: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
};

function getStoredToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("flowboard_access_token");
}

function setStoredToken(token?: string) {
  if (typeof window === "undefined" || !token) return;
  window.localStorage.setItem("flowboard_access_token", token);
}

function clearStoredToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("flowboard_access_token");
  window.localStorage.removeItem("flowboard_user");
}

async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth !== false) {
    const token = getStoredToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message =
      data?.message || data?.errors?.[0]?.msg || "Something went wrong";
    throw new Error(message);
  }

  if (data?.accessToken) setStoredToken(data.accessToken);
  return data as T;
}

export const flowApi = {
  get token() {
    return getStoredToken();
  },
  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem("flowboard_user");
    return raw ? JSON.parse(raw) : null;
  },
  async login(payload: { email?: string; username?: string; password: string }) {
    const data = await apiFetch<{ user: User; accessToken?: string; message: string }>(
      "/auth/login",
      {
        method: "POST",
        auth: false,
        body: JSON.stringify(payload),
      },
    );

    if (!data.accessToken) {
      try {
        const refreshed = await apiFetch<{ accessToken: string }>(
          "/auth/refresh-token",
          {
            method: "POST",
            auth: false,
          },
        );
        data.accessToken = refreshed.accessToken;
      } catch {
        // The current backend login response may omit accessToken; surface a helpful auth state.
      }
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("flowboard_user", JSON.stringify(data.user));
    }

    return data;
  },
  async register(payload: { username: string; email: string; password: string }) {
    const data = await apiFetch<{ user: User; accessToken: string; message: string }>(
      "/auth/register",
      {
        method: "POST",
        auth: false,
        body: JSON.stringify(payload),
      },
    );

    if (typeof window !== "undefined") {
      window.localStorage.setItem("flowboard_user", JSON.stringify(data.user));
    }

    return data;
  },
  async logout() {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } finally {
      clearStoredToken();
    }
  },
  listOrganizations() {
    return apiFetch<{ orgs: Organization[]; message: string }>("/org/");
  },
  createOrganization(payload: { orgName: string; description: string }) {
    return apiFetch<{ org: Organization; message: string }>("/org/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getOrganization(orgId: string) {
    return apiFetch<{ org: Organization; message: string }>(`/org/${orgId}`);
  },
  listMembers(orgId: string) {
    return apiFetch<{ members: OrgMember[]; message: string }>(
      `/org/${orgId}/members`,
    );
  },
  inviteMember(orgId: string, username: string) {
    return apiFetch<{ member: OrgMember; message: string }>(`/org/${orgId}/invite`, {
      method: "POST",
      body: JSON.stringify({ username }),
    });
  },
  removeMember(orgId: string, userId: string) {
    return apiFetch<{ message: string }>(`/org/${orgId}/${userId}`, {
      method: "DELETE",
    });
  },
  listBoards(orgId: string) {
    return apiFetch<{ boards: Board[]; message: string }>(`/board/${orgId}/list`);
  },
  createBoard(orgId: string, payload: { name: string; description?: string }) {
    return apiFetch<{ board: Board; message: string }>(`/board/${orgId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  deleteBoard(boardId: string) {
    return apiFetch<{ message: string }>(`/board/${boardId}`, {
      method: "DELETE",
    });
  },
  listCards(boardId: string) {
    return apiFetch<{ cards: FlowCard[]; message: string }>(
      `/card/${boardId}/list`,
    );
  },
  createCard(boardId: string, payload: { title: string; description?: string }) {
    return apiFetch<{ card: FlowCard; message: string }>(`/card/${boardId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateCardStatus(cardId: string, status: CardStatus) {
    return apiFetch<{ card: FlowCard; message: string }>(`/card/${cardId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  deleteCard(cardId: string) {
    return apiFetch<{ message: string }>(`/card/${cardId}`, {
      method: "DELETE",
    });
  },
};

export function getOrgId(org: Organization) {
  return org._id || org.id || "";
}
