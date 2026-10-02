import { useEffect, useState } from "react";
import api from "../api/api";
import UserList from "../components/UserList";


function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadUsers() {
      try {
        const { data } = await api.get("/");
        if (isActive) setUsers(data);
      } catch (requestError) {
        if (isActive) {
          setError(requestError.response?.data?.message || "No se pudo cargar la lista de usuarios");
        }
      } finally {
        if (isActive) setLoading(false);
      }
    }

    loadUsers();
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Users</h1>
      {loading && <p>Cargando usuarios...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && users.length === 0 && <p>No hay usuarios registrados.</p>}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "30px",
        }}
      >
        {!loading && !error && users.map((user) => (
          <UserList key={user.id} user={user}/>
        ))}
      </div>
    </div>
  );
}


export default Users;
