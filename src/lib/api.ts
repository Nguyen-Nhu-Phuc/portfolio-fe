import { PortfolioData, ContactFormData, ContactSubmission } from "@/types/portfolio";
import { PortfolioAdminData } from "@/types/localized";
import { Locale } from "@/types/localized";
import { apiBase } from "./apiBase";

export async function fetchPortfolioServer(
  locale: Locale
): Promise<PortfolioData | null> {
  try {
    const res = await fetch(`${apiBase()}/api/portfolio?lang=${locale}`, {
      ...(process.env.NODE_ENV === "development"
        ? { cache: "no-store" as const }
        : { next: { revalidate: 60 } }),
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
}

export async function fetchPortfolio(locale: Locale): Promise<PortfolioData> {
  const res = await fetch(`${apiBase()}/api/portfolio?lang=${locale}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch portfolio data");
  }

  return res.json();
}

export async function fetchPortfolioSafe(
  locale: Locale
): Promise<PortfolioData | null> {
  try {
    return await fetchPortfolio(locale);
  } catch {
    return null;
  }
}

export async function submitContact(data: ContactFormData): Promise<void> {
  const res = await fetch(`${apiBase()}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    const message =
      error.message ||
      (Array.isArray(error.errors) ? error.errors[0]?.msg : undefined) ||
      "Failed to send message";
    throw new Error(message);
  }
}

export async function adminLogin(
  username: string,
  password: string
): Promise<string> {
  const res = await fetch(`${apiBase()}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Login failed");
  }

  const data = await res.json();
  return data.token as string;
}

export async function fetchAdminPortfolio(
  token: string
): Promise<PortfolioAdminData> {
  const res = await fetch(`${apiBase()}/api/admin/portfolio`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch admin portfolio");
  }

  return res.json();
}

export async function saveAdminPortfolio(
  token: string,
  data: PortfolioAdminData
): Promise<PortfolioAdminData> {
  const res = await fetch(`${apiBase()}/api/admin/portfolio`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to save portfolio");
  }

  return res.json();
}

export async function uploadAdminImage(
  token: string,
  file: File
): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${apiBase()}/api/admin/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to upload image");
  }

  const data = await res.json();
  return data.url as string;
}

export async function changeAdminPassword(
  token: string,
  payload: { username: string; currentPassword: string; newPassword: string }
): Promise<void> {
  const res = await fetch(`${apiBase()}/api/admin/change-password`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to change password");
  }
}

export async function fetchAdminContacts(
  token: string
): Promise<ContactSubmission[]> {
  const res = await fetch(`${apiBase()}/api/admin/contacts`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch contacts");
  }

  return res.json();
}

export async function markContactRead(
  token: string,
  id: string
): Promise<ContactSubmission> {
  const res = await fetch(`${apiBase()}/api/admin/contacts/${id}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to update contact");
  }

  return res.json();
}

export async function deleteContact(token: string, id: string): Promise<void> {
  const res = await fetch(`${apiBase()}/api/admin/contacts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to delete contact");
  }
}
