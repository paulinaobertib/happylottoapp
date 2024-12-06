import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import "./navbar.css";

const Navbar = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getUserDetailsFromToken = async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/u/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const textResponse = await response.text();

      const nameMatch = textResponse.match(/name=([\w\s]+)/);
      const name = nameMatch && nameMatch[1] ? nameMatch[1] : "";

      const roleMatch = textResponse.match(/rol=(\w+)/);
      const role = roleMatch && roleMatch[1] ? roleMatch[1] : "";

      if (name && role) {
        return { name, role };
      } else {
        console.error("No se pudieron encontrar todos los datos en la respuesta:", textResponse);
        return { name: "", role: "" };
      }
    } catch (error) {
      console.error("Error al obtener los detalles del usuario:", error);
      return { name: "", role: "" };
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (token) {
        const { name, role } = await getUserDetailsFromToken(token);
        setUserName(name);
        setUserRole(role);
      }
    };
    fetchUserDetails();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserName("");
    setUserRole("");
    navigate("/");
  };

  return (
    <nav>
      <div className="left-buttons">
        <Link to="/">Home</Link>
        <button onClick={() => navigate(-1)}>Página Anterior</button>
        {!token && (
          <>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>
      {token && userName && (
        <div className="right-buttons">
          <Link
            to={userRole === "admin" ? "/profileAdmin" : "/profile"}
            className="username"
          >
            {userName}
          </Link>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

