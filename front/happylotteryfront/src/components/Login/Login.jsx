import "./login.css";
import { useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config"

export function Login() {
    const [values, setValues] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("El email no tiene un formato válido")
            .required("El campo de email es obligatorio"),
        password: Yup.string()
            .required("El campo de contraseña es obligatorio"),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!values.email && !values.password) {
            Swal.fire({
                icon: "error",
                title: "Error de Validación",
                text: "Debes llenar ambos campos para poder ingresar",
            });
            return;
        }

        try {
            await validationSchema.validateAt("email", values);
            await validationSchema.validateAt("password", values);

            const response = await fetch(`${BASE_URL}/api/u/user/public/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });        

            if (response.ok) {
                const data = await response.json(); 
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    Swal.fire({
                        icon: "success",
                        title: "Inicio de sesión exitoso",
                        text: "¡Bienvenido de nuevo!",
                    });
                    navigate("/");
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error de solicitud",
                    text: "Las credenciales son incorrectas.",
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error de Validación",
                text: err.message,
            });
        }
    };

    return (
        <section>
            <h1>Inicia Sesión</h1>
            <form className="login" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Email"
                    value={values.email}
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                />
                <div className="password-field">
                    <input
                        type={showPassword ? "text" : "password"} 
                        placeholder="Contraseña"
                        value={values.password}
                        onChange={(e) => setValues({ ...values, password: e.target.value })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="show-password-btn"
                    >
                        <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                </div>
                <button type="submit">Iniciar Sesión</button>
                <button type="button">¿No tienes cuenta aún? ¡Únete!</button>
                <Link className="linkTo" to="/forgotPassword">Olvide mi contraseña</Link>
            </form>
        </section>
    );
}

