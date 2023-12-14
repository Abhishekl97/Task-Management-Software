import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import App_login from "./App_login";
import App_password from "./App_password";
import "./index.scss";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App_login />
  },
  {
    path: '/password',
    element: <App_password />
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
