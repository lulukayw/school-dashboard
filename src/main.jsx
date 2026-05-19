import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Calendar from "./pages/Calendar.jsx";
import Class from "./pages/Class.jsx";
import Classes from "./pages/Classes.jsx";
import Students from "./pages/Students.jsx";
import Teachers from "./pages/Teachers.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/calendar", element: <Calendar /> },
      { path: "/classes", element: <Classes /> },
      { path: "/class", element: <Class /> },
      { path: "/teachers", element: <Teachers /> },
      {
        path: "/students",
        element: <Students />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
