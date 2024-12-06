import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ForgotPassword } from "./ForgotPassword";

describe("ForgotPassword Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    global.scrollTo = vi.fn();
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch.mockRestore();
    cleanup();
  });

  it("Se ve bien el componente de ForgotPassword", () => {
    expect(screen.getByText("Recuperar Contraseña")).toBeTruthy();
    expect(screen.getByPlaceholderText("Correo electrónico")).toBeTruthy();
    expect(screen.getByText("Enviar Código")).toBeTruthy();
  });

  it("Email invalido", async () => {
    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByText("Enviar Código"));

    await waitFor(() => {
      expect(screen.getByText("El correo electrónico no tiene un formato válido")).toBeTruthy();
    });
  });

  it("Email valido", async () => {
    const mockResponse = { ok: true, json: () => ({ token: "mockToken" }) };
    global.fetch.mockResolvedValue(mockResponse);

    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "paulinaobertibusso@gmail.com" },
    });
    fireEvent.click(screen.getByText("Enviar Código"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/u\/forgotPassword\/public\/verifyEmail\/paulinaobertibusso@gmail.com/),
        { method: "POST" }
      );
      expect(screen.getByText("Código enviado al correo")).toBeTruthy();
    });
  });

  it("Falla la verificacion del email", async () => {
    global.fetch.mockResolvedValue({ ok: false });

    fireEvent.change(screen.getByPlaceholderText("Correo electrónico"), {
      target: { value: "paulinaobertibusso@gmail.com" },
    });
    fireEvent.click(screen.getByText("Enviar Código"));

    await waitFor(() => {
      expect(screen.getByText("Error al verificar el correo")).toBeTruthy();
    });
  });
});
