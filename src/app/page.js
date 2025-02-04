"use client";

import { useAuth } from "./_context/AuthContext";
import Login from "./_auth/login";
import Signup from "./_auth/signup";
import Link from "next/link";
import DelLogoutBtn from "./_components/DelLogoutBtn";

export default function Home() {
    const {
        user,
        userData,
        authMode,
        setAuthMode,
        loading,
        handleLogout,
        handleDeleteAccount,
    } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-lg font-semibold">
                Loading...
            </div>
        );
    }

    const activities = [
        { href: "/simple-todo-list", label: "Simple Todo List" },
        { href: "/google-drive-lite", label: "Google Drive Lite" },
        { href: "/food-review-app", label: "Food Review App" },
        { href: "/pokemon-review-app", label: "Pokemon Review App" },
        { href: "/markdown-notes-app", label: "Markdown Notes App" },
    ];

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-8 bg-white shadow-lg rounded-xl">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
                Multiple Activities App
            </h1>
            {!user ? (
                authMode === "login" ? (
                    <Login />
                ) : (
                    <Signup />
                )
            ) : (
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4 text-gray-700">
                        Welcome, {userData?.name}
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                        Here are different activities for you:
                    </p>

                    {/* Activities */}
                    <div className="space-y-4">
                        {activities.map((act, i) => (
                            <Link
                                key={i}
                                href={act.href}
                                className="block w-full text-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300 hover:bg-blue-600 hover:scale-105"
                            >
                                {act.label}
                            </Link>
                        ))}
                    </div>

                    {/* Logout & Delete Account */}
                    <div className="mt-6">
                        <DelLogoutBtn
                            handleLogout={handleLogout}
                            handleDeleteAccount={handleDeleteAccount}
                            id={user.id}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
