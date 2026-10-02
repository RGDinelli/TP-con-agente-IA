import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginScheme } from "../modules/auth/schemes/loginScheme";
import { useAuth } from "../modules/auth/hooks/useAuth";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});

    try {
      await loginScheme.validate(form, { abortEarly: false });
    } catch (validationError) {
      const errors = {};
      validationError.inner.forEach((err) => {
        errors[err.path] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    try {
      await login(form);
      navigate("/users");
    } catch {
      // el mensaje de error ya queda en "error" (del hook useAuth)
    }
  }

  return (
    <div>
      <h1>Iniciar Sesión</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
          {fieldErrors.email && <p style={{ color: "red" }}>{fieldErrors.email}</p>}
        </div>

        <div>
          <label>Contraseña:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
          {fieldErrors.password && <p style={{ color: "red" }}>{fieldErrors.password}</p>}
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}

export default Login;