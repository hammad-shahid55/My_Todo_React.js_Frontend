import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import AddTask from "./components/AddTask";
import UpdateTask from "./components/UpdateTask";
import List from "./components/List";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        {/* Default "/" redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Task routes */}
        <Route path="/tasks" element={<List />} />
        <Route path="/add" element={<AddTask />} />
        <Route path="/update/:id" element={<UpdateTask />} />
      </Routes>
    </>
  );
}

export default App;
