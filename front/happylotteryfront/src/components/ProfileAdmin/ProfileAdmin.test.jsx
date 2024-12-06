import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ProfileAdmin from "./ProfileAdmin";
import Swal from "sweetalert2";

// Mock de localStorage
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

describe("ProfileAdmin Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    global.scrollTo = vi.fn();
    vi.spyOn(Swal, "fire");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch.mockRestore();
    cleanup();
  });

  it("Usuario no autenticado", async () => {
    // Simulamos la ausencia del token en localStorage
    global.localStorage.getItem = vi.fn().mockReturnValue(null);

    render(
      <MemoryRouter>
        <ProfileAdmin />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        "Error",  
        "Debes iniciar sesión para acceder al perfil", 
        "error" 
      );
    });
  });
});

