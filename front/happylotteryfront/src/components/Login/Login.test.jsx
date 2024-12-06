import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Login } from "./Login";  // Asumiendo que Login está en esa ruta
import Swal from "sweetalert2";

describe("Login Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    global.scrollTo = vi.fn();
    vi.spyOn(Swal, "fire"); // Espiar Swal.fire
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch.mockRestore();
    cleanup();
  });

  it("Se ve bien el componente Login", () => {
    expect(screen.getByPlaceholderText("Email")).toBeTruthy();
    expect(screen.getByPlaceholderText("Contraseña")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Iniciar Sesión/i })).toBeTruthy();
  });

  it("Validacion para campos vacios", async () => {
    fireEvent.click(screen.getByText("Iniciar Sesión"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error de Validación",
          text: "Debes llenar ambos campos para poder ingresar",
        })
      );
    });
  });

  it("Email invalido", async () => {
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByText("Iniciar Sesión"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error de Validación",
          text: "El email no tiene un formato válido",
        })
      );
    });
  });

  it("Login exitoso", async () => {
    const mockResponse = { ok: true, json: () => ({ token: "mockToken" }) };
    global.fetch.mockResolvedValue(mockResponse);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "paulinaobertibusso@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "Paulina2003!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Iniciar Sesión/i }));

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringMatching(/^http:\/\/localhost:8090\/api\/u\/user\/public\/login$/),
          {
            method: "POST",
            body: JSON.stringify({ email: "paulinaobertibusso@gmail.com", password: "Paulina2003!" }),
            headers: { "Content-Type": "application/json" },
          }
        );
      });
  });

  it("Credenciales incorrectas", async () => {
    const mockResponse = { ok: false, json: () => ({ mensaje: "Las credenciales son incorrectas" }) };
    global.fetch.mockResolvedValue(mockResponse);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "paulinaobertibusso@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "Pau" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Iniciar Sesión/i }));

    await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith(
          expect.objectContaining({
            icon: "error",
            text: "Las credenciales son incorrectas.",
            title: "Error de solicitud",
          })
        );
      });      
  });

  it("Error de request", async () => {
    const mockResponse = { ok: false };
    global.fetch.mockResolvedValue(mockResponse);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "paulinaobertibusso@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "Paulina2003!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Iniciar Sesión/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Error de solicitud",
          text: "Las credenciales son incorrectas.",
        })
      );
    });
  });
});
