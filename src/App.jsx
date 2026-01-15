import NavBar from './components/NavBar'
import './components/style/App.css'
import { Routes, Route } from 'react-router-dom'
import AddTask from './components/AddTask'
import List from './components/List'
function App() {


  return (
    <>
      <NavBar />
<Routes>
  <Route path="/" element={<List />} />
  <Route path="/add" element={<AddTask />} />
  <Route path="/edit" element={<h1>Edit Task</h1>} />
</Routes>
    </>
  )
}

export default App
