import "./style/List.css";

const List = () => {
  const tasks = [
    {
      id: 1,
      title: "Learn React",
      description: "Study components, props, and hooks",
    },
    {
      id: 2,
      title: "Build Todo App",
      description: "Create Add, List, and Edit pages",
    },
    {
      id: 3,
      title: "Practice JavaScript",
      description: "Improve logic and ES6 concepts",
    },
  ];

  return (
    <div className="list-container">
      <h2 className="list-heading">Task List</h2>

      <div className="task-grid">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>

            <div className="task-actions">
              <button className="edit-btn">Edit</button>
              <button className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
