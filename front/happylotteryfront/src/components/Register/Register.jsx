import "./register.css";
import { useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { Link, useNavigate} from "react-router-dom";
import { BASE_URL } from "../../config";

export function Register() {
    const navigate = useNavigate();
    
    const [values, setValues] = useState({
        name: "",
        email: "",
        number: "",
        password: "",
        repeatPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("El campo de nombre es obligatorio")
            .min(2, "El nombre debe tener al menos 2 caracteres")
            .notOneOf(["nombre", "n/a"], "El nombre no puede ser genérico")
            .test(
                "not-genérico",
                "El nombre no puede ser genérico",
                (value) => !["nombre", "n/a"].includes(value.toLowerCase())
            )
            .test(
                "no-repeated-chars",
                "El nombre no puede tener caracteres repetidos consecutivamente",
                (value) => !/(.)\1/.test(value || "")
            )
            .matches(/^[a-zA-Z]+$/, "El nombre no puede contener números ni caracteres especiales"),
        email: Yup.string()
            .email("El email no tiene un formato válido")
            .required("El campo de email es obligatorio"),
        password: Yup.string()
            .required("El campo de contraseña es obligatorio")
            .min(8, "La contraseña debe tener al menos 8 caracteres")
            .matches(/[A-Z]/, "La contraseña debe incluir al menos una letra mayúscula")
            .matches(/\d/, "La contraseña debe incluir al menos un número"),
        repeatPassword: Yup.string()
            .required("El campo de repetir contraseña es obligatorio")
            .oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!values.name && !values.email && !values.password && !values.repeatPassword) {
            Swal.fire({
                icon: "error",
                title: "Error de Validación",
                text: "Debe ingresar los campos obligatorios para que se realice el registro",
            });
            return;
        }

        try {
            await validationSchema.validate(values, { abortEarly: false });

            const payload = {
                name: values.name,
                email: values.email,
                number: values.number || null,
                password: values.password,
            };

            const response = await fetch(`${BASE_URL}/api/u/user/public/signUp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Registro exitoso",
                    text: "¡Te has registrado correctamente!",
                });

                navigate("/Login");

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error en el registro",
                    text: "Ocurrió un error al registrarse. Intenta nuevamente.",
                });
            }
        } catch (err) {
            if (err.inner) {
                console.error(err);
                Swal.fire({
                    icon: "error",
                    title: "Error de Validación",
                    html: err.inner.map((error) => `<p>${error.message}</p>`).join(""),
                });
            } else {
                console.error(err);
                Swal.fire({
                    icon: "error",
                    title: "Error de Conexión",
                    text: "No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.",
                });
            }
        }
    };

    return (
        <section>
            <h1>Registro</h1>
            <form className="register" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={values.name}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={values.email}
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Numero (opcional)"
                    value={values.number}
                    onChange={(e) => {
                        if (/^\d*$/.test(e.target.value)) { 
                            setValues({ ...values, number: e.target.value });
                        }
                    }}
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
                    >
                        <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                </div>
                <div className="password-field">
                    <input
                        type={showRepeatPassword ? "text" : "password"}
                        placeholder="Repetir Contraseña"
                        value={values.repeatPassword}
                        onChange={(e) => setValues({ ...values, repeatPassword: e.target.value })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    >
                        <i className={`fas ${showRepeatPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                </div>
                <button type="submit">Registrarme</button>
                <Link to="/login" className="linkLogin">¿Ya tienes cuenta? ¡Inicia sesión!</Link>
            </form>
        </section>
    );
}
