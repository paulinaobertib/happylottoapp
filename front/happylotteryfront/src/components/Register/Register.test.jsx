import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Register } from "./Register";
import Swal from "sweetalert2";

describe("Register Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    global.scrollTo = vi.fn();
    vi.spyOn(Swal, "fire");
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch.mockRestore();
    cleanup();
  });

  it("Se ve bien el componente del registro", () => {
    expect(screen.getByPlaceholderText("Nombre")).toBeTruthy();
    expect(screen.getByPlaceholderText("Email")).toBeTruthy();
    expect(screen.getByPlaceholderText("Numero (opcional)")).toBeTruthy();
    expect(screen.getByPlaceholderText("Contraseña")).toBeTruthy();
    expect(screen.getByPlaceholderText("Repetir Contraseña")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Registrarme/i })).toBeTruthy();
  });

  it("Campos vacios", async () => {
    fireEvent.click(screen.getByText("Registrarme"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error de Validación",
          text: "Debe ingresar los campos obligatorios para que se realice el registro",
        })
      );
    });
  });

  it("Email invalido", async () => {
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "paulinaobertibusso" },
    });
    fireEvent.click(screen.getByText("Registrarme"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error de Validación",
          html: expect.stringMatching(/El email no tiene un formato válido/),
        })
      );
    });
  });

  it("Contraseñas no coincide", async () => {
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "Paulina2003!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repetir Contraseña"), {
      target: { value: "Paulina2005!" },
    });
    fireEvent.click(screen.getByText("Registrarme"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error de Validación",
          html: expect.stringMatching(/Las contraseñas no coinciden/),
        })
      );
    });
  });

  it("Registro exitoso", async () => {
    const mockResponse = { ok: true, json: () => ({ message: "Registered successfully" }) };
    global.fetch.mockResolvedValue(mockResponse);

    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "Paulina" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "paulinaobertibusso@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "Paulina2003!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repetir Contraseña"), {
      target: { value: "Paulina2003!" },
    });
    fireEvent.click(screen.getByText("Registrarme"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/u\/user\/public\/signUp$/),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Paulina",
            email: "paulinaobertibusso@gmail.com",
            number: null,
            password: "Paulina2003!",
          }),
        }
      );

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "success",
          title: "Registro exitoso",
          text: "¡Te has registrado correctamente!",
        })
      );
    });
  });

  it("Falla el registro", async () => {
    const mockResponse = { ok: false, json: () => ({ message: "Registration failed" }) };
    global.fetch.mockResolvedValue(mockResponse);

    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "Paulina" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "paulinaobertibusso@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "Paulina2003!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repetir Contraseña"), {
      target: { value: "Paulina2003!" },
    });
    fireEvent.click(screen.getByText("Registrarme"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error en el registro",
          text: "Ocurrió un error al registrarse. Intenta nuevamente.",
        })
      );
    });
  });

  it("Fallo del lado del servicio", async () => {
    global.fetch.mockRejectedValue(new Error("Network error"));

    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "Paulina" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "paulinaobertibusso@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "Paulina2003!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repetir Contraseña"), {
      target: { value: "Paulina2003!" },
    });
    fireEvent.click(screen.getByText("Registrarme"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error de Conexión",
          text: "No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.",
        })
      );
    });
  });

  it("Nombre menor a 2 caracteres", async () => {
    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "P" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "paulinaobertibusso@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "Paulina2003!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repetir Contraseña"), {
      target: { value: "Paulina2003!" },
    });
    fireEvent.click(screen.getByText("Registrarme"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error de Validación",
          html: expect.stringMatching(/El nombre debe tener al menos 2 caracteres/),
        })
      );
    });
  });

  it("Nombre generico", async () => {
    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "nombre" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "paulinaobertibusso@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "Paulina2003!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repetir Contraseña"), {
      target: { value: "Paulina2003!" },
    });
    fireEvent.click(screen.getByText("Registrarme"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error de Validación",
          html: expect.stringMatching(/El nombre no puede ser genérico/),
        })
      );
    });
  });

  it("Nombre con caracteres repetidos", async () => {
    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "Paaaauuuuliiinaaa" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "paulinaobertibusso@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "Paulina2003!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repetir Contraseña"), {
      target: { value: "Paulina2003!" },
    });
    fireEvent.click(screen.getByText("Registrarme"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error de Validación",
          html: expect.stringMatching(/El nombre no puede tener caracteres repetidos consecutivamente/),
        })
      );
    });
  });

  it("Contraseña con menos de 8 caracteres", async () => {
    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "Paulina" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "paulinaobertibusso@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "Pau" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repetir Contraseña"), {
      target: { value: "Pau" },
    });
    fireEvent.click(screen.getByText("Registrarme"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error de Validación",
          html: expect.stringMatching(/La contraseña debe tener al menos 8 caracteres/),
        })
      );
    });
  });

  it("Contraseña sin mayuscula", async () => {
    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "Paulina" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "paulinaobertibusso@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "paulina2003!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repetir Contraseña"), {
      target: { value: "paulina2003!" },
    });
    fireEvent.click(screen.getByText("Registrarme"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error de Validación",
          html: expect.stringMatching(/La contraseña debe incluir al menos una letra mayúscula/),
        })
      );
    });
  });

  it("Contraseña sin numero", async () => {
    fireEvent.change(screen.getByPlaceholderText("Nombre"), {
      target: { value: "Paulina" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "paulinaobertibusso@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "Paulina!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repetir Contraseña"), {
      target: { value: "Paulina!" },
    });
    fireEvent.click(screen.getByText("Registrarme"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error de Validación",
          html: expect.stringMatching(/La contraseña debe incluir al menos un número/),
        })
      );
    });
  });
});