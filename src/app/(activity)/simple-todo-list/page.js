"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import { useAuth } from "@/app/_context/AuthContext";
import HeaderComponent from "@/app/_components/HeaderComponent";

export default function TodosPage() {
    const { supabase, user, handleLogout } = useAuth();

    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState("");
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const fetchTodos = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("todos")
            .select("*")
            .order("created_at", { ascending: true });
        if (error) {
            console.error("Error fetching todos:", error);
        } else {
            setTodos(data);
        }
        setLoading(false);
    };

    const addTodo = async (e) => {
        e.preventDefault();
        if (!task) return;

        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) return;
        const { user } = session;
        const { error } = await supabase
            .from("todos")
            .insert([{ task, user_id: user.id }]);
        if (error) {
            console.error("Error adding todo:", error);
        } else {
            setTask("");
            fetchTodos();
        }
    };

    const toggleComplete = async (todo) => {
        const { error } = await supabase
            .from("todos")
            .update({ is_complete: !todo.is_complete })
            .eq("id", todo.id);
        if (error) {
            console.error("Error updating todo:", error);
        } else {
            fetchTodos();
        }
    };

    const deleteTodo = async (todoId) => {
        const { error } = await supabase
            .from("todos")
            .delete()
            .eq("id", todoId);
        if (error) {
            console.error("Error deleting todo:", error);
        } else {
            fetchTodos();
        }
    };

    const handleHome = () => {
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
                <HeaderComponent
                    title="My To-Do List"
                    handleLogout={handleLogout}
                />

                <form onSubmit={addTodo} className="mt-6 mb-4 flex">
                    <input
                        type="text"
                        placeholder="Enter a new task"
                        className="flex-grow border rounded-l px-3 py-2"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
                    >
                        Add
                    </button>
                </form>
                {loading ? (
                    <p>Loading todos...</p>
                ) : todos.length ? (
                    <ul>
                        {todos.map((todo) => (
                            <li
                                key={todo.id}
                                className="flex items-center justify-between border-b py-2"
                            >
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={todo.is_complete}
                                        onChange={() => toggleComplete(todo)}
                                        className="mr-2"
                                    />
                                    <span
                                        className={
                                            todo.is_complete
                                                ? "line-through text-gray-500"
                                                : ""
                                        }
                                    >
                                        {todo.task}
                                    </span>
                                </div>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No todos yet. Add one!</p>
                )}
            </div>
        </div>
    );
}
