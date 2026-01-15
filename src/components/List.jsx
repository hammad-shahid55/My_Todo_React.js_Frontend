import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/List.css";

const List = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3200/tasks");
      const result = await response.json();

      if (result.success) {
        setTasks(result.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await fetch(`http://localhost:3200/delete-task/${id}`, {
        method: "DELETE",
      });

      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="list-container">
      <h2 className="list-heading">To Do List</h2>

      {loading ? (
        <p className="loading-text">Loading tasks...</p>
      ) : (
        <div className="table-wrapper">
          <table className="task-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Title</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data">
                    No tasks found
                  </td>
                </tr>
              ) : (
                tasks.map((task, index) => (
                  <tr key={task._id}>
                    <td>{index + 1}</td>
                    <td>{task.title || task.tittle}</td>
                    <td>{task.description}</td>
                    <td className="action-cell">
                      <button
                        className="update-btn"
                        onClick={() =>
                          navigate(`/edit/${task._id}`, { state: task })
                        }
                      >
                        Update
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(task._id)}
                      >
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
