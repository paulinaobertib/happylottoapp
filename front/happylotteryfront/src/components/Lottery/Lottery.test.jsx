import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Lottery } from "./Lottery"; // Asegúrate de que sea la ruta correcta
import Swal from "sweetalert2";

describe("Lottery Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    global.scrollTo = vi.fn();
    vi.spyOn(Swal, "fire"); // Espiar Swal.fire
    render(
      <MemoryRouter>
        <Lottery />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch.mockRestore();
    cleanup();
  });

  it("Campos vacios", async () => {
    fireEvent.click(screen.getByText("Crear Sorteo"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Errores de Validación",
          text: expect.stringContaining("El nombre del sorteo es obligatorio"),
        })
      );
    });
  });

  it("Fecha de fin invalida", async () => {
    fireEvent.change(screen.getByLabelText("Nombre del Sorteo"), {
      target: { value: "Sorteo válido" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de Finalización"), {
      target: { value: "2024-12-05" },
    });
    fireEvent.click(screen.getByText("Crear Sorteo"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Errores de Validación",
          text: expect.stringContaining("La fecha de finalización debe ser posterior a la fecha de inicio"),
        })
      );
    });
  });

  it("Se crea correctamente el sorteo", async () => {
    const mockResponse = { ok: true, text: () => Promise.resolve("Sorteo creado exitosamente") };
    global.fetch.mockResolvedValue(mockResponse);
  
    fireEvent.change(screen.getByLabelText("Nombre del Sorteo"), {
      target: { value: "Sorteo Prueba" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de Finalización"), {
      target: { value: "2024-12-31" },
    });
  
    const removeButtons = screen.getAllByText("Eliminar");
    fireEvent.click(removeButtons[removeButtons.length - 1]);
  
    const addParticipantButton = screen.getByText("Añadir Participante");
  
    for (let i = 0; i < 3; i++) {
      fireEvent.click(addParticipantButton);
      const participantName = screen.getAllByPlaceholderText("Nombre")[i];
      const participantEmail = screen.getAllByPlaceholderText("Correo electrónico")[i];
      fireEvent.change(participantName, { target: { value: `Participante ${i + 1}` } });
      fireEvent.change(participantEmail, { target: { value: `participante${i + 1}@gmail.com` } });
    }
  
    fireEvent.click(screen.getByText("Crear Sorteo"));
  
    await waitFor(() => {
      // Validar primera llamada a Swal.fire (spinner)
      expect(Swal.fire).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          icon: "info",
          title: "Realizando el sorteo...",
          text: "Por favor espere, estamos procesando la solicitud.",
          showConfirmButton: false,
          allowOutsideClick: false,
        })
      );
  
      // Validar segunda llamada a Swal.fire (éxito)
      expect(Swal.fire).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          icon: "success",
          title: "Sorteo Creado",
          text: "Sorteo creado exitosamente",
        })
      );
    });
  });  

  it("Validacion de los campos del formulario", async () => {
    // Simular la respuesta de la API
    global.fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: "Error al crear el sorteo" }),
    });
  
    fireEvent.change(screen.getByLabelText("Nombre del Sorteo"), {
      target: { value: "Sorteo Prueba" }, 
    });
    fireEvent.change(screen.getByLabelText("Fecha de Finalización"), {
      target: { value: "2024-12-31" },
    });
  
    const addParticipantButton = screen.getByText("Añadir Participante");
    fireEvent.click(addParticipantButton);

    fireEvent.click(screen.getByText("Crear Sorteo"));
  
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Errores de Validación",
          text: expect.stringContaining("El nombre del participante es obligatorio"),
        })
      );
    });
  
    fireEvent.change(screen.getByLabelText("Nombre del Sorteo"), {
      target: { value: "Sorteo Prueba" },
    });
  
    fireEvent.change(screen.getAllByPlaceholderText("Nombre")[0], { target: { value: "Participante 1" } });
    fireEvent.change(screen.getAllByPlaceholderText("Correo electrónico")[0], { target: { value: "paulinaobertibusso@gmail.com" } });
  
    fireEvent.click(addParticipantButton);
  
    fireEvent.change(screen.getAllByPlaceholderText("Nombre")[1], { target: { value: "Participante 2" } });
    fireEvent.change(screen.getAllByPlaceholderText("Correo electrónico")[1], { target: { value: "paulinaobertibusso@gmail.com" } });
  
    fireEvent.click(screen.getByText("Crear Sorteo"));
  
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Errores de Validación",
          text: expect.stringContaining("El correo electrónico no puede repetirse."),
        })
      );
    });
  
    fireEvent.click(addParticipantButton);
  
    fireEvent.change(screen.getAllByPlaceholderText("Nombre")[2], { target: { value: "Participante 3" } });
    fireEvent.change(screen.getAllByPlaceholderText("Correo electrónico")[2], { target: { value: "paulinaobertibusso2@gmail.com" } });
  
    fireEvent.click(screen.getByText("Crear Sorteo"));
  
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "info",
          title: "Realizando el sorteo...",
          text: "Por favor espere, estamos procesando la solicitud.",
        })
      );
    });
  });
  
  it("Hay menos de 3 participantes", async () => {
    fireEvent.change(screen.getByLabelText("Nombre del Sorteo"), {
        target: { value: "Sorteo Prueba" },
    });
    fireEvent.change(screen.getByLabelText("Fecha de Finalización"), {
        target: { value: "2024-12-31" },
    });

    const removeButtons = screen.getAllByText("Eliminar");
    fireEvent.click(removeButtons[removeButtons.length - 1]);

    const addParticipantButton = screen.getByText("Añadir Participante");

    for (let i = 0; i < 2; i++) {
        fireEvent.click(addParticipantButton);
        const participantName = screen.getAllByPlaceholderText("Nombre")[i];
        const participantEmail = screen.getAllByPlaceholderText("Correo electrónico")[i];
        fireEvent.change(participantName, { target: { value: `Participante ${i + 1}` } });
        fireEvent.change(participantEmail, { target: { value: `participante${i + 1}@gmail.com` } });
    }

    fireEvent.click(screen.getByText("Crear Sorteo"));

    await waitFor(() => {
        // Validar la primera llamada (spinner)
        expect(Swal.fire).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            icon: "info",
            title: "Realizando el sorteo...",
            text: "Por favor espere, estamos procesando la solicitud.",
            showConfirmButton: false,
            allowOutsideClick: false,
          })
        );
      
        expect(screen.getByText('Debe haber al menos tres participantes')).toBeTruthy();              
      });
    });
});
