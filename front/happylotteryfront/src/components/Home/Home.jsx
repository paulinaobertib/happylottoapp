import React from "react";
import './home.css';
import { Lottery } from "../Lottery/Lottery"

const Home = () => {
    return (
        <div className="home-container">
            <h1 className="home-title">¡Bienvenido a HappyLotto!</h1>
            <h2 className="home-subtitle">Realiza sorteos de todo tipo de manera rápida y sencilla</h2>
            <p className="home-text">Solo completa el siguiente formulario:</p>
            <Lottery />
        </div>
    );
};

export default Home;
