import { apiFetch } from "./api";
import { config } from "../config";

export async function login(username, password) {
  const data = await apiFetch(config.ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
}

export async function signup(email, password) {
  return apiFetch(config.ENDPOINTS.AUTH.REGISTER, {
    method: "POST",
    body: JSON.stringify({ username: email, email, password }),
  });
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
} 