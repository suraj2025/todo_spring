import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaCheck, FaSave } from "react-icons/fa";
import { ImCheckboxUnchecked } from "react-icons/im";
import { IoMdAddCircle } from "react-icons/io";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await axios.post("http://localhost:8080/tasks", {
          text: newTask,
          completed: false,
        });
        setTasks([...tasks, response.data]);
        setNewTask("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  // Toggle task completion (Update in backend)
  const toggleTaskCompletion = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await axios.put(`http://localhost:8080/tasks/${task.id}`, updatedTask);
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task (Update backend)
  const deleteTask = async (id) => {
   
    try {
      await axios.delete(`http://localhost:8080/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditText(task.text);
  };

  // Save edited task (Update backend)
  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:8080/tasks/${id}`, { text: editText });
      setTasks(tasks.map((task) => (task.id === id ? { ...task, text: editText } : task)));
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "Completed") return task.completed;
    if (filter === "Incomplete") return !task.completed;
    return true;
  });

  return (
    <div className="container mx-auto p-4 max-w-xl pt-10">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-center mb-4">TODO LIST</h1>
        <div className="mb-4">
          <select
            className="border p-2 bg-gray-400"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Completed">Completed</option>
            <option value="Incomplete">Incomplete</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 flex-1"
          placeholder="Enter task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="bg-blue-500 border text-white rounded-full p-2" onClick={addTask}>
          <IoMdAddCircle className="size-8" />
        </button>
      </div>

      <ul className="bg-gray-300 shadow-lg p-4 border rounded-md">
        {tasks.length === 0 && (
          <p className="text-center">
            <b>You don't have any tasks yet</b> <br />
            Click on the + button to add one
          </p>
        )}

        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center p-2 m-1 bg-white border-none rounded-xl"
          >
            <button className="p-1 bg-gray-300 text-white" onClick={() => toggleTaskCompletion(task)}>
              {task.completed ? <FaCheck className="text-green-400" /> : <ImCheckboxUnchecked className="p-2" />}
            </button>

            {editingTask === task.id ? (
              <input
                type="text"
                className="border border-none rounded-2xl text-center p-1"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            ) : (
              <span className={task.completed ? "line-through" : ""}>{task.text}</span>
            )}

            <div className="flex gap-2">
              {editingTask === task.id ? (
                <button className="bg-green-500 text-white p-1 border rounded-full" onClick={() => saveEdit(task.id)}>
                  <FaSave />
                </button>
              ) : (
                <button className="bg-yellow-500 text-white p-1 border rounded-full" onClick={() => startEditing(task)}>
                  <FaEdit />
                </button>
              )}

              <button className="bg-red-500 text-white p-1 border rounded-full" onClick={() => deleteTask(task.id)}>
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
