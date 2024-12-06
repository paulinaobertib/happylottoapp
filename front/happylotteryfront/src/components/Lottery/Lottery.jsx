import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import "./lottery.css";
import { BASE_URL } from "../../config";

export function Lottery() {
    const [values, setValues] = useState({
        name: "",
        date: "",
        endDate: "",
        participants: [{ name: "", email: "" }],
    });

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setValues((prevValues) => ({ ...prevValues, date: today }));
    }, []);

    const validateUniqueEmails = (participants) => {
        const emailSet = new Set();
        for (const participant of participants) {
            if (emailSet.has(participant.email)) {
                return "El correo electrónico no puede repetirse.";
            }
            emailSet.add(participant.email);
        }
        return null;
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required("El nombre del sorteo es obligatorio")
            .notOneOf(["nombre", "n/a"], "El nombre no puede ser genérico")
            .min(2, "El nombre debe tener al menos 2 caracteres")
            .test(
                "not-repeated-chars",
                "El nombre no puede contener caracteres repetidos consecutivamente",
                (value) => !/(.)\1{2,}/.test(value || "")
            ),
        date: Yup.string().required("La fecha de inicio es obligatoria"),
        endDate: Yup.string()
            .required("La fecha de finalización es obligatoria")
            .test(
                "is-after-start",
                "La fecha de finalización debe ser posterior a la fecha de inicio",
                function (value) {
                    return new Date(value) > new Date(values.date);
                }
            ),
        participants: Yup.array()
            .of(
                Yup.object().shape({
                    name: Yup.string()
                        .required("El nombre del participante es obligatorio")
                        .min(2, "El nombre debe tener al menos 2 caracteres")
                        .notOneOf(["nombre", "n/a"], "El nombre no puede ser genérico"),
                    email: Yup.string()
                        .required("El email del participante es obligatorio")
                        .email("El email no tiene un formato válido")
                })
            )
            .min(3, "Debe haber al menos tres participantes")
            .test("unique-emails", "El correo electrónico ya está registrado", function () {
                const emailError = validateUniqueEmails(values.participants);
                if (emailError) {
                    return this.createError({ message: emailError });
                }
                return true;
            }),
    });

    const handleParticipantChange = (index, field, value) => {
        const updatedParticipants = [...values.participants];
        updatedParticipants[index][field] = value;
        setValues({ ...values, participants: updatedParticipants });
    };

    const addParticipant = () => {
        setValues({
            ...values,
            participants: [...values.participants, { name: "", email: "" }],
        });
    };

    const removeParticipant = (index) => {
        const updatedParticipants = values.participants.filter((_, i) => i !== index);
        setValues({ ...values, participants: updatedParticipants });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loadingSwal = Swal.fire({
            title: 'Realizando el sorteo...',
            text: 'Por favor espere, estamos procesando la solicitud.',
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: false, 
            willOpen: () => {
                Swal.showLoading(); 
            }
        });

        try {
            const token = localStorage.getItem("token");
            const userId = token ? await getUserIdFromToken(token) : 1;  // Condicional para usar 1 si no hay token
            console.log("User ID:", userId);

            await validationSchema.validate(values, { abortEarly: false });

            const response = await fetch(`${BASE_URL}/api/l/lottery/create/${userId}?name=${values.name}&date=${values.date}&endDate=${values.endDate}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values.participants),
            });

            const responseText = await response.text();

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Sorteo Creado",
                    text: responseText,
                });
    
                setValues({
                    name: "",
                    date: new Date().toISOString().split("T")[0],
                    endDate: "",
                    participants: [{ name: "", email: "" }],
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: responseText || "Hubo un error al crear el sorteo", 
                });
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                const errorMessages = err.inner.map(e => e.message).join("\n");
                Swal.fire({
                    icon: "error",
                    title: "Errores de Validación",
                    text: errorMessages,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error de Validación",
                    html: err.message || "Hubo un error inesperado",
                });
            }
        }
    };

    const getUserIdFromToken = async (token) => {
        if (token) {
            const response = await fetch(`${BASE_URL}/api/u/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.text();
            const userData = parseUserData(data);
            return userData ? userData.id : 1;
        }
        return 1;
    };

    const parseUserData = (data) => {
        const userRegex = /User\(id=(\d+), name=(.*?), email=.*?, rol=(.*?),.*?\)/;
        const match = data.match(userRegex);
        return match
          ? { id: parseInt(match[1]), name: match[2], role: match[3] }
          : null;
    };

    return (
        <form className="lottery-form" onSubmit={handleSubmit}>
            <h1 className="form-title">Sorteo</h1>
            <div className="form-group">
                <label htmlFor="name">Nombre del Sorteo</label>
                <input
                    type="text"
                    id="name"
                    value={values.name}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label htmlFor="date">Fecha de Creación</label>
                <input
                    type="date"
                    id="date"
                    value={values.date}
                    disabled
                />
            </div>
            <div className="form-group">
                <label htmlFor="endDate">Fecha de Finalización</label>
                <input
                    type="date"
                    id="endDate"
                    value={values.endDate}
                    onChange={(e) => setValues({ ...values, endDate: e.target.value })}
                />
            </div>
            <div className="participants-section">
                <h2 className="participants-title">Participantes</h2>
                {values.participants.map((participant, index) => (
                    <div key={index} className="participant-group">
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={participant.name}
                            onChange={(e) =>
                                handleParticipantChange(index, "name", e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Correo electrónico"
                            value={participant.email}
                            onChange={(e) =>
                                handleParticipantChange(index, "email", e.target.value)
                            }
                        />
                        <button
                            type="button"
                            className="remove-button"
                            onClick={() => removeParticipant(index)}
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
                <button type="button" className="add-button" onClick={addParticipant}>
                    Añadir Participante
                </button>
            </div>
            <button type="submit" className="submit-button">
                Crear Sorteo
            </button>
        </form>
    );
}
