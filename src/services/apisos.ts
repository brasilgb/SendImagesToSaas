import axios from "axios";

const apisos = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_SERVER_IP}/api/`,
  headers: {
    "Content-Type": "application/json",
    Accept: "Application/json",
  },
});

export function setApiAuthToken(token: string | null) {
  if (token) {
    apisos.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete apisos.defaults.headers.common.Authorization;
}

export default apisos;
