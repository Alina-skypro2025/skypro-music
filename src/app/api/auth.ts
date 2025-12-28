export type SignUpPayload = {
  email: string;
  password: string;
  username: string;
};

export async function signUpUser(data: SignUpPayload) {
  const response = await fetch(
    'https://webdev-music-003b5b991590.herokuapp.com/user/signup/',
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Ошибка регистрации');
  }

  return result;
}
