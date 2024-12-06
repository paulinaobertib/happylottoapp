import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./profileadmin.css";

const ProfileAdmin = () => {
  const [lotteries, setLotteries] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoadingLotteries, setIsLoadingLotteries] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire("Error", "Debes iniciar sesión para acceder al perfil", "error");
      navigate("/login");
      return;
    }

    fetchAllLotteries(token);
    fetchAllUsers(token);
  }, [navigate]);

  const fetchAllLotteries = (token) => {
  setIsLoadingLotteries(true);

  fetch(`${BASE_URL}/api/l/lottery/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    })
        .then((response) => {
        if (!response.ok) {
            throw new Error("Error al obtener los sorteos");
        }
        return response.text();
        })
        .then((data) => {
        if (!data) {
            throw new Error("Los datos de los sorteos están vacíos o no son válidos.");
        }
        const lotteriesData = parseLotteriesResponse(data) || [];
        console.log(lotteriesData);
        setLotteries(lotteriesData);
        })
        .catch((error) => {
        console.error("Error al obtener los sorteos:", error);
        Swal.fire("Error", "No se pudieron cargar los sorteos", "error");
        })
        .finally(() => {
        setIsLoadingLotteries(false);
        });
    };

    const parseLotteriesResponse = (responseText) => {
        const lotteries = [];
        const regex = /LotteryDTO\(name=(.*?), date=(.*?), endDate=(.*?), user=User\(id=(.*?), name=(.*?), email=(.*?), number=(.*?)\)\)/g;
        let match;
        while ((match = regex.exec(responseText)) !== null) {
            lotteries.push({
                name: match[1].trim(),
                date: match[2].trim(),
                endDate: match[3].trim(),
                user: {
                    id: match[4].trim() === "null" ? null : parseInt(match[4].trim()),
                    name: match[5].trim() === "null" ? null : match[5].trim(),
                    email: match[6].trim() === "null" ? null : match[6].trim(),
                    number: match[7].trim() === "null" ? null : match[7].trim(),
                },
            });
        }
        return lotteries;
    };    
      
  const fetchAllUsers = (token) => {
    fetch(`${BASE_URL}/api/u/user/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.text())
      .then((data) => {
        const usersData = parseUsersData(data);
        setUsers(usersData);
      })
      .catch((error) => {
        console.error("Error al obtener los usuarios:", error);
        Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
      });
  };

  const parseUsersData = (data) => {
    const userRegex = /User\(id=(\d+), name=(.*?), email=([^\s,]+),.*?rol=(.*?),.*?\)/g;
    const matches = [...data.matchAll(userRegex)];
    return matches.map((match) => ({
      id: parseInt(match[1]),
      name: match[2].trim(),
      email: match[3].trim(),
      role: match[4].trim(),
    }));
  };

  const deleteUser = (email) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: "¿Estás seguro?",
      text: `Eliminarás al usuario: ${email}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${BASE_URL}/api/u/user/deleteUser/${email}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
              setUsers(users.filter((user) => user.email !== email));
            } else {
              throw new Error("No se pudo eliminar el usuario");
            }
          })
          .catch((error) => {
            console.error("Error al eliminar el usuario:", error);
            Swal.fire("Error", "No se pudo eliminar el usuario", "error");
          });
      }
    });
  };

  const changeUserRole = (email) => {
    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/u/user/rol/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire("Rol cambiado", `El rol del usuario ${email} se actualizó.`, "success");
          fetchAllUsers(token);
        } else {
          throw new Error("No se pudo cambiar el rol");
        }
      })
      .catch((error) => {
        console.error("Error al cambiar el rol:", error);
        Swal.fire("Error", "No se pudo cambiar el rol del usuario", "error");
      });
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Panel de Administración</h1>
      
      <h2 className="profile-subtitle">Sorteos Disponibles</h2>
        {isLoadingLotteries ? (
        <p>Cargando sorteos...</p>
        ) : (
        <table className="profile-table">
            <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Fecha de Inicio</th>
                <th>Fecha de Fin</th>
                <th>Email</th>
            </tr>
            </thead>
            <tbody>
            {lotteries.map((lottery, index) => (
                <tr key={index}>
                <td>{lottery.user.id || "Sin ID"}</td>
                <td>{lottery.name}</td>
                <td>{lottery.date}</td>
                <td>{lottery.endDate}</td>
                <td>{lottery.user.email || "Sin correo"}</td>
                </tr>
                ))}
                </tbody>
            </table>
            )}

      <h2 className="profile-subtitle">Usuarios Registrados</h2>
      <table className="profile-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="profile-delete-button"
                  onClick={() => deleteUser(user.email)}
                >
                  Eliminar
                </button>
                <button
                  className="profile-delete-button"
                  style={{ backgroundColor: "rgb(47, 71, 211)" }}
                  onClick={() => changeUserRole(user.email)}
                >
                  Cambiar Rol
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfileAdmin;
