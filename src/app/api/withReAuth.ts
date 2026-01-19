import { refreshToken } from "@/app/api/authApi";

type AnyJson = any;

type RequestInitEx = RequestInit & {
  headers?: Record<string, string>;
};

function getAccess() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("skypro_access") || "";
}

function getRefresh() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("skypro_refresh") || "";
}

function setAccess(access: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("skypro_access", access);
}

async function readErrorMessage(res: Response) {
  try {
    const json = await res.json();
    return (
      json?.message ||
      json?.detail ||
      json?.error ||
      "Ошибка запроса к серверу"
    );
  } catch {
    return "Ошибка запроса к серверу";
  }
}

async function doFetch<T>(url: string, init: RequestInitEx): Promise<T> {
  const res = await fetch(url, init);

  if (res.status === 204) return undefined as unknown as T;

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const msg = await readErrorMessage(res);
    const err: any = new Error(msg);
    err.status = res.status;
    throw err;
  }

  if (isJson) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}


export async function withReAuth<T = AnyJson>(
  url: string,
  init: RequestInitEx = {}
): Promise<T> {
  const access = getAccess();

  const headers: Record<string, string> = {
    ...(init.headers || {}),
  };

  if (!headers["content-type"] && init.body) {
    headers["content-type"] = "application/json";
  }

  if (access) {
    headers.Authorization = `Bearer ${access}`;
  }

  try {
    return await doFetch<T>(url, { ...init, headers });
  } catch (err: any) {
    if (err?.status !== 401) throw err;

    const refresh = getRefresh();
    if (!refresh) throw err;

    
    const tokens = await refreshToken(refresh);
    if (!tokens?.access) throw err;

    setAccess(tokens.access);

   
    const retryHeaders: Record<string, string> = {
      ...(headers || {}),
      Authorization: `Bearer ${tokens.access}`,
    };

    return await doFetch<T>(url, { ...init, headers: retryHeaders });
  }
}
