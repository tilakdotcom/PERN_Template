export const registerUserRequest = "/auth/register";
export const loginUserRequest = "/auth/login";
export const logoutUserRequest = "/auth/logout";
export const getUserRequest = "/user";

export const loginWithGoogleRequest = (code: string) => `/auth/google-login?code=${code}`;
