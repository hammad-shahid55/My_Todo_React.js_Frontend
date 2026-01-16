import { useState } from "react";
import "./style/navbar.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../api";
import ConfirmModal from "./ConfirmModal";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const isUpdatePage = location.pathname.startsWith("/update/");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    setShowLogoutModal(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo"></div>

        <ul className="nav-links">
          {!isLoggedIn ? (
            <>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/signup">Signup</NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/tasks">List</NavLink>
              </li>
              <li>
                <NavLink to="/add">Add Task</NavLink>
              </li>
              {isUpdatePage && (
                <li>
                  <NavLink to={location.pathname}>Update Task</NavLink>
                </li>
              )}
              <li>
                <button onClick={() => setShowLogoutModal(true)} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        type="logout"
        title="Logout"
        message="Are you sure you want to logout? You'll need to login again to access your tasks."
        confirmText="Logout"
        cancelText="Cancel"
      />
    </>
  );
}

export default NavBar;
