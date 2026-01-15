import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/AddTask.css";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) return;

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("http://localhost:3200/add-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage("Task added successfully!");

        setTitle("");
        setDescription("");

        setTimeout(() => {
          navigate("/");
        }, 200);
      } else {
        setMessage("Failed to add task");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addtask-container">
      <form className="addtask-form" onSubmit={handleSubmit}>
        <h2 className="addtask-heading">Add New Task</h2>

        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="addtask-input"
          required
        />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="addtask-textarea"
          required
        />

        {message && <p className="addtask-message">{message}</p>}

        <button
          type="submit"
          className="addtask-button"
          disabled={loading}
        >
          {loading ? "…" : "+"}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
