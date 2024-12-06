import { useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import "./forgotPassword.css";

export function ForgotPassword() {
    const [values, setValues] = useState({ email: "", otp: "", password: "", repeatPassword: "" });
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const emailValidationSchema = Yup.object().shape({
        email: Yup.string()
            .email("El correo electrónico no tiene un formato válido")
            .required("El campo de correo es obligatorio"),
    });

    const otpValidationSchema = Yup.object().shape({
        otp: Yup.number()
            .required("El campo de código es obligatorio")
            .typeError("El código debe ser un número"),
    });

    const passwordValidationSchema = Yup.object().shape({
        password: Yup.string()
            .required("El campo de contraseña es obligatorio")
            .min(8, "La contraseña debe tener al menos 8 caracteres")
            .matches(/[A-Z]/, "La contraseña debe incluir al menos una letra mayúscula")
            .matches(/\d/, "La contraseña debe incluir al menos un número"),
        repeatPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
            .required("El campo de confirmación es obligatorio"),
    });

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        try {
            await emailValidationSchema.validateAt("email", values);

            const loadingSwal = Swal.fire({
                title: 'Por favor espere',
                text: 'Estamos procesando la solicitud.',
                icon: 'info',
                allowOutsideClick: false,
                showConfirmButton: false, 
                willOpen: () => {
                    Swal.showLoading(); 
                }
            });

            const response = await fetch(`${BASE_URL}/api/u/forgotPassword/public/verifyEmail/${values.email}`, {
                method: "POST",
            });

            loadingSwal.close();

            if (!response.ok) {
                throw new Error("Error al verificar el correo");
            }

            Swal.fire("Éxito", "Código enviado al correo", "success");
            setStep(2);
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        try {
            await otpValidationSchema.validateAt("otp", values);

            const loadingSwal = Swal.fire({
                title: 'Por favor espere',
                text: 'Estamos procesando la solicitud.',
                icon: 'info',
                allowOutsideClick: false,
                showConfirmButton: false, 
                willOpen: () => {
                    Swal.showLoading(); 
                }
            });

            const response = await fetch(`${BASE_URL}/api/u/forgotPassword/public/verifyOtp/${values.email}/${values.otp}`, {
                method: "POST",
            });

            loadingSwal.close();

            if (!response.ok) {
                throw new Error("Código inválido o expirado");
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);

            Swal.fire("Éxito", "Código verificado, procede a cambiar la contraseña", "success");
            setStep(3);
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        try {
            await passwordValidationSchema.validateAt("password", values);
            await passwordValidationSchema.validateAt("repeatPassword", values);

            const token = localStorage.getItem("token");

            const loadingSwal = Swal.fire({
                title: 'Por favor espere',
                text: 'Estamos procesando la solicitud.',
                icon: 'info',
                allowOutsideClick: false,
                showConfirmButton: false, 
                willOpen: () => {
                    Swal.showLoading(); 
                }
            });

            const response = await fetch(`${BASE_URL}/api/u/forgotPassword/changePassword/${values.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    password: values.password,
                    repeatPassword: values.repeatPassword,
                }),
            });

            loadingSwal.close();

            if (!response.ok) {
                throw new Error("Error al cambiar la contraseña");
            }

            Swal.fire("Éxito", "Contraseña actualizada correctamente", "success");
            setStep(1);
            localStorage.removeItem("token");
            navigate("/login");
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    return (
        <section>
            <h1>Recuperar Contraseña</h1>
            <form className="forgot-password" onSubmit={step === 1 ? handleEmailSubmit : step === 2 ? handleOtpSubmit : handlePasswordSubmit}>
                {step === 1 && (
                    <>
                        <input
                            type="text"
                            placeholder="Correo electrónico"
                            value={values.email}
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                        />
                        <button type="submit">Enviar Código</button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <input
                            data-testid="otp-input"
                            type="text"
                            placeholder="Código recibido"
                            value={values.otp}
                            onChange={(e) => setValues({ ...values, otp: e.target.value })}
                        />
                        <button type="submit">Verificar Código</button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <input
                            type="password"
                            placeholder="Nueva Contraseña"
                            value={values.password}
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Repetir Contraseña"
                            value={values.repeatPassword}
                            onChange={(e) => setValues({ ...values, repeatPassword: e.target.value })}
                        />
                        <button type="submit">Cambiar Contraseña</button>
                    </>
                )}
            </form>
        </section>
    );
}
