// app/(protected)/layout.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_context/AuthContext";

export default function ProtectedLayout({ children }) {
    const { supabase } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                if (!session) {
                    router.replace("/");
                    return;
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Auth check error:", error);
                router.replace("/");
            }
        };

        checkAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT" || !session) {
                router.replace("/");
            }
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, [router, supabase]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen text-lg font-semibold">
                Loading...
            </div>
        );
    }

    // if (isLoading) return null;

    return children;
}
