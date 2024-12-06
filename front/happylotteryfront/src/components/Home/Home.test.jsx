import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

describe("Home Component", () => {
    beforeEach(() => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
    });

    it("Se ve bien el componente Home", () => {
        expect(screen.getByText("¡Bienvenido a HappyLotto!")).toBeTruthy();
        expect(screen.getByText("Realiza sorteos de todo tipo de manera rápida y sencilla")).toBeTruthy();
        expect(screen.getByText("Solo completa el siguiente formulario:")).toBeTruthy();
    });
});