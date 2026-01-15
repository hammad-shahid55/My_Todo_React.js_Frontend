import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NavBar from "./components/NavBar";
import AddTask from "./components/AddTask";
import UpdateTask from "./components/UpdateTask";
import List from "./components/List";
import Login from "./components/Login";
import Signup from "./components/Signup";


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const AuthRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/tasks" replace /> : children;
};

function App() {
  return (
    <>
      <NavBar />
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <AuthRoute>
              <Signup />
            </AuthRoute>
          }
        />

        {/* Protected Task Routes */}
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <List />
            </PrivateRoute>
          }
        />

        <Route
          path="/add"
          element={
            <PrivateRoute>
              <AddTask />
            </PrivateRoute>
          }
        />

        <Route
          path="/update/:id"
          element={
            <PrivateRoute>
              <UpdateTask />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
