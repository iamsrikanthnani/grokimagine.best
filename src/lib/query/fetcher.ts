export type Json =
  | Record<string, unknown>
  | Array<unknown>
  | string
  | number
  | boolean
  | null;

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data && typeof data === "object") {
      const obj = data as Record<string, unknown>;
      if (typeof obj.error === "string") return obj.error;
      if (typeof obj.message === "string") return obj.message;
    }
    if (typeof data === "string" && data) return data;
  } catch {
    try {
      const text = await res.text();
      if (text) return text;
    } catch {}
  }
  return res.statusText || "Request failed";
}

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: "GET", credentials: "same-origin" });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function apiPostJson<T>(url: string, body: Json): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "same-origin",
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function apiPostForm<T>(url: string, form: FormData): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    body: form,
    credentials: "same-origin",
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
