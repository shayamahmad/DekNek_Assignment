import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import DbStatusBar from "./components/DbStatusBar.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DbStatusBar />
        <App />
        <Toaster
          position="top-center"
          containerStyle={{ top: "2.75rem" }}
          toastOptions={{ duration: 4000 }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
