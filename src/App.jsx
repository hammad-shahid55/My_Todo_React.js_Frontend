import NavBar from './components/NavBar'
// import { useState } from 'react'
import './components/style/App.css'
import { Routes, Route } from 'react-router-dom'


function App() {
  // const [tasks, setTasks] = useState([])

  return (
    <>
      <NavBar />
<Routes>
  <Route path="/" element={<h1>List</h1>} />
  <Route path="/add" element={<h1>Add Task</h1>} />
  <Route path="/edit" element={<h1>Edit Task</h1>} />
</Routes>
    </>
  )
}

export default App
