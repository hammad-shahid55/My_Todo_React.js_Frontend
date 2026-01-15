import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { request } from "../api";
import "./style/AddTask.css";

const UpdateTask = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState(state?.title || state?.tittle || "");
  const [description, setDescription] = useState(state?.description || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await request(`/update-task/${id}`, {
        method: "PUT",
        body: { title, description },
      });

      if (result.success) {
        setMessage("Task updated successfully");

        navigate("/");

      } else {
        setMessage("Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addtask-container">
      <form className="addtask-form" onSubmit={handleUpdate}>
        <h2 className="addtask-heading">Update Task</h2>

        <input
          type="text"
          className="addtask-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="addtask-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {message && <p className="addtask-message">{message}</p>}

        <button type="submit" className="addtask-button" disabled={loading}>
          {loading ? "…" : "💾"}
        </button>
      </form>
    </div>
  );
};

export default UpdateTask;
