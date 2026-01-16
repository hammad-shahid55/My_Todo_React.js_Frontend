import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiFileText, FiAlignLeft, FiSave, FiArrowLeft, FiEdit3 } from "react-icons/fi";
import { request } from "../api";
import ConfirmModal from "./ConfirmModal";
import "./style/AddTask.css";

const UpdateTask = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState(state?.title || state?.tittle || "");
  const [description, setDescription] = useState(state?.description || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [touched, setTouched] = useState({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const getError = (field) => {
    if (!touched[field]) return null;
    if (field === "title" && !title.trim()) return "Title is required";
    if (field === "title" && title.trim().length < 3) return "Title must be at least 3 characters";
    if (field === "description" && !description.trim()) return "Description is required";
    return null;
  };

  const handleSubmit = (e) => {
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

    setShowUpdateModal(true);
  };

  const handleConfirmUpdate = async () => {
    setShowUpdateModal(false);
    
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      const result = await request(`/update-task/${id}`, {
        method: "PUT",
        body: { title: title.trim(), description: description.trim() },
      });

      if (result.success) {
        setMessage({ text: "Task updated successfully!", type: "success" });
        setTimeout(() => navigate("/tasks"), 1000);
      } else {
        setMessage({ text: "Update failed", type: "error" });
      }
    } catch (error) {
      console.error("Update error:", error);
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
          <div className="form-icon update">
            <FiEdit3 />
          </div>
          <h2 className="addtask-heading">Update Task</h2>
          <p className="addtask-subtext">Edit your task details below</p>
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

        <button type="submit" className="addtask-button submit-btn" disabled={loading}>
          {loading ? (
            <span className="loading-spinner"></span>
          ) : (
            <>
              <FiSave /> Save Changes
            </>
          )}
        </button>
      </motion.form>

      <ConfirmModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onConfirm={handleConfirmUpdate}
        type="update"
        title="Update Task"
        message="Are you sure you want to save these changes?"
        confirmText="Save Changes"
        cancelText="Cancel"
      />
    </div>
  );
};

export default UpdateTask;
