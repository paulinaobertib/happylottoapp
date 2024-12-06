import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./NavBar";

// Mocking useNavigate and preserving other exports from react-router-dom
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal(); // Import actual module
    return {
      ...actual,
      useNavigate: vi.fn(() => vi.fn()), // Mock useNavigate
    };
});
  
// Mocking localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

// Mocking fetch
global.fetch = vi.fn();

describe("Navbar Component", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Se ve bien el navbar cuando no estas autenticado", () => {
    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Iniciar Sesión")).toBeTruthy();
    expect(screen.getByText("Registrarse")).toBeTruthy();
  });

  it("Se ve bien el navbar cuando estas autenticado", async () => {
    window.localStorage.setItem("token", "fakeToken");
    global.fetch.mockResolvedValueOnce({
      text: () =>
        Promise.resolve("name=Usuario de Prueba&rol=admin"),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Usuario de Prueba")).toBeTruthy();
      expect(screen.getByText("Cerrar Sesión")).toBeTruthy();
    });
  });
});