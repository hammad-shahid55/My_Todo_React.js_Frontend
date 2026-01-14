import './style/navbar.css'
import { Link } from 'react-router-dom'
function NavBar() {
  return (
    <nav className="navbar">
        <div className="logo">My Todo App</div>
        <ul className="nav-links">
            <li><Link to="/">List</Link></li>
            <li><Link to="/add">Add Task</Link></li>
            <li><Link to="/edit">Edit Task</Link></li>

        </ul>
    </nav>
  )
}

export default NavBar