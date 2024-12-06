import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer"
import { navigation } from "./Routes/navigate";
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {navigation.map(({ id, path, Element }) => (
          <Route
            key={id}
            path={path}
            element={
              <>
                <Navbar />
                <Suspense fallback={<div>Loading...</div>}>
                  <div style={{ minHeight: "calc(100vh - 164px - 2rem)" }}>
                    <Element />
                  </div>
                </Suspense>
                <Footer />
              </>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

