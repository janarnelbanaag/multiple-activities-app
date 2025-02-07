"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
import { deleteUser } from "../_helper/deleteUser";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const supabase = createClient();
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [authMode, setAuthMode] = useState("login");
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const checkUserSession = async () => {
            setLoading(true);
            const { data } = await supabase.auth.getSession();
            if (data?.session?.user) {
                setUser(data.session.user);
                setSession(data.session);
            } else {
                setUser(null);
                setSession(null);
            }
            setLoading(false);
        };

        checkUserSession();
        console.log("checking user session");
    }, []); // eslint-disable-line

    useEffect(() => {
        const resetSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data?.session) {
                setSession(data.session);
            } else {
                setSession(null);
            }
        };
    }, [user]); // eslint-disable-line

    console.log(session);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setErrorMessage("");
        setSuccessMessage("");
        setUser(null);
        setAuthMode("login");
        router.push("/");
    };

    const handleDeleteAccount = async (id) => {
        setLoading(true);

        const response = await deleteUser(id);

        if (!response.success) {
            setErrorMessage(response.error);
        }

        setLoading(false);
        setUser(null);
        setAuthMode("login");
    };

    return (
        <AuthContext.Provider
            value={{
                supabase,
                user,
                setUser,
                session,
                setSession,
                authMode,
                setAuthMode,
                loading,
                setLoading,
                successMessage,
                setSuccessMessage,
                errorMessage,
                setErrorMessage,
                handleLogout,
                handleDeleteAccount,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
