import { useState, useCallback } from "react";
import api from "../../../api/api";

// Hook simple de autenticación: expone login/register y el estado
// de loading/error, para que Login.jsx y Register.jsx no tengan que
// repetir la lógica de llamar a la API.
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(async ({ nombre, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/register", { nombre, email, password });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "No se pudo completar el registro";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/login", { email, password });
      if (typeof data.token !== "string" || !data.token) {
        throw new Error("La respuesta de autenticación no contiene un token válido");
      }

      localStorage.setItem("token", data.token);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Email o contraseña incorrectos";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, register, loading, error };
}