import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function HomePageComponent() {
  const { register, handleSubmit } = useForm();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function getAllTasks() {
      const response = await fetch("/api/tasks", {
        method: "GET",
        headers: {
          "Access-Control-Allow-Credentials": "true",
        },
      });
      const data = await response.json();
      setTasks(data);
    }

    getAllTasks();
  }, []);

  // Task creation
  const onSubmit = async (data) => {
    const task: string = data.task;
    // const { task } = data;
    if (!(task.trim().length > 0)) return;

    // push new task inside tasks array
    const insertedTaskResponse = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (insertedTaskResponse.ok) {
      const insertedTask = await insertedTaskResponse.json();
      setTasks([...tasks, insertedTask]);
    }
  };

  const handleTaskCompletion = async (id: string) => {
    const updatedTaskResponse = await fetch(`/api/tasks?id=${id}`, {
      method: "PUT",
    });
    if (updatedTaskResponse.ok) {
      const updatedTask = await updatedTaskResponse.json();
      // find index of the task with that specific id
      const taskIndex = tasks.findIndex((t) => t.id === id);
      if (taskIndex == -1) return;

      setTasks([
        ...tasks.slice(0, taskIndex),
        updatedTask,
        ...tasks.slice(taskIndex + 1),
      ]);
    }
  };

  const handleTaskDeletion = async (id: string) => {
    const response = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
    if (response.ok) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  return (
    <section className="h-full flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-x-4 mb-4">
          <input
            className="p-2 rounded-md border-2 border-slate-600 border-solid"
            type="text"
            placeholder="Enter your task"
            {...register("task")}
          />
          <button
            type="submit"
            className="text-white bg-slate-900 py-2 px-4 rounded-md"
          >
            Add
          </button>
        </div>
      </form>
      <div>
        {!tasks && <h1>Not tasks available</h1>}
        {tasks &&
          tasks.map((t, index) => (
            <div
              key={index}
              className="space-x-2 flex items-center justify-center"
            >
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => handleTaskCompletion(t.id)}
                id={"cb-" + t.id}
              />
              <label
                className={`text-xl ${t.completed ? "line-through" : ""}`}
                htmlFor={"cb-" + t.id}
              >
                {t.task}
              </label>
              <button
                className="font-semibold"
                onClick={() => handleTaskDeletion(t.id)}
              >
                X
              </button>
            </div>
          ))}
      </div>
    </section>
  );
}

export default HomePageComponent;
