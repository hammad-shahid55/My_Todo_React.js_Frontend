import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiFileText, FiAlignLeft, FiPlus, FiArrowLeft } from "react-icons/fi";
import { request } from "../api";
import "./style/AddTask.css";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();

  const getError = (field) => {
    if (!touched[field]) return null;
    if (field === "title" && !title.trim()) return "Title is required";
    if (field === "title" && title.trim().length < 3) return "Title must be at least 3 characters";
    if (field === "description" && !description.trim()) return "Description is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ title: true, description: true });

    if (!title.trim() || !description.trim()) {
      setMessage({ text: "Please fill in all fields", type: "error" });
      return;
    }

    if (title.trim().length < 3) {
      setMessage({ text: "Title must be at least 3 characters", type: "error" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const result = await request("/add-task", {
        method: "POST",
        body: { title: title.trim(), description: description.trim() },
      });

      if (result.success) {
        setMessage({ text: "Task added successfully!", type: "success" });
        setTitle("");
        setDescription("");
        setTouched({});
        setTimeout(() => navigate("/tasks"), 1000);
      } else {
        setMessage({ text: "Failed to add task", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "Server error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const charCount = description.length;
  const maxChars = 500;

  return (
    <div className="addtask-container">
      <motion.form
        className="addtask-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button type="button" className="back-btn" onClick={() => navigate("/tasks")}>
          <FiArrowLeft /> Back to Tasks
        </button>

        <div className="form-header">
          <div className="form-icon">
            <FiPlus />
          </div>
          <h2 className="addtask-heading">Create New Task</h2>
          <p className="addtask-subtext">Add a task to your list and stay organized</p>
        </div>

        <div className="input-group">
          <label className="input-label">
            <FiFileText /> Task Title
          </label>
          <input
            type="text"
            placeholder="Enter task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTouched({ ...touched, title: true })}
            className={`addtask-input ${getError("title") ? "input-error" : ""}`}
          />
          {getError("title") && <span className="error-hint">{getError("title")}</span>}
          <span className="field-hint">Give your task a clear, descriptive title</span>
        </div>

        <div className="input-group">
          <label className="input-label">
            <FiAlignLeft /> Description
          </label>
          <textarea
            placeholder="Describe what needs to be done..."
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, maxChars))}
            onBlur={() => setTouched({ ...touched, description: true })}
            className={`addtask-textarea ${getError("description") ? "input-error" : ""}`}
          />
          <div className="textarea-footer">
            {getError("description") ? (
              <span className="error-hint">{getError("description")}</span>
            ) : (
              <span className="field-hint">Add details about the task</span>
            )}
            <span className={`char-count ${charCount >= maxChars ? "limit" : ""}`}>
              {charCount}/{maxChars}
            </span>
          </div>
        </div>

        {message.text && (
          <motion.div
            className={`addtask-message ${message.type}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {message.text}
          </motion.div>
        )}

        <button type="submit" className="addtask-button" disabled={loading}>
          {loading ? (
            <span className="loading-spinner"></span>
          ) : (
            <>
              <FiPlus /> Add Task
            </>
          )}
        </button>
      </motion.form>
    </div>
  );
};

export default AddTask;
