import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../api";
import "./style/List.css";

const List = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const navigate = useNavigate();

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const result = await request("/tasks");
      if (result.success) setTasks(result.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear(); // remove token & user info
      navigate("/login");
    }
  };

  // Single delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await request(`/delete-task/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((task) => task._id !== id));
      setSelectedTasks((prev) => prev.filter((tid) => tid !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Toggle selection for checkboxes
  const handleSelect = (id) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  // Select all toggle
  const handleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((t) => t._id));
    }
  };

  // Delete multiple selected
  const handleDeleteSelected = async () => {
    if (selectedTasks.length === 0) return;
    if (!window.confirm("Delete selected tasks?")) return;

    try {
      await request("/delete-all-tasks", {
        method: "DELETE",
        body: { ids: selectedTasks },
      });

      setTasks((prev) => prev.filter((task) => !selectedTasks.includes(task._id)));
      setSelectedTasks([]);
    } catch (error) {
      console.error("Delete selected error:", error);
    }
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <button className="add-task-btn" onClick={() => navigate("/add")}>
          + Add Task
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

        {selectedTasks.length > 0 && (
          <button className="delete-selected-btn" onClick={handleDeleteSelected}>
            Delete Selected ({selectedTasks.length})
          </button>
        )}
      </div>

      <h2 className="list-heading">To Do List</h2>

      {loading ? (
        <p className="loading-text">Loading tasks...</p>
      ) : (
        <div className="table-wrapper">
          <table className="task-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedTasks.length === tasks.length && tasks.length > 0}
                  />
                </th>
                <th>S.No</th>
                <th>Title</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    No tasks found
                  </td>
                </tr>
              ) : (
                tasks.map((task, index) => (
                  <tr key={task._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task._id)}
                        onChange={() => handleSelect(task._id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{task.title || task.tittle}</td>
                    <td>{task.description}</td>
                    <td className="action-cell">
                      <button
                        className="update-btn"
                        onClick={() => navigate(`/update/${task._id}`, { state: task })}
                      >
                        Update
                      </button>

                      <button className="delete-btn" onClick={() => handleDelete(task._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default List;
