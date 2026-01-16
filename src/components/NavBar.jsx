import "./style/navbar.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../api";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const isUpdatePage = location.pathname.startsWith("/update/");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">📝 My Todo</div>

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
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
