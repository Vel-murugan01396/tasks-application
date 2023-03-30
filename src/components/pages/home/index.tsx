import React, { useState } from "react";
import { useForm } from "react-hook-form";

function HomePageComponent() {
  const { register, handleSubmit } = useForm();
  const [tasks, setTasks] = useState([]);

  const onSubmit = (data) => {
    const id = tasks.length + 1;
    const newTask = { ...data, completed: false, id };

    // push new task inside tasks array
    setTasks([...tasks, newTask]);
  };

  const handleTaskCompletion = (id: number) => {
    // find index of the task with that specific id
    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex == -1) return;

    const updateTask = tasks[taskIndex];
    updateTask.completed = !updateTask.completed;
    setTasks([
      ...tasks.slice(0, taskIndex),
      updateTask,
      ...tasks.slice(taskIndex + 1),
    ]);
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
            </div>
          ))}
      </div>
    </section>
  );
}

export default HomePageComponent;
