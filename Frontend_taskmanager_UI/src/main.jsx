import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import App_login from "./App_login";
import "./index.scss";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App_login />
  },
  {
    path: '/board',
    element: <App />
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />

  // <React.StrictMode>

  // <App_login />
  // </React.StrictMode>
);
