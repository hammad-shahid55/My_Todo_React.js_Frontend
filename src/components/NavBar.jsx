import "./style/navbar.css";
import { Link, NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="logo">📝 My Todo</div>

      <ul className="nav-links">
        <li>
          <NavLink to="/" end>
            List
          </NavLink>
        </li>
        <li>
          <NavLink to="/add">Add Task</NavLink>
        </li>
        <li>
          <NavLink to="/update">Update Task</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
