
const API_URL = "https://webdev-music-003b5b991590.herokuapp.com";

export type AuthUser = {
  _id: number;
  email: string;
  username: string;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

type SignupResponse = {
  message: string;
  result: AuthUser;
  success: boolean;
};

type ErrorResponse = {
  message?: string;
  detail?: string;
  code?: string;
  [key: string]: unknown;
};

async function handleJsonResponse<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T | ErrorResponse;

  if (!res.ok) {
    const errData = data as ErrorResponse;
    const msg =
      errData.message ||
      errData.detail ||
      "Произошла ошибка при запросе к серверу";
    throw new Error(msg);
  }

  return data as T;
}


export async function signup(
  email: string,
  password: string,
  username: string
): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/user/signup/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, password, username }),
  });

  const data = await handleJsonResponse<SignupResponse>(res);
  return data.result;
}


export async function loginUser(
  email: string,
  password: string
): Promise<{ user: AuthUser; tokens: AuthTokens }> {
  
  const loginRes = await fetch(`${API_URL}/user/login/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const user = await handleJsonResponse<AuthUser>(loginRes);

  
  const tokenRes = await fetch(`${API_URL}/user/token/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const tokens = await handleJsonResponse<AuthTokens>(tokenRes);

  return { user, tokens };
}


export async function refreshToken(refresh: string): Promise<AuthTokens> {
  const res = await fetch(`${API_URL}/user/token/refresh/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  const data = await handleJsonResponse<{ access: string }>(res);

  return { access: data.access, refresh };
}


export function saveAuthToStorage(user: AuthUser, tokens: AuthTokens) {
  if (typeof window === "undefined") return;

  localStorage.setItem("skypro_user", JSON.stringify(user));
  localStorage.setItem("skypro_access", tokens.access);
  localStorage.setItem("skypro_refresh", tokens.refresh);
}

export function clearAuthStorage() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("skypro_user");
  localStorage.removeItem("skypro_access");
  localStorage.removeItem("skypro_refresh");
}
