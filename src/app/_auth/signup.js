"use client";

import { useState } from "react";
import { createClient } from "../../../utils/supabase/client";
import { useAuth } from "../_context/AuthContext";

export default function Signup() {
    const {
        supabase,
        setAuthMode,
        setLoading,
        successMessage,
        setSuccessMessage,
        errorMessage,
        setErrorMessage,
    } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const { data: authData, error: authError } =
                await supabase.auth.signUp({
                    email,
                    password,
                });

            if (authError) {
                console.log("err");
                console.log(authError);
                throw new Error(authError.message);
            }

            await supabase.auth.signOut();
            setSuccessMessage(
                "Registered successfully! Please verify your account to login."
            );

            setTimeout(() => {
                setAuthMode("login");
                setLoading(false);
            }, 1000);
        } catch (err) {
            setErrorMessage(err.message);
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
        }
    };

    const toggleLogin = () => {
        setSuccessMessage("");
        setErrorMessage("");
        setAuthMode("login");
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
            {errorMessage && (
                <p className="text-red-500 text-center mb-4">{errorMessage}</p>
            )}

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
                    onClick={handleSignup}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Sign Up
                </button>
            </div>

            <div className="mt-4 text-center">
                <span className="text-sm">Already have an account? </span>
                <button
                    onClick={toggleLogin}
                    className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
