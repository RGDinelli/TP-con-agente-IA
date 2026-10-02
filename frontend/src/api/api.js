import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/users", //la URL base de la API, que puede ser configurada en un archivo .env
  headers: {
    "Content-Type": "application/json", //los datos que se envían al backend son JSON
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

export default api;