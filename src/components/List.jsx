import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiEdit2, FiCheckSquare, FiSquare, FiClipboard, FiSearch } from "react-icons/fi";
import { request } from "../api";
import "./style/List.css";

const List = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await request(`/delete-task/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((task) => task._id !== id));
      setSelectedTasks((prev) => prev.filter((tid) => tid !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleSelect = (id) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map((t) => t._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedTasks.length === 0) return;
    if (!window.confirm(`Delete ${selectedTasks.length} selected task(s)?`)) return;

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

  const filteredTasks = tasks.filter(
    (task) =>
      (task.title || task.tittle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="list-container">
      <motion.div
        className="list-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="list-card-header">
          <div className="header-left">
            <div className="header-icon">
              <FiClipboard />
            </div>
            <div>
              <h2 className="list-heading">My Tasks</h2>
              <p className="list-subtext">{tasks.length} task{tasks.length !== 1 ? "s" : ""} total</p>
            </div>
          </div>
          <button className="add-task-btn" onClick={() => navigate("/add")}>
            <FiPlus /> Add Task
          </button>
        </div>

        <div className="list-toolbar">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <AnimatePresence>
            {selectedTasks.length > 0 && (
              <motion.button
                className="delete-selected-btn"
                onClick={handleDeleteSelected}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <FiTrash2 /> Delete ({selectedTasks.length})
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FiClipboard />
            </div>
            <h3>{searchQuery ? "No matching tasks" : "No tasks yet"}</h3>
            <p>{searchQuery ? "Try a different search term" : "Create your first task to get started"}</p>
            {!searchQuery && (
              <button className="empty-add-btn" onClick={() => navigate("/add")}>
                <FiPlus /> Create Task
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="table-header">
              <div className="th-checkbox" onClick={handleSelectAll}>
                {selectedTasks.length === filteredTasks.length && filteredTasks.length > 0 ? (
                  <FiCheckSquare className="check-icon checked" />
                ) : (
                  <FiSquare className="check-icon" />
                )}
              </div>
              <div className="th-sno">#</div>
              <div className="th-title">Title</div>
              <div className="th-description">Description</div>
              <div className="th-actions">Actions</div>
            </div>

            <div className="task-list">
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task._id}
                    className={`task-row ${selectedTasks.includes(task._id) ? "selected" : ""}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div className="td-checkbox" onClick={() => handleSelect(task._id)}>
                      {selectedTasks.includes(task._id) ? (
                        <FiCheckSquare className="check-icon checked" />
                      ) : (
                        <FiSquare className="check-icon" />
                      )}
                    </div>
                    <div className="td-sno">{index + 1}</div>
                    <div className="td-title">{task.title || task.tittle}</div>
                    <div className="td-description">{task.description}</div>
                    <div className="td-actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => navigate(`/update/${task._id}`, { state: task })}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(task._id)}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default List;
