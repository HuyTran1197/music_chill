import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import { LibraryProvider } from "./context/LibraryContext.jsx";
import { PlayerProvider } from "./context/PlayerContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <LibraryProvider>
                <PlayerProvider>
                    <App />
                </PlayerProvider>
            </LibraryProvider>
        </BrowserRouter>
    </React.StrictMode>
);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((err) => {
            console.warn("Không đăng ký được service worker:", err);
        });
    });
}