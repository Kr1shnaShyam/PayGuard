// import axios from "axios";

// const BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

// const API = axios.create({
//   baseURL: BASE,
//   headers: { "Content-Type": "application/json" },
//   withCredentials: true,
// });

// // helper to set auth token for browser requests
// export function setAuthToken(token?: string | null) {
//   if (token) {
//     API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     localStorage.setItem("token", token);
//   } else {
//     delete API.defaults.headers.common["Authorization"];
//     localStorage.removeItem("token");
//   }
// }

// export default API;
// Axios wrapper used by all app pages
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000/api",
  withCredentials: false // backend returns JWT in body; we use Authorization header
});

export function setAuthToken(token: string | null) {
  if (token) API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete API.defaults.headers.common["Authorization"];
}

export default API;

