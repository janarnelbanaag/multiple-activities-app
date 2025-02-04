"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../_context/AuthContext";

export default function Login() {
    const {
        supabase,
        setUser,
        setAuthMode,
        setLoading,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
    } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
            setUser(data.user);
        }

        setLoading(false);
    };

    const toggleRegister = () => {
        setSuccessMessage("");
        setErrorMessage("");
        setAuthMode("signup");
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
            <div className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleLogin}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Login
                </button>
            </div>

            <div className="mt-4 text-center">
                <span className="text-sm">Don&apos;t have an account? </span>
                <button
                    onClick={toggleRegister}
                    className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                >
                    Register
                </button>
            </div>
            {errorMessage && (
                <p className="mt-4 text-red-500 text-center">{errorMessage}</p>
            )}
            {successMessage && (
                <p className="mt-4 text-green-500 text-center">
                    {successMessage}
                </p>
            )}
        </div>
    );
}
