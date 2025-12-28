// src/app/api.ts
export const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export type ApiError = {
  message?: string;
  detail?: string;
};

export type LoginResponse = {
  email: string;
  username: string;
  _id: number | string;
};

export type SignupResponse = {
  message: string;
  result: {
    username: string;
    email: string;
    _id: number | string;
  };
  success: boolean;
};

export type TokenResponse = {
  access: string;
  refresh: string;
};

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as ApiError;
    return data.message || data.detail || "Ошибка запроса";
  } catch {
    return "Ошибка запроса";
  }
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/user/login/`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return (await res.json()) as LoginResponse;
}

export async function apiSignup(email: string, password: string, username: string): Promise<SignupResponse> {
  const res = await fetch(`${API_URL}/user/signup/`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return (await res.json()) as SignupResponse;
}

export async function apiGetTokens(email: string, password: string): Promise<TokenResponse> {
  const res = await fetch(`${API_URL}/user/token/`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return (await res.json()) as TokenResponse;
}

export function saveTokens(tokens: TokenResponse) {
  localStorage.setItem("access", tokens.access);
  localStorage.setItem("refresh", tokens.refresh);
}
