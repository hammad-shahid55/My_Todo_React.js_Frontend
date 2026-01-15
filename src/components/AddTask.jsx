import React, { useState } from "react";
import "./style/AddTask.css";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, description });
    setTitle("");
    setDescription("");
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

        <button type="submit" className="addtask-button">
          +
        </button>
      </form>
    </div>
  );
};

export default AddTask;
