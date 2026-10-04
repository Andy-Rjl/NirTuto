import { API_URL } from "../../../lib/api";

export async function getMe() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/me`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Non authentifié");

  return res.json();
}
