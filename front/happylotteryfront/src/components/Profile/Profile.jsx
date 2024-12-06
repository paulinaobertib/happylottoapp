import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [lotteries, setLotteries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire("Error", "Debes iniciar sesión para acceder al perfil", "error");
      navigate("/login");
      return;
    }

    fetch(`${BASE_URL}/api/u/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.text())
      .then((data) => {
        const userData = parseUserData(data);
        setUser(userData);
      })
      .catch((error) => {
        Swal.fire("Error", "No se pudo cargar el perfil del usuario", "error");
      });
  }, [navigate]);

  const parseUserData = (data) => {
    const userRegex = /User\(id=(\d+), name=(.*?), email=([^\s,]+),.*?rol=(.*?),.*?\)/;
    const match = data.match(userRegex);
    return match
      ? { 
          id: parseInt(match[1]), 
          name: match[2], 
          email: match[3],
          role: match[4] 
        }
      : null;
  };

  useEffect(() => {
    if (user && user.id) {
      const token = localStorage.getItem("token");
      fetchAllLotteries(token);
    }
  }, [user]);

  const fetchAllLotteries = (token) => {
    fetch(`${BASE_URL}/api/l/lottery/findByUserId/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la respuesta de la API');
        }
        return response.text();
      })
      .then((data) => { 
        try {
          const lotteriesData = parseLotteriesData(data);
          setLotteries(lotteriesData);
        } catch (error) {
          console.error('Error al parsear los datos:', error);
          Swal.fire("Error", "No se pudieron procesar los sorteos", "error");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        Swal.fire("Error", "No se pudieron cargar los sorteos", "error");
      });
  };
  

  const parseLotteriesData = (data) => {
    try {
      const lotteryRegex = /Lottery\(id=(\d+), name=(.*?), date=([0-9\-]+).*?, endDate=([0-9\-]+).*?\)/g;
      const matches = [...data.matchAll(lotteryRegex)];

      return matches.map((match) => ({
        name: match[2].trim(),
        date: match[3].trim().split(" ")[0],
        endDate: match[4].trim().split(" ")[0],
      }));
    } catch (error) {
      Dwal.fire("Error al parsear los sorteos:", error);
      return [];
    }
  };

  const deleteUser = () => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${BASE_URL}/api/u/user/delete/${user.email}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
              localStorage.removeItem("token")
              navigate("/login");
            } else {
              throw new Error("No se pudo eliminar el usuario");
            }
          })
          .catch((error) => {
            Swal.fire("Error", "No se pudo eliminar el usuario", "error");
          });
      }
    });
  };

  return (
    <div className="profile-container">
      {user && (
        <>
          <h1 className="profile-title">¡Bienvenido, {user.name}!</h1>
          <h2 className="profile-subtitle">Todos los sorteos:</h2>
          <table className="profile-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha de Inicio</th>
                <th>Fecha de Fin</th>
              </tr>
            </thead>
            <tbody>
              {lotteries.map((lottery, index) => (
                <tr key={index}>
                  <td>{lottery.name}</td>
                  <td>{lottery.date}</td>
                  <td>{lottery.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="profile-delete-button" onClick={deleteUser}>
            Eliminar Usuario
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;

