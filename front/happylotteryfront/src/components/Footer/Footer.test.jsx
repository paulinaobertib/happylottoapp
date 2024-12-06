import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import Footer from "./Footer";

describe("Footer Component", () => {
    beforeEach(() => {
        render(
            <Footer />
        );
    });

    it("Se ve bien el footer", () => {
        expect(screen.getByText("© 2025 HappyLottoApp - Paulina Oberti Busso")).toBeTruthy();
    });
});